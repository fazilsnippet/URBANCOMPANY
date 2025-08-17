const reviewSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subjectType: { type: String, required: true, enum: ['Product','Service'] },
  subject: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'subjectType' },
  rating: { type: Number, min: 1, max: 5, required: true },
  title: String,
  body: String,
  images: [String],
  isApproved: { type: Boolean, default: true },
  helpfulCount: { type: Number, default: 0 }
}, { timestamps: true });

reviewSchema.index({ subjectType: 1, subject: 1, createdAt: -1 });

export const Review = mongoose.model('Review', reviewSchema);
