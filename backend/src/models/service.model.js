const serviceSchema = new mongoose.Schema({
  mainCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  name: { type: String, required: true },
  description: String,
  basePrice: { type: Number, required: true },
  durationMinutes: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
