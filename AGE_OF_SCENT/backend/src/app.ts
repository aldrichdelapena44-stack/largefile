import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import path from "path";
import adminRoutes from "./routes/admin.routes";
import contactRoutes from "./routes/contact.routes";
import feedbackRoutes from "./routes/feedback.routes";
import authRoutes from "./routes/auth.routes";
import orderRoutes from "./routes/order.routes";
import paymentRoutes from "./routes/payment.routes";
import productRoutes from "./routes/product.routes";
import userRoutes from "./routes/user.routes";
import verificationRoutes from "./routes/verification.routes";
import webhookRoutes from "./routes/webhook.routes";
import { env } from "./config/env";
import { errorMiddleware } from "./middlewares/error.middleware";

export const app = express();

app.use(
    cors({
        origin: env.frontendUrl,
        credentials: true
    })
);

app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 200
    })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", (_req, res) => {
    res.json({
        success: true,
        message: "AGE OF SCENT backend is running."
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/verifications", verificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/webhooks", webhookRoutes);

app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found."
    });
});

app.use(errorMiddleware);