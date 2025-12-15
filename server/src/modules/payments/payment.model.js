import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "VND" },
    provider: {
      type: String,
      enum: ["SePay", "MOCK"],
      required: true,
      index: true,
    },
    method: {
      type: String,
      enum: ["QR", "VA", "Mock", "BankIn"],
      default: "QR",
    },
    orderCode: { type: String, unique: true, sparse: true },
    qrUrl: { type: String },
    vaNumber: { type: String },
    status: {
      type: String,
      enum: ["created", "awaiting", "paid", "refunded", "failed", "expired"],
      default: "created",
      index: true,
    },
    expiresAt: { type: Date, default: null },
    webhookPayload: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

paymentSchema.index({ booking: 1, status: 1 });
paymentSchema.index({ createdAt: 1 });
paymentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Payment", paymentSchema);
