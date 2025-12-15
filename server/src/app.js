import express from "express";
import cors from "cors";
import ratelimit from "express-rate-limit";
import userRoutes from "./modules/users/user.routes.js";
import carRoutes from "./modules/cars/car.routes.js";
import bookingRoutes from "./modules/bookings/booking.routes.js";
import reviewRoutes from "./modules/reviews/review.routes.js";
import paymentRoutes from "./modules/payments/payment.routes.js";
import invoiceRoutes from "./modules/invoices/invoice.routes.js";
import kycRoutes from "./modules/kyc/kyc.routes.js";
import adminKycRoutes from "./modules/admin/admin.routes.js";
import uploadRoutes from "./modules/uploads/upload.routes.js";
import statsRoutes from "./modules/stats/stats.routes.js";
import ownerRoutes from "./modules/owner/owner.routes.js";
import blogRoutes from "./modules/blog/blog.routes.js";
import searchRoutes from "./modules/search/search.routes.js";
const app = express();

const limiter = ratelimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX || 2000), 
  standardHeaders: true,
  legacyHeaders: false,
  message: "Quá nhiều yêu cầu, vui lòng thử lại sau.",

  skipSuccessfulRequests: true,
});

const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);

      if (allowedOrigins.length === 0) return cb(null, true);

      return allowedOrigins.includes(origin)
        ? cb(null, true)
        : cb(new Error("CORS blocked"));
    },
    credentials: true,
  })
);

app.use(express.json());

// app.use(limiter);

app.use("/api/invoices", invoiceRoutes);

app.use("/api/kyc", kycRoutes);

app.use("/api/admin", adminKycRoutes);

app.use("/api/uploads", uploadRoutes, limiter);

app.use("/api/stats", statsRoutes);

app.use("/api/owner", ownerRoutes);

app.get("/", (req, res) => res.send("API is running..."));

app.use("/api/payments", paymentRoutes, limiter);
app.use("/api/auth", userRoutes, limiter);
app.use("/api/users", userRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/search", searchRoutes);

export default app;
