import Stripe from "stripe";

const getStripeClient = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  return key ? new Stripe(key) : null;
};

const createCheckoutSession = async (req, res) => {
  try {
    const stripe = getStripeClient();
    const frontendUrl = process.env.FRONTEND_URL?.replace(/\/+$/, "");
    if (!stripe) {
      return res.json({
        success: false,
        message: "Stripe is not configured. Add STRIPE_SECRET_KEY in backend/.env",
      });
    }
    if (!frontendUrl) {
      return res.json({
        success: false,
        message: "FRONTEND_URL is not configured in backend/.env",
      });
    }

    const { items = [] } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.json({ success: false, message: "Cart items are required" });
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: Number(item.quantity) || 1,
    }));

    // Add Delivery Charges
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    const itemsTotal = items.reduce(
      (sum, item) => sum + Math.round(Number(item.price) * 100) * (Number(item.quantity) || 1),
      0
    );
    const expectedTotalCents = itemsTotal + 200;

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/cart`,
      metadata: {
        userId: req.body.userId,
        amountCents: String(expectedTotalCents),
      },
    });

    res.json({ success: true, url: session.url, session_id: session.id });
  } catch (error) {
    console.error("Stripe create-session error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create payment session",
    });
  }
};

export { createCheckoutSession };
