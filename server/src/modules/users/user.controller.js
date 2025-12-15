import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "./user.model.js";

const sanitize = (u) => {
  if (!u) return null;
  const obj = u.toObject ? u.toObject() : u;

  const {
    _id,
    name,
    email,
    role,
    phone,
    city,
    avatar,
    avatarPublicId,
    createdAt,
    updatedAt,
  } = obj;
  return {
    id: _id?.toString?.() || _id,
    name,
    email,
    role,
    phone,
    city,
    avatar,
    avatarPublicId,
    createdAt,
    updatedAt,
  };
};

//jWT
const signToken = (u) =>
  jwt.sign(
    { id: u._id, role: u.role, name: u.name, email: u.email },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists)
      return res
        .status(409)
        .json({ success: false, message: "Email này đã được sử dụng" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: ["user", "owner", "admin"].includes(role) ? role : "user",
    });

    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: signToken(user),
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Sai email hoặc mật khẩu" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
      return res
        .status(401)
        .json({ success: false, message: "Sai email hoặc mật khẩu" });

    return res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: signToken(user),
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-passwordHash -resetPasswordToken -resetPasswordExp"
    );
    return res.json({ success: true, data: user });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

//Profile
export const updateMe = async (req, res) => {
  try {
    const { name, phone, city, avatar } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (phone !== undefined) update.phone = phone;
    if (city !== undefined) update.city = city;
    if (avatar !== undefined) update.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user.id, update, {
      new: true,
    }).select("-passwordHash -resetPasswordToken -resetPasswordExp");

    return res.json({ success: true, data: sanitize(user) });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};
//update password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res
        .status(400)
        .json({ success: false, message: "Missing oldPassword/newPassword" });

    const user = await User.findById(req.user.id).select("+passwordHash");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy tài khoản" });

    const ok = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!ok)
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu cũ không đúng" });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ success: true, message: "Mật khẩu đã được cập nhật" });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

//quen mk

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};
    const user = await User.findOne({ email });
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = token;
      user.resetPasswordExp = new Date(Date.now() + 60 * 60 * 1000);
      await user.save({ validateBeforeSave: false });
      const link = `${process.env.FRONTEND_URL}/?auth=reset&token=${token}`;
      return res.json({
        success: true,
        message:
          "Nếu email tồn tại, hệ thống đã gửi hướng dẫn đặt lại mật khẩu.",
        link: process.env.NODE_ENV !== "production" ? link : undefined,
      });
    }
    return res.json({
      success: true,
      message: "Nếu email tồn tại, hệ thống đã gửi hướng dẫn đặt lại mật khẩu.",
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

//reset pass
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body || {};
    if (!token || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Thiết  token hoặc mật khẩu" });
    }
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExp: { $gt: new Date() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Token không hợp lệ" });
    }
    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExp = undefined;
    await user.save();
    return res.json({
      success: true,
      message: "Đặt lại mật khẩu thành công. Hãy đăng nhập.",
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};
