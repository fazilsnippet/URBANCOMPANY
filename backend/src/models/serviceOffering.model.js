import mongoose from 'mongoose';

const AddOnSchema = new mongoose.Schema({ name: String, price: Number }, { _id: false });
const PriceRuleSchema = new mongoose.Schema({
  city: String,
  surgePct: { type: Number, default: 0 },
  minPrice: Number,
}, { _id: false });

const ServiceOfferingSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', index: true },
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  addOns: [AddOnSchema],
  priceRules: [PriceRuleSchema],
}, { timestamps: true });

export default mongoose.model('ServiceOffering', ServiceOfferingSchema);