import { Router } from "express";
import { body } from "express-validator";
import {
  register,
  login,
  me,
  updateMe,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerifyEmail,
  refreshToken,
  logout,
} from "./user.controller.js";
import { protect } from "../../middleware/auth.js";

const router = Router();
router.post(
  "/register",
  body("name").isLength({ min: 2 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  register
);

router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  login
);

router.get("/me", protect, me);
router.patch("/me", protect, updateMe);
router.post("/change-password", protect, changePassword);
router.post("/forgot-password", body("email").isEmail(), forgotPassword);
router.post(
  "/reset-password",
  body("token").notEmpty().withMessage("Token is required"),
  body("password").isLength({ min: 6 }),
  resetPassword
);
router.post(
  "/verify-email",
  body("token").notEmpty().withMessage("Token is required"),
  verifyEmail
);
router.post(
  "/resend-verify-email",
  protect,
  body("email").optional().isEmail(),
  resendVerifyEmail
);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;
