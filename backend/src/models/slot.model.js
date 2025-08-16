import mongoose from 'mongoose';

const SlotSchema = new mongoose.Schema({
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  startTime: { type: Date, required: true, index: true },
  endTime:   { type: Date, required: true },
  status: { type: String, enum: ['available','booked','unavailable'], default: 'available', index: true },
}, { timestamps: true });

export default mongoose.model('Slot', SlotSchema);