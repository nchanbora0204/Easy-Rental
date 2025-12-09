import { Router } from "express";
import { protect, requireOwner, requireAdmin } from "../../middleware/auth.js";
import { ownerSummary, adminSummary, revenueByMonthAPI, topCarsAPI, userDistributionAPI } from "./stats.controller.js";

const router = Router();

const mustLogin = protect;
const mustAdmin = requireAdmin || protect;
/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Thống kê (Owner / Admin)
 */

/**
 * @swagger
 * /api/stats/owner/summary:
 *   get:
 *     summary: Thống kê tổng quan cho chủ xe
 *     tags: [Stats]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, example: "2025-10-01" }
 *       - in: query
 *         name: to
 *         schema: { type: string, example: "2025-10-31" }
 *     responses:
 *       200: { description: OK }
 */
router.get("/owner", mustLogin, ownerSummary);
router.get("/owner/summary", mustLogin, ownerSummary);

/**
 * @swagger
 * /api/stats/admin/summary:
 *   get:
 *     summary: Thống kê tổng quan cho admin
 *     tags: [Stats]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, example: "2025-10-01" }
 *       - in: query
 *         name: to
 *         schema: { type: string, example: "2025-10-31" }
 *     responses:
 *       200: { description: OK }
 */

// Dashboard chart APIs
router.get("/revenue-by-month", mustLogin, revenueByMonthAPI);
router.get("/top-cars", mustLogin, topCarsAPI);
router.get("/user-distribution", mustLogin, userDistributionAPI);

router.get("/admin", mustLogin, adminSummary);
router.get("/admin/summary", mustLogin, adminSummary);

export default router;
