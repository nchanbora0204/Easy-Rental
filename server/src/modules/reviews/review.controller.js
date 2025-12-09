import mongoose from "mongoose";
import Review from "./review.model.js";
import Car from "../cars/car.model.js";
import Booking from "../bookings/booking.model.js";

//Lấy danh sách đánh giá cho trang chủ
export const listReviews = async (req, res) => {
  try {
    const limit =
      Number(req.query.limit) && Number(req.query.limit) > 0
        ? Math.min(Number(req.query.limit), 50)
        : 10;

    const sort = req.query.sort || "recent";
    const sortOpt =
      sort === "top" || sort === "rating"
        ? { rating: -1, createdAt: -1 } 
        : { createdAt: -1 };

    const reviews = await Review.find({
      comment: { $exists: true, $ne: "" }, 
    })
      .populate({ path: "user", select: "name avatar" }) 
      .sort(sortOpt)
      .limit(limit)
      .lean();

    return res.json({ success: true, data: reviews });
  } catch (e) {
    console.error("listReviews error:", e);
    return res.status(500).json({
      success: false,
      message: "Không tải được danh sách đánh giá.",
    });
  }
};

// Hàm tính lại điểm đánh giá trung bình và số lượng đánh giá của xe
const recomputeCarRating = async (carId) => {
  const stats = await Review.aggregate([
    { $match: { car: new mongoose.Types.ObjectId(carId) } },
    {
      $group: {
        _id: "$car",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const { avgRating = 0, totalReviews = 0 } = stats[0] || {};

  await Car.findByIdAndUpdate(
    carId,
    {
      avgRating: Number(avgRating.toFixed(1)),
      reviewCount: totalReviews,
    },
    { runValidators: false }
  );
};

//Tạo đánh giá mới
export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const numericRating = Number(rating);

    if (!bookingId || !numericRating) {
      return res.status(400).json({
        success: false,
        message: "Thiếu bookingId hoặc rating.",
      });
    }

    if (numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating không hợp lệ. Vui lòng chọn từ 1 đến 5 sao.",
      });
    }
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.id,
    }).populate({ path: "car", select: "_id" });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn đặt xe.",
      });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Chỉ có thể đánh giá những chuyến đi đã hoàn thành.",
      });
    }

    const doc = {
      car: booking.car._id || booking.car,
      booking: booking._id,
      user: req.user.id,
      rating: numericRating,
      comment: (comment || "").trim(),
    };

    let review;
    try {
      review = await Review.create(doc);
    } catch (err) {
      if (err?.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Bạn đã đánh giá đơn đặt xe này rồi.",
        });
      }
      throw err;
    }
    await recomputeCarRating(doc.car);

    return res.status(201).json({ success: true, data: review });
  } catch (e) {
    console.error("createReview error:", e);
    return res.status(500).json({
      success: false,
      message: "Không tạo được đánh giá. Vui lòng thử lại sau.",
    });
  }
};

//Lấy danh sách đánh giá của 1 xe
export const getCarReviews = async (req, res) => {
  try {
    const { carId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { car: carId };

    const [items, total] = await Promise.all([
      Review.find(filter)
        .populate({ path: "user", select: "name avatar" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      data: {
        items,
        total,
        page,
        limit,
      },
    });
  } catch (e) {
    console.error("getCarReviews error:", e);
    return res.status(500).json({
      success: false,
      message: "Không tải được danh sách đánh giá của xe.",
    });
  }
};

//Lấy đánh giá cho 1 đơn đặt xe
export const getReviewBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const review = await Review.findOne({
      booking: bookingId,
      user: req.user.id,
    })
      .populate({ path: "car", select: "brand model images image" })
      .lean();

    return res.json({
      success: true,
      data: review || null,
    });
  } catch (e) {
    console.error("getReviewBooking error:", e);
    return res.status(500).json({
      success: false,
      message: "Không tải được đánh giá cho đơn đặt xe này.",
    });
  }
};
