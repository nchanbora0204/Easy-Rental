import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendMail } from "../../utils/mailer.js";
import User from "./user.model.js";
import RefreshToken from "./refreshToken.model.js";

const ACCESS_TOKEN_EXPIRES_IN = "1h";
const REFRESH_TOKEN_DAYS = Number(process.env.REFRESH_TOKEN_DAYS || 30);
const REFRESH_TOKEN_TTL_MS = REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000;
const REFRESH_COOKIE_NAME = "refreshToken";

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

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const parseCookies = (cookieHeader = "") =>
  Object.fromEntries(
    cookieHeader
      .split(";")
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => c.split("="))
      .map(([k, ...v]) => [k, v.join("=")])
  );

const getRefreshTokenFromRequest = (req) => {
  if (req.body?.refreshToken) return req.body.refreshToken;
  const cookies = parseCookies(req.headers.cookie || "");
  return cookies[REFRESH_COOKIE_NAME];
};

const setRefreshCookie = (res, token) => {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: REFRESH_TOKEN_TTL_MS,
    path: "/",
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
};

const signToken = (u) =>
  jwt.sign(
    {
      id: u._id,
      role: u.role,
      name: u.name,
      email: u.email,
      tokenVersion: u.tokenVersion || 0,
    },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );

const createRefreshToken = async (user, req) => {
  const raw = crypto.randomBytes(64).toString("hex");
  const tokenHash = hashToken(raw);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
  await RefreshToken.create({
    user: user._id,
    tokenHash,
    expiresAt,
    userAgent: req.headers["user-agent"] || "",
    ip: req.ip,
  });
  return raw;
};

const issueTokens = async (user, req, res) => {
  const accessToken = signToken(user);
  const refreshToken = await createRefreshToken(user, req);
  setRefreshCookie(res, refreshToken);
  return { accessToken, refreshToken };
};

const revokeUserRefreshTokens = async (userId) => {
  await RefreshToken.updateMany(
    { user: userId, revoked: false },
    { revoked: true }
  );
};

const buildFrontendUrl = () => process.env.FRONTEND_URL || "";

const createEmailVerifyToken = async (user) => {
  const token = crypto.randomBytes(32).toString("hex");
  user.emailVerifyToken = token;
  user.emailVerifyExp = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save({ validateBeforeSave: false });
  return token;
};

