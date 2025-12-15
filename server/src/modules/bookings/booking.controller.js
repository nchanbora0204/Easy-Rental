import { validationResult } from "express-validator";
import Booking from "./booking.model.js";
import Car from "../cars/car.model.js";
import mongoose from "mongoose";
import * as XLSX from "xlsx";

const OVERLAP_STATUSES = ["pending", "confirmed"];
const msPerDay = 24 * 60 * 60 * 1000;

const INSURANCE_MAP = {
  none: { key: "none", label: "Không có bảo hiểm", daily: 0 },
  basic: { key: "basic", label: "Bảo hiểm cơ bản", daily: 50000 },
  premium: { key: "plus", label: "Bảo hiểm toàn diện", daily: 120000 },
};

const DOOR_FEE = 70000;
const hasOverlap = async (carId, start, end) => {
  return await Booking.exists({
    car: carId,
    status: { $in: OVERLAP_STATUSES },
    pickupDate: { $lt: end },
    returnDate: { $gt: start },
  });
};
export const checkAvailability = async (req, res) => {
  try {
    const { carId, pickupDate, returnDate } = req.query;
    if (!carId || !pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: "Missing carId/pickupDate/returnDate",
      });
    }
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    if (!(start < end))
      return res
        .status(400)
        .json({ success: false, message: "Invalid date range" });
    const conflict = await hasOverlap(carId, start, end);
    return res.json({ success: true, data: { available: !conflict } });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });
    const carId = req.body.car || req.body.carId;
    const { pickupDate, returnDate } = req.body;
    if (!carId || !mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({ success: false, message: "Mã xe (carID) không hợp lệ" });
    }
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    if (!(start < end)) {
      return res
        .status(400)
        .json({ success: false, message: "Khoảng thời gian thuê xe không hợp lệ" });
    }
    const car = await Car.findById(carId);
    if (!car || !car.isAvailable) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy xe hoặc xe hiện không khả dụng" });
    }

    const conflict = await hasOverlap(carId, start, end);
    if (conflict)
      return res.status(409).json({
        success: false,
        message: "Thời gian thuê xe bị trùng với một đơn khác",
      });

   
    const days = Math.max(1, Math.ceil((end - start) / msPerDay));
    const basePrice = Number(car.pricePerDay || 0);
    const baseTotal = days * basePrice;
  
    const extras = req.body.extras || {};
    const pricing = req.body.pricing || {};
   
    const insKey = extras.insuranceKey || "none";
    const insCfg = INSURANCE_MAP[insKey] || INSURANCE_MAP.none;
    const insuranceDaily = insCfg.daily || 0;
    const insuranceTotal = days * insuranceDaily;
    
    const doorToDoor = !!extras.doorToDoor;
    const doorFee = extras.doorFee || DOOR_FEE;
    const deliveryTotal = doorToDoor ? doorFee * 2 : 0;
    
    const discount = Number(pricing.discount || 0);
    const preVat = Math.max(
      0,
      baseTotal + insuranceTotal + deliveryTotal - discount
    );
    const vat = Math.round(preVat * 0.1);
    const total = preVat + vat;

    const booking = await Booking.create({
      car: car._id,
      user: req.user.id,
      owner: car.owner,
      pickupDate: start,
      returnDate: end,
      days,
      status: "pending",
      basePrice,
      baseTotal,
      insurance: {
        key: insKey,
        label: insCfg.label,
        daily: insuranceDaily,
        total: insuranceTotal,
      },
      doorToDoor,
      doorFee,
      deliveryTotal,
      discount,
      vat,
      total,
      currency: car.currency || "VND",
    });

    return res.status(201).json({ success: true, data: booking });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const cancelByUser = async (req, res) => {
  const b = await Booking.findOne({
    _id: req.params.id,
    user: req.user.id,
  });
  if (!b)
    return res
      .status(404)
      .json({ success: false, message: "Booking not found" });
  if (["completed", "ongoing", "cancelled"].includes(b.status))
    return res.status(400).json({
      success: false,
      message: "Cannot cancel in current status",
    });

  const now = new Date();

  const hoursBeforePickup = (b.pickupDate - now) / (1000 * 60 * 60);
  if (hoursBeforePickup <= 0)
    return res
      .status(400)
      .json({ success: false, message: "Cannot cancel after pickup time" });

  b.status = "cancelled";
  await b.save();
  return res.json({ success: true, data: b });
};

// Chu xe doi trang thai (confirm, cancel, ...)
export const updateStatusByOwner = async (req, res) => {
  const { status } = req.body;
  const allowed = ["confirmed", "cancelled", "ongoing", "completed"];
  if (!allowed.includes(status))
    return res.status(400).json({ success: false, message: "Invalid status" });

  const b = await Booking.findOne({
    _id: req.params.id,
    owner: req.user.id,
  });
  if (!b)
    return res
      .status(404)
      .json({ success: false, message: "Booking not found" });

  // Luu y: chi cho phep chuyen trang thai hop ly
  const invalidComplete = status === "completed" && b.status !== "ongoing";
  const invalidOngoing = status === "ongoing" && b.status !== "confirmed";
  if (invalidComplete || invalidOngoing)
    return res.status(400).json({
      success: false,
      message: "Cannot change to this status from current status",
    });
  b.status = status;
  await b.save();
  return res.json({ success: true, data: b });
};

