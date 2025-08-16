const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand:{ type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    description: { type: String },
    price: { type: Number, required: true },
    images: [{ type: String }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }],
    stock: { type: Number, default: 0 },

    // Aggregated ratings
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
      isActive: { type: Boolean, default: true }, 

  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Text search index
productSchema.index({ name: 'text', description: 'text' });

// Virtual for reverse population of reviews
productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product"
});

// Static method to update rating stats
productSchema.statics.updateRatingStats = async function (productId) {
  const result = await mongoose.model("Review").aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        totalRatings: { $sum: 1 }
      }
    }
  ]);

  if (result.length > 0) {
    await this.findByIdAndUpdate(productId, {
      averageRating: result[0].averageRating,
      totalRatings: result[0].totalRatings
    });
  } else {
    await this.findByIdAndUpdate(productId, {
      averageRating: 0,
      totalRatings: 0
    });
  }
};

export  const Product = mongoose.model("Product", productSchema);