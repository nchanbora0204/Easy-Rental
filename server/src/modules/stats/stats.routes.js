import { Router } from "express";
import { protect, requireOwner, requireAdmin } from "../../middleware/auth.js";
import {
  ownerSummary,
  adminSummary,
  revenueByMonthAPI,
  topCarsAPI,
  userDistributionAPI,
} from "./stats.controller.js";

const router = Router();

//owner
router.get("/owner", protect, requireOwner, ownerSummary);
router.get("/owner/summary", protect, requireOwner, ownerSummary);

//admin
router.get("/admin", protect, requireAdmin, adminSummary);
router.get("/admin/summary", protect, requireAdmin, adminSummary);

//dashboard chart APIs (admin-only)
router.get("/revenue-by-month", protect, requireAdmin, revenueByMonthAPI);
router.get("/top-cars", protect, requireAdmin, topCarsAPI);
router.get("/user-distribution", protect, requireAdmin, userDistributionAPI);

export default router;
