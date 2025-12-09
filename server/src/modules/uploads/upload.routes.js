import { Router } from "express";
import { protect } from "../../middleware/auth.js";
import { uploadSingleImage, uploadMultipleImages, uploadKycFields } from "../../utils/upload.middleware.js";
import { uploadKycBatch,uploadKycImage, uploadCarImages, uploadAvatar, deleteImage } from "./upload.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: Upload ảnh tự động theo loại (KYC / Avatar / Car)
 */

// KYC (1 ảnh)
router.post("/kyc", protect, uploadKycFields, uploadKycBatch);

// giữ endpoint single
router.post("/kyc/single", protect, uploadSingleImage, uploadKycImage);

// Avatar (1 ảnh)
router.post("/avatar", protect, uploadSingleImage, uploadAvatar);

// Ảnh xe (nhiều ảnh)
router.post("/car-images", protect, uploadMultipleImages, uploadCarImages);

// Xoá ảnh Cloudinary
router.delete("/delete", protect, deleteImage);

export default router;
