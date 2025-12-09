import mongoose, { model } from "mongoose";
import Booking from "../bookings/booking.model.js";
import User from "../users/user.model.js";
import Car from "../cars/car.model.js";
import Payment from "../payments/payment.model.js";
import bookingModel from "../bookings/booking.model.js";

// API for dashboard charts
export const revenueByMonthAPI = async (req, res) => {
  try {
    const { from, to } = parseRange(req.query);
    const matchBooking = { createdAt: { $gte: from, $lte: to } };
    const rows = await revenueByMonth(matchBooking);
    // Format for chart: [{ month: 'YYYY-MM', revenue: number }]
    const data = rows.map((r) => ({ month: r.ym, revenue: r.revenue }));
    return res.json({ success: true, data });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const topCarsAPI = async (req, res) => {
  try {
    const { from, to } = parseRange(req.query);
    const matchBooking = { createdAt: { $gte: from, $lte: to } };
    const rows = await topCars(matchBooking, 5);
    // Format for chart: [{ car: 'Brand Model', revenue: number }]
    const data = rows.map((r) => ({
      car: `${r.brand} ${r.model}`,
      revenue: r.revenue,
    }));
    return res.json({ success: true, data });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const userDistributionAPI = async (req, res) => {
  try {
    const rows = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);
    // Format for chart: [{ role: 'owner', count: n }, ...]
    const data = rows.map((r) => ({ role: r._id, count: r.count }));
    return res.json({ success: true, data });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

// chuẩn hóa khoảng ngày
function parseRange(q) {
  const to = q.to ? new Date(q.to) : new Date();
  const from = q.from
    ? new Date(q.from)
    : new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
  const fromStart = new Date(from);
  fromStart.setHours(0, 0, 0, 0);
  const toEnd = new Date(to);
  toEnd.setHours(23, 59, 59, 999);
  return { from: fromStart, to: toEnd };
}

//Doanh thu đã trả = sum(booking.total) có payment.status = paid
async function paidRevenue(matchBooking) {
  const rows = await Booking.aggregate([
    { $match: matchBooking },
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
    { $match: { paid: { $ne: [] } } },
    { $group: { _id: null, revenue: { $sum: "$total" } } },
  ]);
  return rows[0]?.revenue ?? 0;
}

async function byStatus(matchBooking) {
  const rows = await Booking.aggregate([
    { $match: matchBooking },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const all = [
    "pending",
    "confirmed",
    "ongoing",
    "completed",
    "cancelled",
    "cancelled_timeout",
  ];
  const map = Object.fromEntries(rows.map((r) => [r._id, r.count]));
  const out = {};
  all.forEach((s) => (out[s] = map[s] || 0));
  return out;
}

async function revenueByDay(matchBooking) {
  const rows = await Booking.aggregate([
    { $match: matchBooking },
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
    { $match: { paid: { $ne: [] } } },
    {
      $group: {
        _id: {
          y: { $year: "$createdAt" },
          m: { $month: "$createdAt" },
          d: { $dayOfMonth: "$createdAt" },
        },
        sum: { $sum: "$total" },
      },
    },
    { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } },
  ]);
  return rows.map((r) => ({
    date: `${r._id.y}-${String(r._id.m).padStart(2, "0")}-${String(
      r._id.d
    ).padStart(2, "0")}`,
    revenue: r.sum,
  }));
}

async function revenueByMonth(matchBooking) {
  const rows = await Booking.aggregate([
    { $match: matchBooking },
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
    { $match: { paid: { $ne: [] } } },
    {
      $group: {
        _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
        sum: { $sum: "$total" },
      },
    },
    { $sort: { "_id.y": 1, "_id.m": 1 } },
  ]);
  return rows.map((r) => ({
    ym: `${r._id.y}-${String(r._id.m).padStart(2, "0")}`,
    revenue: r.sum,
  }));
}

async function topCars(matchBooking, limit = 5) {
  const rows = await Booking.aggregate([
    { $match: matchBooking },
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
    { $match: { paid: { $ne: [] } } },
    {
      $group: { _id: "$car", revenue: { $sum: "$total" }, orders: { $sum: 1 } },
    },
    { $sort: { revenue: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "cars",
        localField: "_id",
        foreignField: "_id",
        as: "car",
      },
    },
    { $unwind: "$car" },
    {
      $project: {
        _id: 0,
        carId: "$car._id",
        brand: "$car.brand",
        model: "$car.model",
        year: "$car.year",
        revenue: 1,
        orders: 1,
      },
    },
  ]);
  return rows;
}

async function ownerUtilization(ownerId, from, to, matchBooking) {
  const carsCount = await Car.countDocuments({
    owner: ownerId,
    deletedAt: { $exists: false },
  });
  if (!carsCount) return { utilization: 0, bookedDays: 0, capacityDays: 0 };

  const msPerDay = 24 * 60 * 60 * 1000;
  const totalDays = Math.max(1, Math.ceil((to - from) / msPerDay));
  const capacityDays = totalDays * carsCount;

  const rows = await Booking.aggregate([
    { $match: matchBooking },
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
    { $match: { paid: { $ne: [] } } },
    {
      $project: {
        overlapStart: {
          $cond: [{ $gt: ["$pickupDate", from] }, "$pickupDate", from],
        },
        overlapEnd: {
          $cond: [{ $lt: ["$returnDate", to] }, "$returnDate", to],
        },
      },
    },
    {
      $project: {
        days: {
          $ceil: {
            $divide: [
              { $subtract: ["$overlapEnd", "$overlapStart"] },
              msPerDay,
            ],
          },
        },
      },
    },
    { $match: { days: { $gt: 0 } } },
    { $group: { _id: null, bookedDays: { $sum: "$days" } } },
  ]);

  const bookedDays = rows[0]?.bookedDays ?? 0;
  const utilization = capacityDays
    ? Math.round((bookedDays / capacityDays) * 1000) / 10
    : 0;
  return { utilization, bookedDays, capacityDays };
}

// OWNER SUMMARY
export const ownerSummary = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { from, to } = parseRange(req.query);
    const matchBooking = {
      owner: new mongoose.Types.ObjectId(ownerId),
      createdAt: { $gte: from, $lte: to },
    };

    const [revenue, status, daily, monthly, top, util] = await Promise.all([
      paidRevenue(matchBooking),
      byStatus(matchBooking),
      revenueByDay(matchBooking),
      revenueByMonth(matchBooking),
      topCars(matchBooking, 5),
      ownerUtilization(
        new mongoose.Types.ObjectId(ownerId),
        from,
        to,
        matchBooking
      ),
    ]);

    return res.json({
      success: true,
      data: {
        range: { from, to },
        paidRevenue: revenue,
        bookingsByStatus: status,
        revenueByDay: daily,
        revenueByMonth: monthly,
        topCars: top,
        utilization: util,
      },
    });
  } catch (e) {
    console.error("[ownerSummary] error:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

// ADMIN SUMMARY
export const adminSummary = async (req, res) => {
  try {
    const { from, to } = parseRange(req.query);
    const matchBooking = { createdAt: { $gte: from, $lte: to } };

    const [
      revenue,
      status,
      daily,
      monthly,
      top,
      ownersCount,
      carsCount,
      usersCount,
      pendingKycCount,
      roleAgg,
    ] = await Promise.all([
      paidRevenue(matchBooking),
      byStatus(matchBooking),
      revenueByDay(matchBooking),
      revenueByMonth(matchBooking),
      topCars(matchBooking, 5),
      User.countDocuments({ role: "owner" }),
      Car.countDocuments({ deletedAt: { $exists: false } }),
      User.countDocuments({}),
      User.countDocuments({ kycStatus: "pending" }),
      //Phân bổ người dùng theo role
      User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
    ]);
    // Chuẩn hóa kết quả phân bổ role
    const userRoles = {
      admin: 0,
      owner: 0,
      user: 0,
    };
    // Gán số lượng thực tế
    roleAgg.forEach((r) => {
      if (userRoles[r._id] !== undefined) {
        userRoles[r._id] = r.count;
      }
    });
    // Trả về kết quả
    return res.json({
      success: true,
      data: {
        range: { from, to },
        paidRevenue: revenue,
        bookingsByStatus: status,
        revenueByDay: daily,
        revenueByMonth: monthly,
        topCars: top,
        totals: {
          ownersCount,
          carsCount,
          usersCount,
          pendingKycCount,
        },
        userRoles,
      },
    });
  } catch (e) {
    console.error("[adminSummary] error:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
};
