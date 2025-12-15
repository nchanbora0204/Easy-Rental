import { Router } from "express";
import {
  listPendingKyc,
  approveKyc,
  rejectKyc,
  listUsers,
  toggleUserLock,
  listCars as adminListCars,
  removeCar,
  restoreCar,
  listBookings,
  bookingDetail,
} from "./admin.controller.js";

import { protect, requireAdmin } from "../../middleware/auth.js";

const router = Router();

router.use(protect, requireAdmin);

router.get("/kyc/pending", listPendingKyc);

router.post("/kyc/:userId/approve", approveKyc);

router.post("/kyc/:userId/reject", rejectKyc);

router.get("/users", listUsers);

router.patch("/users/:id/lock", (req, res) => {
  req.body.isLocked = true;
  return toggleUserLock(req, res);
});

router.patch("/users/:id/unlock", (req, res) => {
  req.body.isLocked = false;
  return toggleUserLock(req, res);
});

router.get("/cars", adminListCars);

router.post("/cars/:id/remove", removeCar);

router.post("/cars/:id/restore", restoreCar);

router.get("/bookings", listBookings);

router.get("/bookings/:id", bookingDetail);

export default router;
