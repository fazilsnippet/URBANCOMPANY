// import mongoose from "mongoose";

// const bookingSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   partnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // partner who provides service
//   slotId: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", required: true },   // time slot

//   services: [
//     {
//       serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
//       quantity: { type: Number, default: 1 }
//     }
//   ],

//   totalPrice: { type: Number, required: true },
//   status: {
//     type: String,
//     enum: ["pending", "confirmed", "completed", "cancelled"],
//     default: "pending"
//   }
// }, { timestamps: true });

// export default mongoose.model("Booking", bookingSchema);\\

// models/bookingModel.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  slot: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", required: true },

  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "refunded"],
    default: "pending"
  },

  amount: {
    subTotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    currency: { type: String, default: "INR" }
  },

  // 🔹 Payment Information
  payment: {
  method: { type: String, enum: ["COD", "Razorpay", "Stripe", "UPI"], default: "COD" },
  status: { type: String, enum: ["unpaid", "paid", "failed", "refunded"], default: "unpaid" },
  paymentId: { type: String, default: null },
  receipt: { type: String, default: null }
},


  notes: String,

  timeline: [
    {
      at: { type: Date, default: Date.now },
      status: String,
      note: String
    }
  ]
}, { timestamps: true });

// 🔹 Middleware to auto-calc totals before save
bookingSchema.pre("save", async function (next) {
  if (!this.isModified("amount") || this.amount.grandTotal > 0) return next();

  const Service = mongoose.model("Service");
  const service = await Service.findById(this.service);

  if (service) {
    const subTotal = service.price;
    const discount = service.discount || 0;
    const tax = ((subTotal - discount) * (service.taxPct || 0)) / 100;
    const grandTotal = subTotal - discount + tax;

    this.amount = { subTotal, discount, tax, grandTotal, currency: "INR" };
  }

  next();
});

export const Booking = mongoose.model("Booking", bookingSchema);
