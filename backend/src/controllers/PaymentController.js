import Stripe from "stripe";
import dotenv from "dotenv";
import { createOrder } from "../models/OrderModel.js";
dotenv.config();

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (!stripeSecret) throw new Error("Missing STRIPE_SECRET_KEY in .env");
if (!webhookSecret) throw new Error("Missing STRIPE_WEBHOOK_SECRET in .env");

const stripe = new Stripe(stripeSecret, { apiVersion: "2022-11-15" });
// 1.11 kiểm tra thanh toán hợp lệ
export async function createCheckoutSession(req, res) {
  const { items, shippingCost, customer } = req.body;

  const line_items = items.map((it) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: it.title,
        images: [it.imageUrl],
      },
      unit_amount: Math.round(it.price * 100),
    },
    quantity: it.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: customer.email,
    line_items,
    metadata: {
      order: JSON.stringify({ items, shippingCost, customer }),
    },
    success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/cart`,
  });
  res.json({ sessionId: session.id });
}
export async function handleStripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  // 1.11.2 xử lý sự kiện thanh toán thành công
  if (event.type === "checkout.session.completed") {
    console.log("✅ Got checkout.session.completed");
    const session = event.data.object;
    const { items, shippingCost, customer } = JSON.parse(session.metadata.order);

    const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const total = (subtotal + shippingCost).toFixed(2);

    try {
      await createOrder(
        {
          customer_name: customer.name,
          email: customer.email,
          phone: customer.phone || "",
          country: customer.country || "",
          city: customer.city || "",
          postal_code: customer.postal_code || "",
          subtotal,
          shipping: shippingCost,
          total,
        },
        items.map((it) => ({
            product_code: it.product_code,
            quantity: it.quantity,
            price: it.price,
        }))
      );
      console.log("Order saved to database");
    } catch (err) {
      console.error("Order save failed:", err);
    }
  }
  //1.11.1 xử lý sự kiện thanh toán thất bại
  else if (event.type === "payment_intent.payment_failed") {
        const intent = event.data.object;
        console.log("💥 Payment failed:", intent.last_payment_error?.message);
    }

  res.json({ received: true });
}