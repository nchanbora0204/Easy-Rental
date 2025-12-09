/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: Quản lý xe
 */

/**
 * @swagger
 * /api/cars:
 *   get:
 *     summary: Danh sách xe (kèm filter)
 *     tags: [Cars]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema: { type: string, example: "HCM" }
 *       - in: query
 *         name: seats
 *         schema: { type: integer, example: 4 }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number, example: 200000 }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number, example: 800000 }
 *       - in: query
 *         name: transmission
 *         schema: { type: string, enum: [manual, automatic] }
 *
 *     responses:
 *       200: { description: OK }
 */

/**
 * @swagger
 * /api/cars/{id}:
 *   get:
 *     summary: Chi tiết xe
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */

/**
 * @swagger
 * /api/cars:
 *   post:
 *     summary: Chủ xe thêm xe
 *     tags: [Cars]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [brand, model, seatingCapacity, transmission, pricePerDay]
 *             properties:
 *               brand: { type: string, example: "Toyota" }
 *               model: { type: string, example: "Vios" }
 *               year: { type: integer, example: 2020 }
 *               seatingCapacity: { type: integer, example: 5 }
 *               transmission: { type: string, enum: [manual, automatic], example: "automatic" }
 *               pricePerDay: { type: number, example: 600000 }
 *               location:
 *                 type: object
 *                 properties:
 *                   city: { type: string, example: "HCM" }
 *                   district: { type: string, example: "1" }
 *                   address: { type: string, example: "Nguyễn Huệ" }
 *     responses:
 *       201: { description: Created }
 */

/**
 * @swagger
 * /api/cars/{id}:
 *   put:
 *     summary: Chủ xe cập nhật xe
 *     tags: [Cars]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *   delete:
 *     summary: Chủ xe xoá xe (soft-delete)
 *     tags: [Cars]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */

/**
 * @swagger
 * /api/cars/{id}/toggle:
 *   patch:
 *     summary: Bật/tắt khả dụng của xe
 *     tags: [Cars]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */

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
