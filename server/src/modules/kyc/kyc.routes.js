import { Router } from "express";
import { protect } from "../../middleware/auth.js";
import { applyKyc, myKycStatus } from "./kyc.controller.js";

const router = Router();

router.post("/apply", protect, applyKyc);
router.get("/me/status", protect, myKycStatus);
router.get("/me", protect, myKycStatus);
export default router;
