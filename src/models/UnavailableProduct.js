import mongoose from 'mongoose';

const unavailableProductSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
  createdAt: { type: Date, default: Date.now },
});

const UnavailableProduct = mongoose.model('UnavailableProduct', unavailableProductSchema);
export default UnavailableProduct;
