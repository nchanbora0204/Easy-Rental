import mongoose from "mongoose";
import User from "../users/user.model.js";
import Car from "../cars/car.model.js";
import Booking from "../bookings/booking.model.js";
import Payment from "../payments/payment.model.js";

//KYC-KYA
export const listPendingKyc = async (req, res) => {
  try {
    const list = await User.find({ kycStatus: "pending" }).select(
      "_id email role kycStatus ownerStatus createdAt kycProfile"
    );
    return res.json({ success: true, data: list });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const approveKyc = async (req, res) => {
  try {
    const { userId } = req.params;
    const u = await User.findById(userId);
    if (!u)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    u.role = "owner";
    u.kycStatus = "approved";
    u.ownerStatus = "approved";
    u.kycProfile = u.kycProfile || {};
    u.kycProfile.approvedAt = new Date();

    await u.save();
    return res.json({
      success: true,
      message: "KYC approved",
      data: {
        userId: u._id,
        role: u.role,
        kycStatus: u.kycStatus,
        ownerStatus: u.ownerStatus,
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const rejectKyc = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body || {};
    const u = await User.findById(userId);
    if (!u)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    u.kycStatus = "rejected";
    u.ownerStatus = "rejected";
    u.kycProfile = u.kycProfile || {};
    if (reason) u.kycProfile.note = reason;

    await u.save();
    return res.json({
      success: true,
      message: "KYC rejected",
      data: { userId: u._id, kycStatus: u.kycStatus },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

//User

export const listUsers = async (req, res) => {
  try {
    const { role, locked, q, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (typeof locked !== "undefined") filter.isLocked = locked === "true";
    if (q) {
      const rx = new RegExp(q, "i");
      filter.$or = [{ name: rx }, { email: rx }, { phone: rx }];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      User.find(filter)
        .select("_id name email phone role kycStatus isLocked createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ]);
    return res.json({
      success: true,
      data: { items, total, page: Number(page), limit: Number(limit) },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

// toggleUserLock
export const toggleUserLock = async (req, res) => {
  try {
    const { id } = req.params;
    const { isLocked } = req.body || {};
    const u = await User.findByIdAndUpdate(
      id,
      { isLocked: !!isLocked },
      { new: true }
    ).select("_id name email role isLocked");
    if (!u)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    return res.json({ success: true, data: u });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

//Cars
// Danh sách xe + số lượt thuê + doanh thu
export const listCars = async (req, res) => {
  try {
    const { q, owner, active, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (q) {
      const rx = new RegExp(q, "i");
      filter.$or = [{ brand: rx }, { model: rx }, { licensePlate: rx }];
    }
    if (owner) filter.owner = new mongoose.Types.ObjectId(owner);
    // active = true -> xe đang hoạt động (chưa bị soft-delete)
    // active = false -> xe đã bị remove (có deletedAt)
    if (typeof active !== "undefined") {
      if (active === "true") {
        filter.deletedAt = { $exists: false };
      } else {
        filter.deletedAt = { $exists: true };
      }
    }

    const skip = (Number(page) - 1) * Number(limit);

    const cars = await Car.find(filter)
      .populate({ path: "owner", select: "name email phone role" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Car.countDocuments(filter);

    // Lấy danh sách id xe
    const carIds = cars.map((c) => c._id);

    // Nếu không có xe thì khỏi aggregate cho nhẹ
    let statMap = new Map();
    if (carIds.length) {
      const aggs = await Booking.aggregate([
        { $match: { car: { $in: carIds } } },
        {
          $lookup: {
            from: "payments",
            let: { bookingId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$booking", "$$bookingId"] },
                  status: "paid",
                },
              },
              { $project: { _id: 1 } },
            ],
            as: "paid",
          },
        },
        { $addFields: { paidCount: { $size: "$paid" } } },
        { $match: { paidCount: { $gt: 0 } } },
        {
          $group: {
            _id: "$car",
            orders: { $sum: 1 },
            revenue: { $sum: "$total" },
          },
        },
      ]);
      statMap = new Map(
        aggs.map((a) => [
          String(a._id),
          { orders: a.orders, revenue: a.revenue },
        ])
      );
    }

    const items = cars.map((c) => {
      const stat = statMap.get(String(c._id)) || { orders: 0, revenue: 0 };
      return {
        _id: c._id,
        brand: c.brand,
        model: c.model,
        year: c.year,
        licensePlate: c.licensePlate,
        owner: c.owner,
        deletedAt: c.deletedAt,
        createdAt: c.createdAt,
        status: c.deletedAt ? "removed" : "active",
        orders: stat.orders,
        revenue: stat.revenue,
      };
    });

    return res.json({
      success: true,
      data: { items, total, page: Number(page), limit: Number(limit) },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

// soft delete
export const removeCar = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );
    if (!car)
      return res.status(404).json({ success: false, message: "Car not found" });
    return res.json({
      success: true,
      message: "Car removed",
      data: { id: car._id },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

// restore
export const restoreCar = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findByIdAndUpdate(
      id,
      { $unset: { deletedAt: 1 } },
      { new: true }
    );
    if (!car)
      return res.status(404).json({ success: false, message: "Car not found" });
    return res.json({
      success: true,
      message: "Car restored",
      data: { id: car._id },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

//Booking
export const listBookings = async (req, res) => {
  try {
    const { status, q, from, to, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }
    if (q) {
      const rx = new RegExp(q, "i");
      filter.$or = [{ note: rx }];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const items = await Booking.find(filter)
      .populate({ path: "user", select: "name email phone" })
      .populate({ path: "owner", select: "name email phone" })
      .populate({ path: "car", select: "brand model licensePlate" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Booking.countDocuments(filter);

    return res.json({
      success: true,
      data: { items, total, page: Number(page), limit: Number(limit) },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

// booking chi tiet
export const bookingDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const b = await Booking.findById(id)
      .populate({ path: "user", select: "name email phone" })
      .populate({ path: "owner", select: "name email phone" })
      .populate({ path: "car", select: "brand model licensePlate" })
      .lean();

    if (!b)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    const payments = await Payment.find({ booking: id })
      .sort({ createdAt: 1 })
      .lean();

    return res.json({ success: true, data: { booking: b, payments } });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};
