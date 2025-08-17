// const productSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     brand:{ type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
//     description: { type: String },
//     price: { type: Number, required: true },
//     images: [{ type: String }],
//     categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }],
//     stock: { type: Number, default: 0 },

//     // Aggregated ratings
//     averageRating: { type: Number, default: 0 },
//     totalRatings: { type: Number, default: 0 },
//       isActive: { type: Boolean, default: true }, 

//   },
//   { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
// );

// // Text search index
// productSchema.index({ name: 'text', description: 'text' });

// // Virtual for reverse population of reviews
// productSchema.virtual("reviews", {
//   ref: "Review",
//   localField: "_id",
//   foreignField: "product"
// });

// // Static method to update rating stats
// productSchema.statics.updateRatingStats = async function (productId) {
//   const result = await mongoose.model("Review").aggregate([
//     { $match: { product: new mongoose.Types.ObjectId(productId) } },
//     {
//       $group: {
//         _id: "$product",
//         averageRating: { $avg: "$rating" },
//         totalRatings: { $sum: 1 }
//       }
//     }
//   ]);

//   if (result.length > 0) {
//     await this.findByIdAndUpdate(productId, {
//       averageRating: result[0].averageRating,
//       totalRatings: result[0].totalRatings
//     });
//   } else {
//     await this.findByIdAndUpdate(productId, {
//       averageRating: 0,
//       totalRatings: 0
//     });
//   }
// };

// export  const Product = mongoose.model("Product", productSchema);



// const priceSchema = new mongoose.Schema({
//   mrp: { type: Number, required: true },
//   sale: { type: Number, required: true }, // current selling price
//   currency: { type: String, default: 'INR' },
//   taxPct: { type: Number, default: 0 }
// }, { _id: false });

// const variantSchema = new mongoose.Schema({
//   sku: { type: String, required: true },
//   attributes: [{ k: String, v: String }],
//   stock: { type: Number, default: 0 },
//   images: [String]
// }, { _id: false });

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   slug: { type: String, unique: true, index: true },
//   brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
//   categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }], // main + sub(s)
//   description: String,
//   tags: [String],
//   price: priceSchema,
//   variants: [variantSchema],            // optional; otherwise use single stock
//   images: [String],
//   stock: { type: Number, default: 0 },  // used if no variants
//   averageRating: { type: Number, default: 0 },
//   totalRatings: { type: Number, default: 0 },
//   isFeatured: { type: Boolean, default: false },
//   isActive: { type: Boolean, default: true }
// }, { timestamps: true });

// productSchema.index({ name: 'text', description: 'text', tags: 'text' }); // text search
// productSchema.index({ brand: 1, isActive: 1 });
// productSchema.index({ categories: 1, isActive: 1 });

// export const Product = mongoose.model('Product', productSchema);





import mongoose from "mongoose";

// ---------------- Sub Schemas ----------------
const priceSchema = new mongoose.Schema(
  {
    mrp: { type: Number, required: true },
    sale: { type: Number, required: true }, // current selling price
    currency: { type: String, default: "INR" },
    taxPct: { type: Number, default: 0 },
  },
  { _id: false }
);

const variantSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true },
    attributes: [{ k: String, v: String }], // e.g. size: M, color: Red
    stock: { type: Number, default: 0 },
    images: [String],
    price: priceSchema, // optional per-variant pricing
  },
  { _id: false }
);

// ---------------- Product Schema ----------------
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
    categories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    ], // supports main + subcategories
    description: { type: String },
    tags: [String],

    // Pricing & Inventory
    price: priceSchema, // global price
    variants: [variantSchema], // optional, otherwise global stock/price applies
    stock: { type: Number, default: 0 }, // used if no variants
    images: [String],

    // Ratings
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },

    // Flags
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ---------------- Indexes ----------------
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ brand: 1, isActive: 1 });
productSchema.index({ categories: 1, isActive: 1 });

// ---------------- Virtuals ----------------
productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});

// ---------------- Static Methods ----------------
productSchema.statics.updateRatingStats = async function (productId) {
  const result = await mongoose.model("Review").aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        totalRatings: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await this.findByIdAndUpdate(productId, {
      averageRating: result[0].averageRating,
      totalRatings: result[0].totalRatings,
    });
  } else {
    await this.findByIdAndUpdate(productId, {
      averageRating: 0,
      totalRatings: 0,
    });
  }
};

export const Product = mongoose.model("Product", productSchema);
