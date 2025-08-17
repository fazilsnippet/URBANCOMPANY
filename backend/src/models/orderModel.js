const orderSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantSku: String,
    qty: { type: Number, required: true },
    price: Number
  }],
  amount: { subTotal: Number, discount: Number, tax: Number, shipping: Number, grandTotal: Number, currency: { type: String,enum:["INR"], default: 'INR' } },
  status: { type: String, enum: ['created','paid','shipped','delivered','cancelled','refunded'], default: 'created' },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  shippingAddress: addressSchema,
  notes: String
}, { timestamps: true });

orderSchema.index({ user: 1, createdAt: -1 });
export const Order = mongoose.model('Order', orderSchema);
