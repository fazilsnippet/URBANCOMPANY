// import mongoose from 'mongoose';

// const cartSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User", // Reference to the User model
//       required: [true, "Cart must belong to a user"],
//     },
//     items: [
//       {
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Product", // Reference to the Product model
//           required: [true, "Cart item must reference a product"],
//         },
//         quantity: {
//           type: Number,
//           required: [true, "Cart item must have a quantity"],
//           min: [1, "Quantity must be at least 1"],
//         },
//       },
//     ],
//     totalPrice: {
//       type: Number,
//       default: 0,
//     },
//   },
//   { timestamps: true } // Adds createdAt and updatedAt fields
// );

// export const Cart = mongoose.model("Cart", cartSchema);

//this cart is only for products,  for the services there is "bookings" model 
const cartItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantSku: String,
  qty:      { type: Number, required: true, min: 1 },
  priceAtAdd: Number,     // snapshot for transparency
  currency:   { type: String, enum:["INR"], default: 'INR' }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  items: [cartItemSchema],
  subTotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  tax:      { type: Number, default: 0 },
  total:    { type: Number, default: 0 },
  currency: { type: String, default: 'INR' },
  updatedBy: { type: String } // system|user_id
}, { timestamps: true });

cartSchema.index({ updatedAt: -1 });
export const Cart = mongoose.model('Cart', cartSchema);
