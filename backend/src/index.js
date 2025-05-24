import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import { handleStripeWebhook } from "./controllers/PaymentController.js";
import orderRoutes from "./routes/orderRoutes.js";
dotenv.config();
const app = express();

app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

app.use(cors());
app.use(express.json());

app.use("/api/foods", foodRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on ${port}`));