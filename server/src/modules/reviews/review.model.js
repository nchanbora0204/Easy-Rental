import mongoose from "mongoose";

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    car: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
  },
  { timestamps: true }
);


reviewSchema.index({ booking: 1 }, { unique: true });

reviewSchema.index({ car: 1, createdAt: -1 });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
