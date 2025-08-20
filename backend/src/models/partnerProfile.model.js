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


import mongoose from 'mongoose';
import slugify from 'slugify';

const partnerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true,
    index: true
  },
  avatar:{
type:String,
required:false,
  },
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    sparse: true // allows uniqueness only when slug is present
  },
  about: {
    type: String,
    trim: true
  },
  kyc: {
    isVerified: {
      type: Boolean,
      default: false
    },
    docs: [{
      type: String,
      match: /^https?:\/\/.+$/ // basic URL validation
    }]
  },
  serviceAreas: [{
    type: {
      type: String,
      enum: ['Polygon', 'MultiPolygon'],
      required: true
    },
    coordinates: {
      type: [[[Number]]], // array of arrays of coordinates
      required: false
    }
  }],
  rating: {
    avg: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  payout: {
    beneficiaryName: {
      type: String,
      trim: true
    },
    accountLast4: {
      type: String,
      match: /^\d{4}$/ // ensures exactly 4 digits
    }
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, { timestamps: true });

// Auto-generate slug from businessName if not provided
partnerProfileSchema.pre('save', function (next) {
  if (!this.slug && this.businessName) {
    this.slug = slugify(this.businessName, { lower: true, strict: true });
  }
  next();
});

// Index slug only when it's a string
partnerProfileSchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { slug: { $type: 'string' } } }
);

export const PartnerProfile = mongoose.model('PartnerProfile', partnerProfileSchema);

const partnerRatingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  partner: { type: mongoose.Schema.Types.ObjectId, ref: 'PartnerProfile', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String },
  createdAt: { type: Date, default: Date.now }
});

partnerRatingSchema.index({ user: 1, partner: 1 }, { unique: true });

export const PartnerRating = mongoose.model('PartnerRating', partnerRatingSchema);
