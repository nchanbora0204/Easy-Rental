import { Router } from "express";
import { protect } from "../../middleware/auth.js";
import {
  listReviews,
  createReview,
  getCarReviews,
  getReviewBooking,
} from "../reviews/review.controller.js";

const router = Router();

router.get("/", listReviews);

router.post("/", protect, createReview);

router.get("/car/:carId", getCarReviews);

router.get("/booking/:bookingId", protect, getReviewBooking);

export default router;
