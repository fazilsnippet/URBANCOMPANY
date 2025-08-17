// import mongoose from 'mongoose';

// const PartnerProfileSchema = new mongoose.Schema({
  
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, index: true },
//   skills: [{ type: String, index: true }],
//   serviceRegions: [{ type: String, index: true }],
//   kycStatus: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
//   bankDetails: { account: String, ifsc: String, holder: String },
//   upiId: String,
//   avgRating: { type: Number, default: 0 },
// }, { timestamps: true });

// export default mongoose.model('PartnerProfile', PartnerProfileSchema);

const partnerProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  businessName: { type: String, required: true },
  slug: { type: String, unique: true },
  about: String,
  kyc: {
    isVerified: { type: Boolean, default: false },
    docs: [{ type: String }]
  },
  serviceAreas: [{ type: { type: String, enum: ['Polygon','MultiPolygon'] }, coordinates: [] }],
  rating: { avg: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
  payout: {
    beneficiaryName: String,
    accountLast4: String // don't store full sensitive data
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

partnerProfileSchema.index({ slug: 1 }, { unique: true, partialFilterExpression: { slug: { $type: "string" } } });
export const PartnerProfile = mongoose.model('PartnerProfile', partnerProfileSchema);
