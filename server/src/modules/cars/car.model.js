import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
  city: { type: String, trim: true },
  citySlug: { type: String, trim: true },
  district: { type: String, trim: true },
  address: { type: String, trim: true },
});
const carSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, min: 1980, max: 2100 },
    seatingCapacity: { type: Number, min: 1, max: 60, required: true },
    transmission: {
      type: String,
      enum: ["manual", "automatic"],
      required: true,
    },
    fuelType: {
      type: String,
      enum: ["gasoline", "diesel", "hybrid", "electric", "other"],
      default: "gasoline",
    },
    fuelConsumption: { type: String, trim: true },
    pricePerDay: { type: Number, required: true, min: 0, index: true },
    currency: { type: String, default: "VND" },
    location: {
      type: LocationSchema,
      // city: String,
      // district: String,
      // address: String,
    },
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },

    segment: {
      type: String,
      enum: ["standard", "premium", "luxury"],
      default: "standard",
      index: true,
    },

    images: [String],
    description: String,
    isAvailable: { type: Boolean, default: true, index: true },
    deletedAt: Date,

    searchText: {
      type: String,
      default: "",
      index: true,
    },

    searchVector: {
      type: [Number],
      default: [],
      select: false,
    },
  },

  { timestamps: true }
);

carSchema.index({ isAvailable: 1, createdAt: -1 });
carSchema.index({ "location.citySlug": 1 });

export default mongoose.model("Car", carSchema);
