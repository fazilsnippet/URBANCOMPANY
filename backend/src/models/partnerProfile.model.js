import mongoose from 'mongoose';

const PartnerProfileSchema = new mongoose.Schema({
  
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, index: true },
  skills: [{ type: String, index: true }],
  serviceRegions: [{ type: String, index: true }],
  kycStatus: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  bankDetails: { account: String, ifsc: String, holder: String },
  upiId: String,
  avgRating: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('PartnerProfile', PartnerProfileSchema);