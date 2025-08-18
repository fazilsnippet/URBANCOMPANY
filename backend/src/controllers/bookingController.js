import mongoose from "mongoose";
import { Booking } from "../models/booking.model.js";
import { Slot } from "../models/slot.model.js";
import { Service } from "../models/service.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


// ===================== CREATE BOOKING =====================
   const createBooking = asyncHandler(async (req, res) => {
  const { serviceId, slotId, notes, paymentMethod = "COD" } = req.body;

  // Validate service
  const service = await Service.findById(serviceId);
  if (!service) throw new ApiError(404, "Service not found");

  // Validate slot
  const slot = await Slot.findById(slotId);
  if (!slot) throw new ApiError(404, "Slot not found");

  if (slot.booked >= slot.capacity) {
    throw new ApiError(400, "This slot is fully booked");
  }

  // Price calculation
  const subTotal = service.price;
  const discount = service.discount || 0;
  const tax = (subTotal - discount) * 0.18; // 18% GST
  const grandTotal = subTotal - discount + tax;

  // Create booking
  const booking = await Booking.create({
    user: req.user._id,
    service: service._id,
    slot: slot._id,
    notes,
    status: "pending",
    amount: {
      subTotal,
      discount,
      tax,
      shipping: 0,
      grandTotal,
      currency: "INR",
    },
    payment: {
      method: paymentMethod,
      status: paymentMethod === "COD" ? "unpaid" : "pending",
      paymentId: null,
      receipt: null,
    },
    timeline: [{ at: new Date(), status: "pending", note: "Booking created" }],
  });

  // Update slot booking count
  slot.booked += 1;
  await slot.save();

  res
    .status(201)
    .json(new ApiResponse(201, booking, "Booking created successfully"));
});


// ===================== CANCEL BOOKING =====================
const cancelBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  // Start session for atomic updates (optional, but recommended)
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(bookingId)
      .populate("slot service")
      .session(session);

    if (!booking) throw new ApiError(404, "Booking not found");

    if (["cancelled", "completed"].includes(booking.status)) {
      throw new ApiError(400, "Booking cannot be cancelled");
    }

    booking.status = "cancelled";
    booking.timeline.push({
      at: new Date(),
      status: "cancelled",
      note: "Booking cancelled by user",
    });

    // Refund logic
    let refund = null;
    if (booking.payment?.status === "paid") {
      refund = {
        amount: booking.amount.grandTotal,
        currency: booking.amount.currency,
      };

      // 👉 call your payment provider here
      // await processRefund(booking.payment.paymentId, refund.amount);

      booking.payment.status = "refunded";
      booking.timeline.push({
        at: new Date(),
        status: "refunded",
        note: "Refund issued to user",
      });
    }

    await booking.save({ session });

    // Decrement slot booking count
    if (booking.slot) {
      booking.slot.booked = Math.max(0, booking.slot.booked - 1);
      await booking.slot.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.json(
      new ApiResponse(200, { booking, refund }, "Booking cancelled successfully")
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});



// ===================== GET BOOKING DETAILS =====================
   const getBookingDetails = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  const result = await Booking.aggregate([
    { $match: { _id: new mongoose.ObjectId(bookingId) } },

    // Lookup service
    {
      $lookup: {
        from: "services",
        let: { serviceId: "$service" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$serviceId"] } } },
          { $project: { name: 1, price: 1, discount: 1 } },
        ],
        as: "service",
      },
    },
    { $unwind: "$service" },

    // Lookup slot
    {
      $lookup: {
        from: "slots",
        let: { slotId: "$slot" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$slotId"] } } },
          { $project: { startTime: 1, endTime: 1, capacity: 1, booked: 1 } },
        ],
        as: "slot",
      },
    },
    { $unwind: "$slot" },

    // Refund eligibility
    {
      $addFields: {
        refundEligible: {
          $cond: [
            { $and: [{ $eq: ["$status", "confirmed"] }, { $eq: ["$payment.status", "paid"] }] },
            true,
            false,
          ],
        },
      },
    },

    // Final projection
    {
      $project: {
        user: 1,
        status: 1,
        notes: 1,
        amount: 1,
        payment: 1,
        timeline: 1,
        service: 1,
        slot: 1,
        refundEligible: 1,
      },
    },
  ]);

  if (!result.length) throw new ApiError(404, "Booking not found");

  res.json(new ApiResponse(200, result[0], "Booking details fetched successfully"));
});


export default {getBookingDetails, createBooking, cancelBooking}