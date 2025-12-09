import multer from "multer";

export const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: Number(process.env.MAX_UPLOAD_MB || 5) * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(
      file.mimetype
    );
    if (!ok) return cb(new Error("Only JPG/PNG/WebP allowed"));
    cb(null, true);
  },
});

export const uploadSingleImage = memoryUpload.single("file");
export const uploadMultipleImages = memoryUpload.array("files", 8);

export const uploadKycFields = memoryUpload.fields([
  { name: "idFrontUrl", maxCount: 1 },
  { name: "idBackUrl", maxCount: 1 },
  { name: "selfieWithIdUrl", maxCount: 1 },
  { name: "vehicleRegistrationUrl", maxCount: 1 },
  { name: "vehicleInsuranceUrl", maxCount: 1 },
]);

export const uploadCarImagesInLine = memoryUpload.fields([
  {
    name: "images",
    maxCount: 8,
  },
]);
