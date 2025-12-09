import Booking from "../bookings/booking.model.js";
import OwnerBlock from "./ownerBlock.model.js";

function parseRange(q) {
  const to = q.to ? new Date(q.to) : new Date();
  const from = q.from
    ? new Date(q.from)
    : new Date(to.getFullYear(), to.getMonth(), 1);

  const fromStart = new Date(from);
  fromStart.setHours(0, 0, 0, 0);

  const toEnd = new Date(to);
  toEnd.setHours(23, 59, 59, 999);

  return { from: fromStart, to: toEnd };
}

// Lấy lịch của chủ xe
export async function getOwnerCalendar(req, res) {
  try {
    const ownerId = req.user._id;
    const { from, to } = parseRange(req.query);

    const matchBooking = {
      owner: ownerId,
      status: { $in: ["pending", "confirmed", "ongoing", "completed"] },
      pickupDate: { $lte: to },
      returnDate: { $gte: from },
    };

    const [bookings, blocks] = await Promise.all([
      Booking.find(matchBooking)
        .populate({ path: "car", select: "brand model licensePlate" })
        .populate({ path: "user", select: "name email phone" })
        .sort({ pickupDate: 1 })
        .lean(),
      OwnerBlock.find({
        owner: ownerId,
        date: { $gte: from, $lte: to },
      })
        .sort({ date: 1 })
        .lean(),
    ]);

    return res.json({
      success: true,
      data: {
        range: { from, to },
        bookings,
        blocks,
      },
    });
  } catch (e) {
    console.error("[getOwnerCalendar] error:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
}

// Tạo block ngày không cho thuê
export const createBlock = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { date, reason } = req.body || {};

    if (!date) {
      return res
        .status(400)
        .json({ success: false, message: "Ngày block không được để trống" });
    }

    const d = new Date(date);
    if (Number.isNaN(d.getTime())) {
      return res
        .status(400)
        .json({ success: false, message: "Ngày block không hợp lệ" });
    }

    d.setHours(0, 0, 0, 0);
    // Upsert block
    const block = await OwnerBlock.findOneAndUpdate(
      {
        owner: ownerId,
        date: d,
      },
      { owner: ownerId, date: d, reason: reason || "" },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({ success: true, data: block });
  } catch (e) {
    console.error("[createBlock] error:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

// Xóa block ngày không cho thuê
export const deleteBlock = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { id } = req.params;

    const block = await OwnerBlock.findOneAndDelete({
      _id: id,
      owner: ownerId,
    });

    if (!block) {
      return res
        .status(404)
        .json({ successL: false, message: "Block không tồn tại" });
    }

    return res.json({ success: true, data: block });
  } catch (e) {
    console.error("[deleteBlock] error:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
};
