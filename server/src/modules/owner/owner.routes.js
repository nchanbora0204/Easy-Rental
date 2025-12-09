import { Router } from "express";
import { protect, requireOwner } from "../../middleware/auth.js";
import {
  getOwnerCalendar,
  createBlock,
  deleteBlock,
} from "./ownerCalendar.Controller.js";

const router = Router();

// Middleware bắt buộc phải là chủ xe
router.use(protect, requireOwner);

// Lấy dữ liệu lịch cho chủ xe
router.get("/calendar", getOwnerCalendar);
// Tạo block ngày không cho thuê
router.post("/calendar/blocks", createBlock);
// Xóa block ngày không cho thuê
router.delete("/calendar/blocks/:id", deleteBlock);
export default router;
