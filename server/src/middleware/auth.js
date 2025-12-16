import jwt from "jsonwebtoken";
import User from "../modules/users/user.model.js";

export const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) {
      return res.status(401).json({ success: false, message: "Missing token" });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("role tokenVersion isLocked");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    if (user.isLocked) {
      return res.status(403).json({ success: false, message: "Account locked" });
    }
    if (
      payload.tokenVersion !== undefined &&
      user.tokenVersion !== undefined &&
      payload.tokenVersion !== user.tokenVersion
    ) {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    req.user = { id: user._id.toString(), role: user.role };
    return next();
  } catch (e) {
    return res.status(401).json({ success: false, message: "Token invalid" });
  }
};

export const requireOwner = (req, res, next) => {
  if (req.user?.role !== "owner") {
    return res.status(403).json({ success: false, message: "Owner only" });
  }
  next();
};

export const requireOwnerKycApproved = async (req, res, next) => {
  try {
    const u = await User.findById(req.user.id).select("role kycStatus");
    if (!u || u.role !== "owner") {
      return res.status(403).json({ success: false, message: "Owner role required" });
    }
    if (u.kycStatus !== "approved") {
      return res.status(403).json({
        success: false,
        message: `KYC not approved (status=${u.kycStatus})`,
      });
    }
    next();
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin only" });
  }
  next();
};

export const protectOptional = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return next();

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("role tokenVersion isLocked");
    if (
      user &&
      !user.isLocked &&
      payload.tokenVersion === user.tokenVersion
    ) {
      req.user = { id: user._id.toString(), role: user.role };
    }
    return next();
  } catch {
    return next();
  }
};
