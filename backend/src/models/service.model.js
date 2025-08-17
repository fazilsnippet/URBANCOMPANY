// const serviceSchema = new mongoose.Schema({
//   mainCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
//   subCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
//   name: { type: String, required: true },
//   description: String,
//   basePrice: { type: Number, required: true },
//   durationMinutes: { type: Number, required: true },
//   isActive: { type: Boolean, default: true }
// }, { timestamps: true });

// export default mongoose.model('Service', serviceSchema);


const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  sg: { type: String, unique: true },
  partner: { type: mongoose.Schema.Types.ObjectId, ref: 'PartnerProfile', required: true },
  mainCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  suCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category',  }],
  description: String,
  images: [String],
  pricing: {
    type: { type: String, enum: ['fixed','hourly'], default: 'fixed' },
    amount: { type: Number, required: true },
    currency: { type: String, enum:["INR"], default: 'INR' },
    minHours: Number
  },
  durationMins: Number,
  locationType: { type: String, enum: ['onsite','online'], default: 'onsite' },
  address: String,
  geo: { type: { type: String, enum: ['Point'] }, coordinates: [Number] }, // [lng,lat]
  avgRating: { type: Number, default: 0 }, ratingCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

serviceSchema.index({ geo: '2dsphere' });
serviceSchema.index({ partner: 1, isActive: 1 });
export const Service = mongoose.model('Service', serviceSchema);
