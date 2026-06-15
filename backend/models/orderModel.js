import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: {
    type: String,
    default: "Pending",
  },
  date: { type: Date, default: Date.now },
  payment: { type: Boolean, default: false },
  /** Stripe Checkout Session ID (payment reference) */
  paymentId: { type: String, sparse: true },
  stripeSessionId: { type: String, unique: true, sparse: true },
});

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