const sendVerificationEmail = async (user) => {
  const token = await createEmailVerifyToken(user);
  const frontendUrl = buildFrontendUrl();
  const link = `${frontendUrl}/?auth=verify&token=${token}`;
  const isDev = process.env.NODE_ENV !== "production";

  await sendMail({
    to: user.email,
    subject: "Xac minh email",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
        <p>Chao ${user.name || "ban"},</p>
        <p>Cam on ban da dang ky. Nhan vao nut ben duoi de xac minh email:</p>
        <p>
          <a href="${link}" style="display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">Xac minh email</a>
        </p>
        <p>Neu nut khong bam duoc, sao chep lien ket nay: <br/><a href="${link}">${link}</a></p>
        <p>Lien ket hieu luc trong 24 gio.</p>
      </div>
    `,
  });

  return { link, token, isDev };
};

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
        .json({ success: false, message: "Email da duoc su dung" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: ["user", "owner", "admin"].includes(role) ? role : "user",
    });

    let verifyLink;
    let devVerifyToken;
    try {
      const { link, token: vToken, isDev } = await sendVerificationEmail(user);
      if (isDev) {
        verifyLink = link;
        devVerifyToken = vToken;
      }
    } catch (mailErr) {
      console.error("register sendVerificationEmail error:", mailErr);
    }

    const tokens = await issueTokens(user, req, res);

    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: tokens.accessToken,
        verifyLink,
        devVerifyToken,
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
        .json({ success: false, message: "Sai email hoac mat khau" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
      return res
        .status(401)
        .json({ success: false, message: "Sai email hoac mat khau" });

    const tokens = await issueTokens(user, req, res);

    return res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: tokens.accessToken,
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const raw = getRefreshTokenFromRequest(req);
    if (!raw) {
      clearRefreshCookie(res);
      return res
        .status(401)
        .json({ success: false, message: "Missing refresh token" });
    }

    const tokenHash = hashToken(raw);
    const saved = await RefreshToken.findOne({ tokenHash });
    if (!saved || saved.revoked || saved.expiresAt < new Date()) {
      clearRefreshCookie(res);
      return res
        .status(401)
        .json({ success: false, message: "Refresh token khong hop le" });
    }

    const user = await User.findById(saved.user);
    if (!user) {
      clearRefreshCookie(res);
      return res
        .status(401)
        .json({ success: false, message: "Tai khoan khong ton tai" });
    }

    const newRefresh = await createRefreshToken(user, req);
    saved.revoked = true;
    saved.replacedByTokenHash = hashToken(newRefresh);
    await saved.save();

    setRefreshCookie(res, newRefresh);
    const accessToken = signToken(user);

    return res.json({
      success: true,
      data: { token: accessToken },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const logout = async (req, res) => {
  try {
    const raw = getRefreshTokenFromRequest(req);
    if (raw) {
      const tokenHash = hashToken(raw);
      await RefreshToken.updateOne({ tokenHash }, { revoked: true });
    }
    clearRefreshCookie(res);
    return res.json({ success: true, message: "Da thoat" });
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
        .json({ success: false, message: "Khong tim thay tai khoan" });

    const ok = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!ok)
      return res
        .status(400)
        .json({ success: false, message: "Mat khau cu khong dung" });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();
    await revokeUserRefreshTokens(user._id);
    clearRefreshCookie(res);

    return res.json({
      success: true,
      message: "Mat khau da duoc cap nhat. Vui long dang nhap lai.",
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });
    const { email } = req.body || {};
    const user = await User.findOne({ email });
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = token;
      user.resetPasswordExp = new Date(Date.now() + 60 * 60 * 1000);
      await user.save({ validateBeforeSave: false });
      const frontendUrl = process.env.FRONTEND_URL || "";
      const link = `${frontendUrl}/?auth=reset&token=${token}`;
      const isDev = process.env.NODE_ENV !== "production";

      try {
        await sendMail({
          to: email,
          subject: "Reset mat khau",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
              <p>Chao ${user.name || "ban"},</p>
              <p>Ban (hoac ai do) vua yeu cau reset mat khau.</p>
              <p>Nhan vao nut ben duoi de dat lai mat khau:</p>
              <p>
                <a href="${link}" style="display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">Dat lai mat khau</a>
              </p>
              <p>Neu nut khong bam duoc, sao chep lien ket nay: <br/><a href="${link}">${link}</a></p>
              <p>Lien ket hieu luc trong 60 phut.</p>
              <p>Neu khong phai ban yeu cau, bo qua email nay.</p>
            </div>
          `,
        });
      } catch (mailErr) {
        console.error("forgotPassword sendMail error:", mailErr);
        return res.status(500).json({
          success: false,
          message: "Khong gui duoc email reset mat khau. Vui long thu lai.",
        });
      }

      return res.json({
        success: true,
        message:
          "Neu email ton tai, chung toi da gui huong dan reset mat khau.",
        link: isDev ? link : undefined,
        devToken: isDev ? token : undefined,
      });
    }
    return res.json({
      success: true,
      message: "Neu email ton tai, chung toi da gui huong dan reset mat khau.",
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { token, password } = req.body || {};
    if (!token || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Thieu token hoac mat khau" });
    }
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExp: { $gt: new Date() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Token khong hop le" });
    }
    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExp = undefined;
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();
    await revokeUserRefreshTokens(user._id);
    clearRefreshCookie(res);
    return res.json({
      success: true,
      message: "Doi mat khau thanh cong. Vui long dang nhap.",
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { token } = req.body || {};
    if (!token)
      return res
        .status(400)
        .json({ success: false, message: "Thieu token xac minh" });

    const user = await User.findOne({
      emailVerifyToken: token,
      emailVerifyExp: { $gt: new Date() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token khong hop le hoac da het han",
      });
    }

    user.emailVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExp = undefined;
    await user.save();

    return res.json({ success: true, message: "Da xac minh email" });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const resendVerifyEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Khong tim thay tai khoan" });

    if (user.emailVerified) {
      return res.json({ success: true, message: "Email da duoc xac minh" });
    }

    if (req.body?.email) {
      user.email = req.body.email;
    }

    const { link, token, isDev } = await sendVerificationEmail(user);

    return res.json({
      success: true,
      message: "Da gui lai email xac minh",
      link: isDev ? link : undefined,
      devToken: isDev ? token : undefined,
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};
