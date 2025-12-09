import mongoose from "mongoose";
const { Schema } = mongoose;

const ownerBlockSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

ownerBlockSchema.index({ owner: 1, date: 1 }, { unique: true });

const OwnerBlock = mongoose.model("OwnerBlock", ownerBlockSchema);
export default OwnerBlock;
