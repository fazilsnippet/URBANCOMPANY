import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // partner who provides service
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", required: true },   // time slot

  services: [
    {
      serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
      quantity: { type: Number, default: 1 }
    }
  ],

  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending"
  }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
