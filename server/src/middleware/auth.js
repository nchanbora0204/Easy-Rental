import jwt, { decode } from "jsonwebtoken";
import User from "../modules/users/user.model.js";

export const protect = (req, res, next) => {  
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Không có token" });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (e) {
    return res
      .status(401)
      .json({ success: false, message: "Token không hợp lệ" });
  }
};

export const requireOwner = (req, res, next) => {
  if (req.user?.role !== "owner") {
    return res.status(403).json({ success: false, message: "Chỉ owner" });
  }
  next();
};

//chỉ owner đã KYC thành công mới được đăng xe
export const requireOwnerKycApproved = async (req, res, next) => {
  try {
    const u = await User.findById(req.user.id).select("role kycStatus");
    if (!u || u.role !== "owner") {
      return res
        .status(403)
        .json({ success: false, message: "Owner role required" });
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

//chỉ admin mới được truy cập vào route này
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin only" });
  }
  next();
};


