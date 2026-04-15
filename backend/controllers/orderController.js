import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import {
  isValidOrderStatus,
  normalizeOrderStatus,
} from "../constants/orderStatus.js";

const getStripeClient = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  return key ? new Stripe(key) : null;
};

/** Unwrap order payload from client (handles { orderData: { items, ... } } from localStorage). */
function parseOrderPayload(body) {
  if (!body || typeof body !== "object") return null;
  if (Array.isArray(body.items)) return body;
  if (body.orderData && Array.isArray(body.orderData.items)) {
    return body.orderData;
  }
  return null;
}

// placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";
  const stripe = getStripeClient();
  if (!stripe) {
    return res.json({
      success: false,
      message:
        "Stripe is not configured. Set STRIPE_SECRET_KEY in backend/.env to enable payments.",
    });
  }
  try {
    const { items = [], amount = 0, orderToken = "" } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.json({ success: false, message: "No items in order" });
    }
    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      client_reference_id: orderToken,
      success_url: `${frontend_url}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontend_url}/order?payment=cancelled`,
    });

    res.json({ success: true, session_url: session.url, session_id: session.id });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const verifyOrder = async (req, res) => {
  try {
    const stripe = getStripeClient();
    if (!stripe) {
      return res.json({ success: false, message: "Stripe is not configured" });
    }

    const { sessionId, orderData: rawOrder } = req.body;
    const orderPayload = parseOrderPayload(rawOrder);
    const userId = req.body.userId;

    if (!sessionId || !userId || !orderPayload || !Array.isArray(orderPayload.items)) {
      return res.json({ success: false, message: "Invalid verification payload" });
    }

    // Check if order already verified
    const existingOrder = await orderModel.findOne({
      userId,
      stripeSessionId: sessionId,
    });
    if (existingOrder) {
      return res.json({
        success: true,
        message: "Order already verified",
        data: existingOrder,
      });
    }

    // Verify payment with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return res.json({ success: false, message: "Payment not completed" });
    }

    // Create new order
    const newOrder = new orderModel({
      userId,
      items: orderPayload.items,
      amount: Number(orderPayload.amount) || 0,
      address: orderPayload.address || {},
      status: "Preparing",
      payment: true,
      paymentId: sessionId,
      stripeSessionId: sessionId,
    });

    await newOrder.save();
    
    // Clear user's cart data on backend
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Payment verified", data: newOrder });
  } catch (error) {
    console.error("verifyOrder error:", error.message);
    res.json({ success: false, message: "Verification failed" });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    const data = orders.map((o) => {
      const obj = o.toObject();
      obj.status = normalizeOrderStatus(obj.status);
      return obj;
    });
    res.json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    const data = orders.map((o) => {
      const obj = o.toObject();
      obj.status = normalizeOrderStatus(obj.status);
      return obj;
    });
    res.json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// api for updating status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ success: false, message: "Invalid order id" });
    }
    if (!isValidOrderStatus(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const updated = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!updated) {
      return res.json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, message: "Status Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
