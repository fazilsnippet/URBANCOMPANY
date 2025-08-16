import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', index: true },
  method: { type: String, enum: ['upi','card','wallet'], required: true },
  status: { type: String, enum: ['created','authorized','captured','failed','refunded'], default: 'created', index: true },
  transactionRef: { type: String, index: true }, // e.g., Razorpay order/payment id
  capturedAt: Date,
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
}, { timestamps: true });

export default mongoose.model('Payment', PaymentSchema);