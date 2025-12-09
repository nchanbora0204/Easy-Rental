/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Thanh toán (SePay QR + Webhook)
 */

/**
 * @swagger
 * /api/payments/create:
 *   post:
 *     summary: Tạo QR thanh toán cho booking (SePay VietQR)
 *     tags: [Payments]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookingId]
 *             properties:
 *               bookingId: { type: string, example: "6715b9d23ef50e4ab73aab39" }
 *     responses:
 *       201: { description: Created (qrUrl, transferContent) }
 */

/**
 * @swagger
 * /api/payments/instruction/{bookingId}:
 *   get:
 *     summary: Lấy lại QR + nội dung chuyển khoản cho 1 booking
 *     tags: [Payments]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Webhook SePay gọi về khi có tiền vào
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transaction_content: { type: string, example: "BOOKING_6715b9d23ef50e4ab73aab39" }
 *               amount_in: { type: number, example: 600000 }
 *     responses:
 *       200: { description: OK }
 */

import { Router } from "express";
import { protect, requireOwner } from "../../middleware/auth.js";
import { verifyWebhookAuth } from "../../middleware/webhookAuth.js";
import {
  createPaymentForBooking,
  getPaymentInstruction,
  paymentWebhook,readBooking
} from "./payment.controller.js";

const router = Router();

// User tạo payment (nhận QR để quét)
router.post("/create", protect, createPaymentForBooking);

// Lấy lại hướng dẫn thanh toán (QR + content) cho 1 booking
router.get("/instruction/:bookingId", protect, getPaymentInstruction);

router.get("/:id", protect, readBooking);

// Webhook SePay gọi về
router.post("/webhook", verifyWebhookAuth, paymentWebhook);

// Gửi lại hóa đơn (owner/admin)
import Booking from "../bookings/booking.model.js";
import { sendMail } from "../../utils/mailer.js";
import User from "../users/user.model.js";
import Car from "../cars/car.model.js";
import { buildInvoicePdfBuffer } from "../invoices/invoice.service.js";


router.post(
  "/resend-invoice/:bookingId",
  protect,
  requireOwner,
  async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.bookingId);
      if (!booking)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thầy đơn thuê" });
      if (
        String(booking.owner) !== String(req.user.id) &&
        req.user.role !== "admin"
      )
        return res.status(403).json({ success: false, message: "Forbidden" });

      const user = await User.findById(booking.user);
      const car = await Car.findById(booking.car);
      const pdf = await buildInvoicePdfBuffer({ booking, user, car });

      await sendMail({
        to: user?.email,
        subject: `Hóa đơn đặt xe #${booking._id} (gửi lại)`,
        html: `<p>Gửi lại hóa đơn theo yêu cầu.</p>`,
        attachments: [{ filename: `invoice_${booking._id}.pdf`, content: pdf }],
      });

      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  }
);

export default router;
