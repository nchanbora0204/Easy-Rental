import mongoose from "mongoose";

const kycProfileSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    dateOfBirth: Date,
    idNumber: String,
    idIssueDate: String,

    //cccd
    idFrontUrl: String,
    idBackUrl: String,
    selfieWithIdUrl: String,

    address: String,

    //bank
    bankAccount: String,
    bankName: String,

    //Cavet, BH
    vehicleRegistrationUrl: String,
    vehicleInsuranceUrl: String,

    note: String,

    appliedAt: Date,
    approvedAt: Date,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "owner", "admin"],
      default: "user",
      index: true,
    },
    phone: { type: String, default: "" },
    city: { type: String, default: "" },
    avatar: { type: String, default: "" },
    avatarPublicId: { type: String, default: "" },
    isLocked: { type: Boolean, default: false, index: true },
    kycStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
      index: true,
    },

    ownerStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
      index: true,
    },
    kycProfile: kycProfileSchema,
    resetPasswordToken: { type: String },
    resetPasswordExp: { type: Date },
    emailVerified: { type: Boolean, default: false, index: true },
    emailVerifyToken: { type: String },
    emailVerifyExp: { type: Date },
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.index({ role: 1, kycStatus: 1, createdAt: -1 });
userSchema.index({ role: 1, ownerStatus: 1, createdAt: -1 });

export default mongoose.model("User", userSchema);
