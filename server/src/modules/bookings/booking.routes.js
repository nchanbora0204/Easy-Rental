/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Đặt thuê & quản lý đơn
 */

/**
 * @swagger
 * /api/bookings/check-availability:
 *   get:
 *     summary: Kiểm tra trùng lịch cho 1 xe
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: carId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: pickupDate
 *         required: true
 *         schema: { type: string, format: date-time, example: "2025-10-12T00:00:00.000Z" }
 *       - in: query
 *         name: returnDate
 *         required: true
 *         schema: { type: string, format: date-time, example: "2025-10-13T00:00:00.000Z" }
 *     responses:
 *       200: { description: OK }
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Tạo booking
 *     tags: [Bookings]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [carId, pickupDate, returnDate]
 *             properties:
 *               carId: { type: string }
 *               pickupDate: { type: string, format: date-time }
 *               returnDate: { type: string, format: date-time }
 *     responses:
 *       201: { description: Created }
 */

/**
 * @swagger
 * /api/bookings/me:
 *   get:
 *     summary: Danh sách booking của user
 *     tags: [Bookings]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */

/**
 * @swagger
 * /api/bookings/owner:
 *   get:
 *     summary: Danh sách booking của owner
 *     tags: [Bookings]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   patch:
 *     summary: User hủy booking
 *     tags: [Bookings]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   patch:
 *     summary: Owner đổi trạng thái booking
 *     tags: [Bookings]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [confirmed, ongoing, completed, cancelled]
 *     responses:
 *       200: { description: OK }
 */

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
