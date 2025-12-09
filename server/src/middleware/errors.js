/* eslint-disable no-unused-vars */
export const notFound = (req, res, _next) => {
  res.status(404).json({ success:false, message:"Route not found" });
};

export const errorHandler = (err, req, res, _next) => {
  const isProd = process.env.NODE_ENV === "production";

  // mongoose cast error (ObjectId invalid)
  if (err?.name === "CastError") {
    return res.status(400).json({ success:false, message:"Invalid ID" });
  }
  // mongoose validation error
  if (err?.name === "ValidationError") {
    const details = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success:false, message:"Validation error", details });
  }
  // duplicate key
  if (err?.code === 11000) {
    return res.status(409).json({ success:false, message:"Duplicate key", key: err.keyValue });
  }
  // multer
  if (err?.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ success:false, message:"File too large" });
  }

  const status = err.statusCode || 500;
  const payload = {
    success: false,
    message: err.message || "Internal Server Error",
  };
  if (!isProd) {
    payload.stack = err.stack;
    if (err.extra) payload.extra = err.extra;
  }
  res.status(status).json(payload);
};
