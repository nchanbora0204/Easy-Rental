import express from "express";
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

const router = express.Router();

/** KYC */
router.get("/kyc/pending", listPendingKyc);
router.post("/kyc/:userId/approve", approveKyc);
router.post("/kyc/:userId/reject", rejectKyc);

/** USERS */
router.get("/users", listUsers);

// Khóa user
router.patch("/users/:id/lock", (req, res) => {
  req.body.isLocked = true;
  return toggleUserLock(req, res);
});

// Mở khóa user
router.patch("/users/:id/unlock", (req, res) => {
  req.body.isLocked = false;
  return toggleUserLock(req, res);
});

/** CARS */
router.get("/cars", adminListCars);
router.post("/cars/:id/remove", removeCar);
router.post("/cars/:id/restore", restoreCar);

/** BOOKINGS */
router.get("/bookings", listBookings);
router.get("/bookings/:id", bookingDetail);

export default router;
