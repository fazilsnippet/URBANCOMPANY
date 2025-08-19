import mongoose from "mongoose";
import { Booking } from "../models/booking.model.js";
import { Slot } from "../models/slot.model.js";
import { Service } from "../models/service.model.js";
import  ApiError  from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponce.js";
import asyncHandler from "../utils/asyncHandler.js";


export const getAllBookingsAdmin = asyncHandler(async (req, res) => {
  // 1. Parse query params
  const limit  = Math.max(1, parseInt(req.query.limit,  10) || 10);
  const skip   = Math.max(0, parseInt(req.query.skip,   10) || 0);

  // 2. Count total bookings
  const total = await Booking.countDocuments();

  // 3. Fetch paginated & enriched list
  const bookings = await Booking.aggregate([
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },

    // service lookup
    {
      $lookup: {
        from: "services",
        let: { svcId: "$service" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$svcId"] } } },
          { $project: { name: 1, price: 1, discount: 1 } }
        ],
        as: "service"
      }
    },
    { $unwind: { path: "$service", preserveNullAndEmptyArrays: true } },

    // slot lookup
    {
      $lookup: {
        from: "slots",
        let: { slotId: "$slot" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$slotId"] } } },
          { $project: { startTime: 1, endTime: 1, capacity: 1, booked: 1 } }
        ],
        as: "slot"
      }
    },
    { $unwind: { path: "$slot", preserveNullAndEmptyArrays: true } },

    // user lookup
    {
      $lookup: {
        from: "users",
        let: { usrId: "$user" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$usrId"] } } },
          { $project: { name: 1, email: 1 } }
        ],
        as: "user"
      }
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

    // refund eligibility
    {
      $addFields: {
        refundEligible: {
          $and: [
            { $eq: ["$status", "confirmed"] },
            { $eq: ["$payment.status", "paid"] }
          ]
        }
      }
    },

    // final projection
    {
      $project: {
        user: 1,
        status: 1,
        amount: 1,
        payment: 1,
        timeline: 1,
        service: 1,
        slot: 1,
        refundEligible: 1,
        createdAt: 1
      }
    }
  ]);

  // 4. Return with metadata
  res.json(
    new ApiResponse(
      200,
      { total, skip, limit, bookings },
      "All bookings fetched successfully"
    )
  );
});


const { ObjectId } = mongoose.mongo;

// ===================== GET BOOKING BY ID (ADMIN) =====================
export const getBookingByIdAdmin = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  // convert string → native ObjectId
  let bookingObjectId;
  try {
    bookingObjectId = new ObjectId(bookingId);
  } catch {
    throw new ApiError(400, "Invalid bookingId");
  }

  const result = await Booking.aggregate([
    { $match: { _id: bookingObjectId } },

    // lookup service
    {
      $lookup: {
        from: "services",
        let: { svcId: "$service" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$svcId"] } } },
          { $project: { name: 1, price: 1, discount: 1 } },
        ],
        as: "service",
      },
    },
    { $unwind: "$service" },

    // lookup slot
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

    // lookup user
    {
      $lookup: {
        from: "users",
        let: { usrId: "$user" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$usrId"] } } },
          { $project: { name: 1, email: 1 } },
        ],
        as: "user",
      },
    },
    { $unwind: "$user" },

    // compute refund eligibility
    {
      $addFields: {
        refundEligible: {
          $and: [
            { $eq: ["$status", "confirmed"] },
            { $eq: ["$payment.status", "paid"] },
          ],
        },
      },
    },

    // final projection
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
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  if (!result.length) {
    throw new ApiError(404, "Booking not found");
  }

  res.json(new ApiResponse(200, result[0], "Booking fetched successfully"));
});


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
  const userId = req.user._id;          // assume you have auth middleware setting req.user

  // start a transaction to keep booking + slot updates atomic
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    // 1. Fetch booking belonging to this user
    const booking = await Booking.findOne({ _id: bookingId, user: userId })
      .populate("slot service")
      .session(session);

    if (!booking) {
      throw new ApiError(404, "Booking not found or you are not authorized");
    }

    // 2. Prevent cancelling if already completed or cancelled
    if (["cancelled", "completed"].includes(booking.status)) {
      throw new ApiError(400, "Booking cannot be cancelled");
    }

    // 3. Mark as cancelled
    booking.status = "cancelled";
    booking.timeline.push({
      at: new Date(),
      status: "cancelled",
      note: "Booking cancelled by user"
    });

    // 4. Handle refund if already paid
    let refund = null;
    if (booking.payment?.status === "paid") {
      refund = {
        amount: booking.amount.grandTotal,
        currency: booking.amount.currency
      };

      // 👉 call your payment provider’s refund endpoint here
      // await processRefund(booking.payment.paymentId, refund.amount);

      booking.payment.status = "refunded";
      booking.timeline.push({
        at: new Date(),
        status: "refunded",
        note: "Refund issued to user"
      });
    }

    // 5. Save booking changes
    await booking.save({ session });

    // 6. Decrement slot’s booked count
    if (booking.slot) {
      booking.slot.booked = Math.max(0, booking.slot.booked - 1);
      await booking.slot.save({ session });
    }

    // 7. Commit everything
    await session.commitTransaction();
    session.endSession();

    return res.json(
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
  const userId = req.user._id;

  // 1. Build aggregation with user-scoped match
  const result = await Booking.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(bookingId),
        user: new mongoose.Types.ObjectId(userId)
      }
    },
    // 2. Lookup service info
    {
      $lookup: {
        from: "services",
        let: { serviceId: "$service" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$serviceId"] } } },
          { $project: { name: 1, price: 1, discount: 1 } }
        ],
        as: "service"
      }
    },
    { $unwind: "$service" },

    // 3. Lookup slot info
    {
      $lookup: {
        from: "slots",
        let: { slotId: "$slot" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$slotId"] } } },
          { $project: { startTime: 1, endTime: 1, capacity: 1, booked: 1 } }
        ],
        as: "slot"
      }
    },
    { $unwind: "$slot" },

    // 4. Compute refund eligibility
    {
      $addFields: {
        refundEligible: {
          $cond: [
            {
              $and: [
                { $eq: ["$status", "confirmed"] },
                { $eq: ["$payment.status", "paid"] }
              ]
            },
            true,
            false
          ]
        }
      }
    },

    // 5. Final projection
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
        refundEligible: 1
      }
    }
  ]);

  if (!result.length) {
    throw new ApiError(404, "Booking not found or you are not authorized");
  }

  res.json(
    new ApiResponse(200, result[0], "Booking details fetched successfully")
  );
});


export default {getBookingDetails, createBooking, cancelBooking}