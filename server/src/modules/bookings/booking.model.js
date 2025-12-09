import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    pickupDate: { type: Date, required: true, index: true },
    returnDate: { type: Date, required: true, index: true },
    days: { type: Number, required: true, min: 1 },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "ongoing",
        "completed",
        "cancelled",
        "cancelled_timeout",
      ],
      default: "pending",
      index: true,
    },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "VND" },
  },
  { timestamps: true }
);

bookingSchema.index({ createdAt: 1 });
bookingSchema.index({ owner: 1, createdAt: 1 });
bookingSchema.index({ status: 1, createdAt: 1 });

bookingSchema.index({ car: 1, pickupDate: 1 });
bookingSchema.index({ car: 1, returnDate: 1 });

export default mongoose.model("Booking", bookingSchema);
