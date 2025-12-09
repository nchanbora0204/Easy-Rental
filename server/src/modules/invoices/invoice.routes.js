import { Router } from "express";
import { protect } from "../../middleware/auth.js";
import Booking from "../bookings/booking.model.js";
import User from "../users/user.model.js";
import Car from "../cars/car.model.js";
import { buildInvoicePdfBuffer } from "./invoice.service.js";

const router = Router();

/**
 * GET /api/invoices/:bookingId/pdf
 * Trả về PDF trực tiếp để preview/download
 */
router.get("/:bookingId/pdf", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).send("Booking not found");

    // chỉ chủ đơn (user) hoặc owner của xe mới xem được
    const isOwner = String(booking.owner) === String(req.user.id);
    const isUser = String(booking.user) === String(req.user.id);
    if (!isOwner && !isUser && req.user.role !== "admin") {
      return res.status(403).send("Forbidden");
    }

    const user = await User.findById(booking.user).lean();
    const car  = await Car.findById(booking.car).lean();

    const pdf = await buildInvoicePdfBuffer({ booking, user, car });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=invoice_${booking._id}.pdf`);
    return res.send(pdf);
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  }
});

export default router;
