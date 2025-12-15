import { Router } from "express";
import { body } from "express-validator";
import { protect, requireOwner } from "../../middleware/auth.js";
import {
  cancelByUser,
  checkAvailability,
  createBooking,
  myBookings,
  updateStatusByOwner,
  getBookingById,
  ownerBookings,
  exportOwnerBookings,
} from "./booking.controller.js";

const router = Router();

router.get("/check-availability", checkAvailability);

router.post(
  "/",
  protect,
  body("car").optional().isMongoId().withMessage("car must be a valid id"),
  body("carId").optional().isMongoId().withMessage("carId must be a valid id"),
  body().custom((_, { req }) => {
    if (!req.body.car && !req.body.carId) throw new Error("car (or carId) is required");
    return true;
  }),
  body("pickupDate").isISO8601(),
  body("returnDate").isISO8601(),
  createBooking
);

router.get("/me", protect, myBookings);

router.get("/owner", protect, requireOwner, ownerBookings);
router.get("/owner/export", protect, requireOwner, exportOwnerBookings);

router.patch("/:id/cancel", protect, cancelByUser);
router.patch(
  "/:id/status",
  protect,
  requireOwner,
  body("status").notEmpty(),
  updateStatusByOwner
);

router.get("/:id", protect, getBookingById);
export default router;
