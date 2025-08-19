// import mongoose from 'mongoose';

// const SlotSchema = new mongoose.Schema({
//   partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
//   startTime: { type: Date, required: true, index: true },
//   endTime:   { type: Date, required: true },
//   status: { type: String, enum: ['available','booked','unavailable'], default: 'available', index: true },
// }, { timestamps: true });

// export default mongoose.model('Slot', SlotSchema);

import mongoose from "mongoose";
const slotSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: Date, required: true },
  start: { type: Date, required: true },
  end:   { type: Date, required: true },
  capacity: { type: Number, default: 1 },       // allows group bookings
  bookedCount: { type: Number, default: 0 },
  isLocked: { type: Boolean, default: false }    // short lock during checkout
}, { timestamps: true });

slotSchema.index({ service: 1, start: 1, end: 1 }, { unique: true });
export const Slot = mongoose.model('Slot', slotSchema);
