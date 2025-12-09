import { Router } from "express";
import { protect } from "../../middleware/auth.js";
import { applyKyc, myKycStatus } from "./kyc.controller.js";

/**
 * @swagger
 * tags:
 *   name: KYC
 *   description: Xác minh danh tính cá nhân (CCCD) để đăng xe
 */

const router = Router();


/**
 * @swagger
 * /api/kyc/apply:
 *   post:
 *     summary: Nộp hồ sơ KYC cá nhân để trở thành chủ xe
 *     tags: [KYC]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, phone, idNumber, idFrontUrl, idBackUrl, selfieWithIdUrl, address, bankAccount, bankName]
 *             properties:
 *               fullName: { type: string, example: "Nguyễn Văn A" }
 *               phone: { type: string, example: "0901234567" }
 *               dateOfBirth: { type: string, example: "1999-10-01" }
 *               idNumber: { type: string, example: "079xxxxxxxx" }
 *               idIssueDate: { type: string, example: "2021-05-01" }
 *               idFrontUrl: { type: string, example: "https://.../cccd_front.jpg" }
 *               idBackUrl: { type: string, example: "https://.../cccd_back.jpg" }
 *               selfieWithIdUrl: { type: string, example: "https://.../selfie_cccd.jpg" }
 *               address: { type: string, example: "Quận 1, HCM" }
 *               bankAccount: { type: string, example: "123456789" }
 *               bankName: { type: string, example: "ACB" }
 *               note: { type: string, example: "Ghi chú bổ sung" }
 *     responses:
 *       200: { description: Submitted }
 */
router.post("/apply", protect, applyKyc);

/**
 * @swagger
 * /api/kyc/me/status:
 *   get:
 *     summary: Xem trạng thái KYC cá nhân
 *     tags: [KYC]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
router.get("/me/status", protect, myKycStatus);
router.get("/me", protect, myKycStatus);
export default router;
