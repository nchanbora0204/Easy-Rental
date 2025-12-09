import Payment from "./payment.model.js";
import Booking from "../bookings/booking.model.js";
import User from "../users/user.model.js";
import Car from "../cars/car.model.js";
import { buildSePayQrUrl } from "./payment.service.js";
import { sendMail } from "../../utils/mailer.js";
import { buildInvoicePdfBuffer } from "../invoices/invoice.service.js";

/**
 * POST /api/payments/create
 * Body: { bookingId }
 * Trả về: qrUrl + paymentId + orderCode
 */
export const createPaymentForBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate("car");
    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    if (String(booking.user) !== String(req.user.id))
      return res.status(403).json({ success: false, message: "Forbidden" });
    if (!["pending"].includes(booking.status))
      return res
        .status(400)
        .json({ success: false, message: "Booking status must be pending" });

    const orderCode = `SEPAY_BOOKING_${booking._id}`; // mã nội bộ
    const description = `BOOKING_${booking._id}`; // nội dung chuyển khoản
    const qrUrl = buildSePayQrUrl({ amount: booking.total, description });

    const expiresAt = new Date(
      Date.now() + Number(process.env.PAYMENT_EXPIRE_MINUTES || 30) * 60 * 1000 // <— đồng bộ tên biến
    );

    const payment = await Payment.create({
      booking: booking._id,
      amount: booking.total,
      currency: booking.currency || "VND",
      provider: "SePay",
      method: "QR",
      orderCode,
      qrUrl,
      status: "awaiting",
      expiresAt,
    });

    return res.status(201).json({
      success: true,
      data: {
        paymentId: payment._id,
        orderCode: payment.orderCode,
        qrUrl: payment.qrUrl,
        amount: payment.amount,
        currency: payment.currency,
        expiresAt: payment.expiresAt,
        transferContent: description,
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

/**
 * GET /api/payments/instruction/:bookingId
 */
export const getPaymentInstruction = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    if (String(booking.user) !== String(req.user.id))
      return res.status(403).json({ success: false, message: "Forbidden" });

    const description = `BOOKING_${booking._id}`;
    const qrUrl = buildSePayQrUrl({ amount: booking.total, description });

    return res.json({
      success: true,
      data: {
        bookingId: booking._id,
        amount: booking.total, // <— sửa ở đây
        currency: booking.currency || "VND",
        transferContent: description,
        qrUrl,
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const readBooking = async (req, res) => {
  try {
    const b = await Booking.findById(req.params.id)
      .populate({ path: "car" })
      .populate({ path: "owner", select: "name email" })
      .lean();
    if (!b)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    return res.json({ success: true, data: b });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

/**
 * POST /api/payments/webhook
 */
export const paymentWebhook = async (req, res) => {
  try {
    const payload = req.body || {};
    console.log("[SePay Webhook] payload:", JSON.stringify(payload));

    const text =
      payload.transaction_content ||
      payload.description ||
      payload.content ||
      payload.note ||
      "";
    const amount = Number(
      payload.amount_in || payload.amount || payload.money || 0
    );

    // Booking._id là ObjectId 24 hex
    const m = text.match(/BOOKING_([a-f0-9]{24})/i);
    if (!m) {
      return res
        .status(200)
        .json({ success: true, message: "No BOOKING_<id> found - ignored" });
    }
    const bookingId = m[1];
    console.log("[Webhook] Booking ID detected:", bookingId);

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(200).json({
        success: true,
        message: `Booking ${bookingId} not found - ignored.`,
      });
    }

    // đối soát số tiền
    const tolerance = Number(process.env.PAYMENT_AMOUNT_TOLERANCE || 0);
    const expected = Number(booking.total || 0);
    const diff = Math.abs(expected - amount);
    if (diff > tolerance) {
      return res.status(200).json({
        success: true,
        message: `Amount mismatch: ${amount} vs ${expected}`,
      });
    }

    // tìm/tạo payment
    let payment = await Payment.findOne({
      booking: booking._id,
      provider: "SePay",
    });
    if (!payment) {
      payment = await Payment.create({
        booking: booking._id,
        amount: expected,
        currency: booking.currency || "VND",
        provider: "SePay",
        method: "QR",
        orderCode: `SEPAY_BOOKING_${booking._id}`, // <— thống nhất format
        status: "awaiting",
      });
    }

    // mark paid
    payment.status = "paid";
    payment.webhookPayload = payload;
    await payment.save();
    console.log("[Webhook] Payment marked paid");

    // confirm booking nếu đang pending
    let needInvoice = false;
    if (booking.status === "pending") {
      booking.status = "confirmed";
      await booking.save();
      needInvoice = true;
      console.log("[Webhook] Booking confirmed");
    }

    // gửi hóa đơn
    if (needInvoice) {
      try {
        console.log("[Webhook] Creating invoice PDF & sending email...");
        await sendInvoiceEmailForBooking(booking._id);
        console.log("[Webhook] ✅ Invoice email sent");
      } catch (e) {
        console.error("Send invoice error:", e.message);
      }
    }

    return res.json({ success: true });
  } catch (e) {
    console.log("Webhook error:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

// Helper gửi hóa đơn email
async function sendInvoiceEmailForBooking(bookingId) {
  // Có thể bỏ populate ở đây vì ta fetch User/Car riêng; nếu vẫn muốn populate thì dùng đúng tên field:
  // const booking = await Booking.findById(bookingId).populate("car owner user");
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  const user = await User.findById(booking.user);
  const car = await Car.findById(booking.car);
  const pdf = await buildInvoicePdfBuffer({ booking, user, car });

  const subject = `Hóa đơn thuê xe #${booking._id}`;
  const html = `
    <p>Xin chào ${user?.name || "bạn"},</p>
    <p>Đơn thuê xe của bạn đã được <b>xác nhận</b>.</p>
    <ul>
      <li>Xe: ${car?.brand} ${car?.model} (${car?.year || "-"})</li>
      <li>Ngày nhận xe: ${new Date(booking.pickupDate).toLocaleString(
        "vi-VN"
      )}</li>
      <li>Ngày trả xe: ${new Date(booking.returnDate).toLocaleString(
        "vi-VN"
      )}</li>
      <li>Tổng tiền: ${booking.total.toLocaleString("vi-VN")} ${
    booking.currency || "VND"
  }</li>
    </ul>
    <p>File PDF hóa đơn đính kèm.</p>
    <p>Trân trọng,<br/>CarRental</p>
  `;

  await sendMail({
    to: user?.email,
    subject,
    html,
    attachments: [{ filename: `invoice_${booking._id}.pdf`, content: pdf }],
  });
}
