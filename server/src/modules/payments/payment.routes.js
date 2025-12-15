import { Router } from "express";
import { protect, requireOwner } from "../../middleware/auth.js";
import { verifyWebhookAuth } from "../../middleware/webhookAuth.js";
import {
  createPaymentForBooking,
  getPaymentInstruction,
  paymentWebhook,
  readBooking,
  resendInvoice,
} from "./payment.controller.js";

const router = Router();

router.post("/create", protect, createPaymentForBooking);

router.get("/instruction/:bookingId", protect, getPaymentInstruction);

router.get("/:id", protect, readBooking);

router.post("/webhook", verifyWebhookAuth, paymentWebhook);

router.post("/resend-invoice/:bookingId", protect, resendInvoice);

export default router;
