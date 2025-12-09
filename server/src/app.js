import express from "express";
import cors from "cors";
import ratelimit from "express-rate-limit";
import userRoutes from "./modules/users/user.routes.js";
import carRoutes from "./modules/cars/car.routes.js";
import bookingRoutes from "./modules/bookings/booking.routes.js";
import reviewRoutes from "./modules/reviews/review.routes.js";
import paymentRoutes from "./modules/payments/payment.routes.js";
import swaggerUi from "swagger-ui-express";
import { buildSwaggerSpec } from "./docs/swagger.js";
import invoiceRoutes from "./modules/invoices/invoice.routes.js";
import kycRoutes from "./modules/kyc/kyc.routes.js";
import adminKycRoutes from "./modules/admin/admin.routes.js";
import uploadRoutes from "./modules/uploads/upload.routes.js";
import statsRoutes from "./modules/stats/stats.routes.js";
import ownerRoutes from "./modules/owner/owner.routes.js";
import { notFound, errorHandler } from "./middleware/errors.js";
import blogRoutes from "./modules/blog/blog.routes.js";
import searchRoutes from "./modules/search/search.routes.js";

const app = express();

// const limiter = ratelimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message:
//     "Quá nhiều yêu cầu đến từ địa chỉ IP này, vui lòng thử lại sau 15 phút",
// });

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());

// app.use(limiter);

app.use("/api/invoices", invoiceRoutes);

app.use("/api/kyc", kycRoutes);

app.use("/api/admin", adminKycRoutes);

app.use("/api/uploads", uploadRoutes);

app.use("/api/stats", statsRoutes);

app.use("/api/owner", ownerRoutes);

app.get("/", (req, res) => res.send("API is running..."));

const spec = buildSwaggerSpec();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

app.use("/api/payments", paymentRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/search", searchRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
