import asyncHandler from "express-async-handler";
import { Slot } from "../models/slot.model.js";
import { Service } from "../models/service.model.js";

// @desc    Create a slot
// @route   POST /api/slots
// @access  Partner/Admin
export const createSlot = asyncHandler(async (req, res) => {
  const { serviceId, date, start, end, capacity } = req.body;

  // validate service
  const serviceExists = await Service.findById(serviceId);
  if (!serviceExists) {
    return res.status(404).json({ message: "Service not found" });
  }

  const slot = new Slot({ serviceId, date, start, end, capacity });
  await slot.save();

  res.status(201).json({ message: "Slot created", slot });
});

// @desc    Get all slots for a service
// @route   GET /api/slots/service/:serviceId
// @access  Public/Customer
export const getSlotsByService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;

  const slots = await Slot.find({ service: serviceId })
    .sort({ start: 1 });

  res.status(200).json(slots);
});

// @desc    Book a slot
// @route   POST /api/slots/:slotId/book
// @access  Customer
export const bookSlot = asyncHandler(async (req, res) => {
  const { slotId } = req.params;

  const slot = await Slot.findById(slotId);
  if (!slot) {
    return res.status(404).json({ message: "Slot not found" });
  }

  // prevent double booking
  if (slot.isLocked) {
    return res.status(409).json({ message: "Slot is locked, try again later" });
  }

  if (slot.bookedCount >= slot.capacity) {
    return res.status(400).json({ message: "Slot is fully booked" });
  }

  // lock & increment booking count
  slot.isLocked = true;
  await slot.save();

  // simulate checkout / reservation logic
  slot.bookedCount += 1;
  slot.isLocked = false;
  await slot.save();

  res.status(200).json({ message: "Slot booked successfully", slot });
});

// @desc    Cancel a booking
// @route   POST /api/slots/:slotId/cancel
// @access  Customer
export const cancelBooking = asyncHandler(async (req, res) => {
  const { slotId } = req.params;

  const slot = await Slot.findById(slotId);
  if (!slot) {
    return res.status(404).json({ message: "Slot not found" });
  }

  if (slot.bookedCount > 0) {
    slot.bookedCount -= 1;
    await slot.save();
  }

  res.status(200).json({ message: "Booking cancelled", slot });
});

// @desc    Delete a slot
// @route   DELETE /api/slots/:slotId
// @access  Partner/Admin
export const deleteSlot = asyncHandler(async (req, res) => {
  const { slotId } = req.params;

  const deleted = await Slot.findByIdAndDelete(slotId);
  if (!deleted) {
    return res.status(404).json({ message: "Slot not found" });
  }

  res.status(200).json({ message: "Slot deleted" });
});