// Lấy danh sách booking của user đang đăng nhập
export const myBookings = async (req, res) => {
  try {
    const list = await Booking.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "cars",
          localField: "car",
          foreignField: "_id",
          as: "car",
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "booking",
          as: "review", 
        },
      },
      {
        $project: {
          ...Object.keys(Booking.schema.paths).reduce((acc, path) => ({ ...acc, [path]: 1 }), {}),
          car: { $first: "$car" }, 
          review: { $first: "$review._id" }, 
        },
      },
    ]);
    return res.json({ success: true, data: list });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

// Lấy danh sách booking của chủ xe đang đăng nhập
export const ownerBookings = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit || "10", 10))
    );
    const q = (req.query.q || "").trim();
    const status = (req.query.status || "all").trim();

    const baseMatch = { owner: new mongoose.Types.ObjectId(req.user.id) };
    if (status !== "all") baseMatch.status = status;

    const pipeline = [
      { $match: baseMatch },
      {
        $lookup: {
          from: "cars",
          localField: "car",
          foreignField: "_id",
          as: "car",
        },
      },
      { $unwind: "$car" },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
    ];

    if (q) {
      const regex = new RegExp(q, "i");
      pipeline.push(
        { $addFields: { _idStr: { $toString: "$_id" } } },
        {
          $match: {
            $or: [
              { "car.brand": regex },
              { "car.model": regex },
              { "user.name": regex },
              { "user.email": regex },
              { _idStr: regex },
            ],
          },
        }
      );
    }
    pipeline.push(
      { $sort: { createdAt: -1 } },
      {
        $project: {
          car: { brand: 1, model: 1, pricePerDay: 1, images: 1 },
          user: { name: 1, email: 1 },
          owner: 1,
          pickupDate: 1,
          returnDate: 1,
          days: 1,
          status: 1,
          total: 1,
          currency: 1,
          createdAt: 1,
        },
      },
      {
        $facet: {
          items: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          total: [{ $count: "count" }],
        },
      }
    );

    const agg = await Booking.aggregate(pipeline);
    const items = agg[0]?.items || [];
    const total = agg[0]?.total?.[0]?.count || 0;

    return res.json({
      success: true,
      data: items,
      paging: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

//Xuất exel danh sách đơn của owner theo filter hiện tại
export const exportOwnerBookings = async (req, res) => {
  try {
    const status = (req.query.status || "all").trim();
    const q = (req.query.q || "").trim();

    const baseMatch = { owner: new mongoose.Types.ObjectId(req.user.id) };
    if (status !== "all") baseMatch.status = status;
    const pipeline = [
      { $match: baseMatch },
      {
        $lookup: {
          from: "cars",
          localField: "car",
          foreignField: "_id",
          as: "car",
        },
      },
      { $unwind: "$car" },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
    ];
    if (q) {
      const regex = new RegExp(q, "i");
      pipeline.push(
        { $addFields: { _idStr: { $toString: "$_id" } } },
        {
          $match: {
            $or: [
              { "car.brand": regex },
              { "car.model": regex },
              { "user.name": regex },
              { "user.email": regex },
              { _idStr: regex },
            ],
          },
        }
      );
    }

    pipeline.push(
      { $sort: { createdAt: -1 } },
      {
        $project: {
          _id: 1,
          car: { brand: 1, model: 1 },
          user: { name: 1, email: 1 },
          pickupDate: 1,
          returnDate: 1,
          days: 1,
          status: 1,
          total: 1,
          currency: 1,
          createdAt: 1,
        },
      },
      // Giới hạn tối đa 5000 dòng để tránh file quá lớn
      { $limit: 5000 }
    );
    const rows = await Booking.aggregate(pipeline);

    const data = rows.map((r) => ({
      BookingID: String(r._id),
      Car: `${r?.car?.brand || ""} ${r?.car?.model || ""}`.trim(),
      Customer: r?.user?.name || "",
      Email: r?.user?.email || "",
      PickupDate: new Date(r.pickupDate).toISOString(),
      ReturnDate: new Date(r.returnDate).toISOString(),
      Days: r.days,
      Status: r.status,
      Total: r.total,
      Currency: r.currency || "VND",
      CreatedAt: new Date(r.createdAt).toISOString(),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "OwnerBookings");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=owner_bookings_${Date.now()}.xlsx`
    );
    return res.send(buf);
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

//
export const getBookingById = async (req, res) => {
  try {
    const b = await Booking.findById(req.params.id)
      .populate({ path: "car", select: "brand model pricePerDay images" })
      .populate({ path: "owner", select: "name email" });

    if (!b)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    const isUser = String(b.user) === req.user.id;
    const isOwner = String(b.owner) === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isUser && !isOwner && !isAdmin)
      return res.status(403).json({ success: false, message: "Forbidden" });

    return res.json({ success: true, data: b });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};
