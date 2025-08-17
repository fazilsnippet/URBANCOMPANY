import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  provider: { 
    type: String, 
    enum: ['razorpay', 'cod', 'upi', 'stripe'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: [
      'created','pending','authorized',
      'captured','collected',
      'failed','refunded','cancelled'
    ], 
    default: 'created' 
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  
  // Polymorphic reference: Payment can belong to Order OR Booking
  orderRef: { 
    kind: { type: String, enum: ['Order','Booking'], required: true }, 
    id: { type: mongoose.Schema.Types.ObjectId, required: true } 
  }, 

  // Razorpay-specific (optional)
  rpOrderId: String, 
  rpPaymentId: String, 
  rpSignature: String,

  // UPI/Stripe-specific (optional)
  upiTxnId: String, 
  stripeChargeId: String,

  // Audit & metadata
  webhookEvents: [{ type: String }], 
  meta: mongoose.Schema.Types.Mixed

}, { timestamps: true });

paymentSchema.index({ 'orderRef.kind': 1, 'orderRef.id': 1 });
export const Payment = mongoose.model('Payment', paymentSchema);
