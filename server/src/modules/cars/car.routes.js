import { Router } from "express";
import { body } from "express-validator";
import {
  protect,
  requireOwner,
  requireOwnerKycApproved,
} from "../../middleware/auth.js";
import { uploadCarImagesInLine } from "../../utils/upload.middleware.js";
import {
  createCar,
  listCars,
  toggleAvailability,
  updateCar,
  deleteCar,
  getCarById,
  ownerListCars,
  restoreCarOwner,
  cityStats,
  brandStats,
} from "./car.controller.js";

const router = Router();

router.get("/", listCars);

router.get("/owner", protect, requireOwner, ownerListCars);

router.get("/stats/cities", cityStats);

router.get("/stats/brands", brandStats);

router.get("/:id", getCarById);

router.post(
  "/",
  protect,
  requireOwnerKycApproved,
  uploadCarImagesInLine,
  body("brand").trim().notEmpty(),
  body("model").trim().notEmpty(),
  body("seatingCapacity").toInt().isInt({ min: 1 }),
  body("transmission").isIn(["manual", "automatic"]),
  body("pricePerDay").toFloat().isFloat({ min: 0 }),
  createCar
);

router.patch("/:id/restore", protect, requireOwner, restoreCarOwner);

router.put("/:id", protect, requireOwnerKycApproved, updateCar);

router.patch(
  "/:id/toggle",
  protect,
  requireOwnerKycApproved,
  toggleAvailability
);

router.delete("/:id", protect, requireOwnerKycApproved, deleteCar);

export default router;
