import { validationResult } from "express-validator";
import Car from "./car.model.js";
import mongoose from "mongoose";
import Booking from "../bookings/booking.model.js";
import { uploadManyBuffers } from "../../utils/cloudinaryUpload.js";
import { upsertCarEmbedding } from "../search/semantic.service.js";

const LUXURY_BRANDS = [
  "mercedes",
  "benz",
  "bmw",
  "audi",
  "lexus",
  "porsche",
  "land rover",
  "range rover",
  "jaguar",
  "volvo",
  "tesla",
  "vinfast",
];

const inferSegment = ({ brand, pricePerDay, year, seatingCapacity }) => {
  const b = (brand || "").toLowerCase();
  const price = Number(pricePerDay || 0);
  const y = Number(year || 0);
  const seats = Number(seatingCapacity || 0);

  const isLuxuryBrand = LUXURY_BRANDS.some((name) => b.includes(name));

  if (isLuxuryBrand || price >= 1500000) return "luxury";

  if (price >= 900000 || (seats >= 7 && y >= 2020)) return "premium";

  return "standard";
};

const CITY_SLUG_TO_NAME = {
  hcm: "TP. Hồ Chí Minh",
  hanoi: "Hà Nội",
  danang: "Đà Nẵng",
  cantho: "Cần Thơ",
  nhatrang: "Nha Trang",
};

const CITY_TEXT_TO_SLUG = [
  {
    slug: "hcm",
    keywords: ["hồ chí minh", "ho chi minh", "sài gòn", "sai gon", "sg"],
  },
  { slug: "hanoi", keywords: ["hà nội", "ha noi", "hn"] },
  { slug: "danang", keywords: ["đà nẵng", "da nang"] },
  { slug: "cantho", keywords: ["cần thơ", "can tho"] },
  { slug: "nhatrang", keywords: ["nha trang"] },
];
const detectCitySlugFromText = (text = "") => {
  const s = text.toLowerCase();
  for (const c of CITY_TEXT_TO_SLUG) {
    if (c.keywords.some((k) => s.includes(k))) return c.slug;
  }
  return null;
};

const normalizeLocation = (rawLoc = {}) => {
  if (!rawLoc) return null;
  let { city, citySlug, district, address, ...rest } = rawLoc;
  // Nếu FE gửi citySlug phát luôn city
  if (citySlug && !city) {
    citySlug = citySlug.toLowerCase();
    city = CITY_SLUG_TO_NAME[citySlug] || city;
  }
  // Nếu có city text nhưng chưa có slug → đoán
  if (!citySlug && city) {
    citySlug = detectCitySlugFromText(city);
  }
  // Nếu vẫn không đoán được thì để slug = undefined, không sao
  return {
    ...rest,
    city,
    citySlug,
    district,
    address,
  };
};

// Helper tạo đường dẫn folder lưu ảnh theo user
const folderForUser = (userId) => {
  const base = process.env.CLOUDINARY_FOLDER || "carrental";
  return `${base}/cars/${userId}`;
};

// Tạo xe mới
export const createCar = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const {
      brand,
      model,
      year,
      seatingCapacity,
      transmission,
      fuelType,
      fuelConsumption,
      pricePerDay,
      currency,
      location,
      description,
      images,
      segment,
      features,
    } = req.body;

    let finalLocation = null;
    if (location) {
      try {
        const rawLoc =
          typeof location === "string" ? JSON.parse(location) : location;
        finalLocation = normalizeLocation(rawLoc);
      } catch {
        finalLocation = null;
      }
    }

    let imageUrls = [];

    //Ưu tiên nhận ảnh upload từ form-data
    if (req.files?.images?.length) {
      const folder = folderForUser(req.user.id);
      const uploaded = await uploadManyBuffers(req.files.images, { folder });
      imageUrls = uploaded.map((x) => x.secure_url || x.url);
    } else {
      //Hoặc nhận sẵn mảng URL
      let imgs = images;
      if (typeof images === "string") {
        try {
          imgs = JSON.parse(images);
        } catch {
          //nếu không parse được thì bỏ qua, coi như không có
        }
      }
      if (Array.isArray(imgs)) imageUrls = imgs;
    }

    if (!imageUrls.length) {
      return res.status(400).json({
        success: false,
        message:
          "Gửi ảnh bằng form-data field 'images' (files) hoặc 'images' là mảng URL.",
      });
    }

    console.log("createCar: ownerId=", req.user.id);

    // suy đoán phân khúc xe nếu không có segment truyền vào
    const numYear = year ? Number(year) : undefined;
    const numSeats = seatingCapacity ? Number(seatingCapacity) : undefined;
    const numPrice = pricePerDay ? Number(pricePerDay) : undefined;

    const finalSegment =
      segment && ["standard", "premium", "luxury"].includes(segment)
        ? segment
        : inferSegment({
            brand,
            year: numYear,
            seatingCapacity: numSeats,
            pricePerDay: numPrice,
          });
    const isFeatured = features === true || features === "true";

    //Tạo xe mới, mặc định isAvailable=true
    const car = await Car.create({
      owner: req.user.id,
      brand,
      model,
      year: year ? Number(year) : undefined,
      seatingCapacity: seatingCapacity ? Number(seatingCapacity) : undefined,
      transmission,
      fuelType: fuelType || "gasoline",
      fuelConsumption,
      pricePerDay: pricePerDay ? Number(pricePerDay) : undefined,
      currency: currency || "VND",
      location: finalLocation,
      images: imageUrls,
      description,
      isAvailable: true,

      segment: finalSegment,
      featured: isFeatured,
    });

    console.log("createCar: car created:", JSON.stringify(car));
    upsertCarEmbedding(car._id).catch((e) =>
      console.error("createCar: upsertCarEmbedding error:", e.message)
    );
    return res.status(201).json({ success: true, data: car });
  } catch (e) {
    console.error("createCar: error", e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

const normalizeText = (s = "") =>
  s
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const CITY_ALIAS = {
  // HCM
  hochiminh: "Hồ Chí Minh",
  tphochiminh: "Hồ Chí Minh",
  tphcm: "Hồ Chí Minh",
  hcm: "Hồ Chí Minh",
  // Hà Nội
  hanoi: "Hà Nội",
  hn: "Hà Nội",
  // Đà Nẵng
  danang: "Đà Nẵng",
  dn: "Đà Nẵng",
  // Cần Thơ
  cantho: "Cần Thơ",
  ct: "Cần Thơ",
  // Nha Trang
  nhatrang: "Nha Trang",
  nt: "Nha Trang",
};

const escapeRegex = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

//listCars mới
export const listCars = async (req, res) => {
  try {
    const {
      city,
      minPrice,
      maxPrice,
      seats,
      transmission,
      brand,
      fuel,
      sort,
      segment,
      featured,
      limit,
    } = req.query;

    const q = {
      isAvailable: true,
      deletedAt: { $exists: false },
    };

    //lọc theo tp
    if (city) {
      const slug = city.toLowerCase();

      const KNOWN_SLUGS = ["hcm", "hanoi", "danang", "cantho", "nhatrang"];

      if (KNOWN_SLUGS.includes(slug)) {
        const displayName = CITY_SLUG_TO_NAME[slug] || "";
        const key = normalizeText(displayName);
        const canonical = CITY_ALIAS[key] || displayName;
        q.$or = [
          { "location.citySlug": slug },
          {
            "location.city": {
              $regex: new RegExp(escapeRegex((canonical || "").trim()), "i"),
            },
          },
        ];
      } else {
        const key = normalizeText(city);
        const canonical = CITY_ALIAS[key] || city;
        q["location.city"] = {
          $regex: new RegExp(escapeRegex(canonical.trim()), "i"),
        };
      }
    }

    //lọc theo ghế
    if (seats) {
      const nSeats = Number(seats);
      if (!Number.isNaN(nSeats)) {
        if (nSeats >= 9) {
          q.seatingCapacity = { $gte: 9 };
        } else {
          q.seatingCapacity = nSeats;
        }
      }
    }

    //lọc theo hộp số
    if (transmission) {
      q.transmission = transmission;
    }

    //lọc theo giá
    if (minPrice || maxPrice) {
      q.pricePerDay = {};
      if (minPrice) q.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) q.pricePerDay.$lte = Number(maxPrice);
    }

    //lọc theo brand
    if (brand) {
      q.brand = { $regex: new RegExp(escapeRegex(brand.trim()), "i") };
    }

    //lọc theo fuel
    if (fuel) {
      const FUEL_MAP = {
        Xăng: "gasoline",
        "Dầu diesel": "diesel",
        Điện: "electric",
        Hybrid: "hybrid",
      };
      const mapped = FUEL_MAP[fuel] || fuel;
      q.fuelType = mapped;
    }

    //lọc theo segment
    if (segment && ["standard", "premium", "luxury"].includes(segment)) {
      q.segment = segment;
    }

    //lọc theo featured
    if (featured === "true") {
      q.featured = true;
    }

    //sort
    let sortOpt = { createdAt: -1 };
    switch (sort) {
      case "price-asc":
        sortOpt = { pricePerDay: 1 };
        break;
      case "price-desc":
        sortOpt = { pricePerDay: -1 };
        break;
      case "rating":
        sortOpt = { avgRating: -1 };
        break;
      case "popular":
        sortOpt = { tripCount: -1 };
        break;
      default:
        sortOpt = { createdAt: -1 };
    }

    const _limit =
      Number(limit) && Number(limit) > 0 ? Math.min(Number(limit), 100) : 100;
    const cars = await Car.find(q).sort(sortOpt).limit(_limit);
    return res.json({ success: true, data: cars });
  } catch (e) {
    console.error("listCars error:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

// Chi tiết xe – ẩn xe đã bị gỡ (deletedAt có tồn tại)
export const getCarById = async (req, res) => {
  try {
    const { id } = req.params;

    const car = await Car.findOne({
      _id: id,
      deletedAt: { $exists: false },
    })
      .populate({ path: "owner", select: "name email avatar rating" })
      .lean();

    if (!car)
      return res.status(404).json({ success: false, message: "Car not found" });

    return res.json({ success: true, data: car });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

// Cập nhật thông tin xe (chỉ owner, xe chưa bị xoá mềm)
export const updateCar = async (req, res) => {
  try {
    const car = await Car.findOne({
      _id: req.params.id,
      owner: req.user.id,
      deletedAt: { $exists: false },
    });
    if (!car)
      return res.status(404).json({ success: false, message: "Không có xe" });
    const fields = [
      "brand",
      "model",
      "year",
      "seatingCapacity",
      "transmission",
      "fuelType",
      "fuelConsumption",
      "pricePerDay",
      "currency",
      "location",
      "description",
      "isAvailable",
      "featured",
    ];
    fields.forEach((k) => {
      if (req.body[k] !== undefined) car[k] = req.body[k];
    });

    if (req.body.location !== undefined) {
      let rawLoc = req.body.location;
      if (typeof rawLoc === "string") {
        try {
          rawLoc = JSON.parse(rawLoc);
        } catch {
          rawLoc = null;
        }
      }
      car.location = normalizeLocation(rawLoc || {});
    }

    if (req.body.segment !== undefined) {
      const sg = req.body.segment;
      if (["standard", "premium", "luxury"].includes(sg)) {
        car.segment = sg;
      }
    }

    await car.save();
    upsertCarEmbedding(car._id).catch((e) =>
      console.error("upsertCarEmbedding (update) error:", e.message)
    );
    return res.json({ success: true, data: car });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

// Bật/tắt trạng thái cho thuê (availability) – không liên quan deletedAt
export const toggleAvailability = async (req, res) => {
  try {
    const car = await Car.findOne({
      _id: req.params.id,
      owner: req.user.id,
      deletedAt: { $exists: false },
    });

    if (!car)
      return res.status(404).json({ success: false, message: "Không có xe" });

    car.isAvailable = !car.isAvailable;
    await car.save();

    return res.json({
      success: true,
      data: { id: car._id, isAvailable: car.isAvailable },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

// Xoá xe (soft delete) – owner tự xoá xe của mình
export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findOne({
      _id: req.params.id,
      owner: req.user.id,
      deletedAt: { $exists: false },
    });

    if (!car)
      return res.status(404).json({ success: false, message: "Không có xe" });

    car.deletedAt = new Date();
    car.isAvailable = false;
    await car.save();

    return res.json({ success: true, message: "Đã xóa xe" });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

// danh sách xe cho chủ xe – bao gồm cả xe đã xoá mềm
export const ownerListCars = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { q, status = "all", page = 1, limit = 10 } = req.query;

    const filter = { owner: new mongoose.Types.ObjectId(ownerId) };

    // status: all | active | unavailable | removed
    if (status === "active") {
      filter.deletedAt = { $exists: false };
      filter.isAvailable = true;
    } else if (status === "unavailable") {
      filter.deletedAt = { $exists: false };
      filter.isAvailable = false;
    } else if (status === "removed") {
      filter.deletedAt = { $exists: true };
    } // all => không thêm điều kiện

    if (q) {
      const rx = new RegExp(q, "i");
      filter.$or = [{ brand: rx }, { model: rx }, { licensePlate: rx }];
    }

    const _page = Number(page) || 1;
    const _limit = Number(limit) || 10;
    const skip = (_page - 1) * _limit;

    // Lấy danh sách xe theo trang
    const [cars, total] = await Promise.all([
      Car.find(filter)
        .select(
          "_id brand model year pricePerDay isAvailable licensePlate deletedAt segment featured"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(_limit)
        .lean(),
      Car.countDocuments(filter),
    ]);

    // Thống kê orders/revenue (chỉ tính booking đã paid)
    const carIds = cars.map((c) => c._id);
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

    const items = cars.map((c) => ({
      ...c,
      removed: !!c.deletedAt,
      stats: statMap.get(String(c._id)) || { orders: 0, revenue: 0 },
    }));

    return res.json({
      success: true,
      data: { items, total, page: _page, limit: _limit },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

// Khôi phục xe đã xoá mềm (soft delete) – owner tự khôi phục xe của mình
export const restoreCarOwner = async (req, res) => {
  try {
    const car = await Car.findOne({
      _id: req.params.id,
      owner: req.user.id,
      deletedAt: { $exists: true },
    });
    if (!car)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy xe đã xoá mềm" });
    (car.deletedAt = undefined), { strict: false };
    car.isAvailable = true;
    await car.save();
    return res.json({
      success: true,
      message: "Đã khôi phục xe",
      data: { id: car._id },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

// Thống kê số xe theo thành phố 
export const cityStats = async (req, res) => {
  try {
    const limit =
      Number(req.query.limit) && Number(req.query.limit) > 0
        ? Math.min(Number(req.query.limit), 12)
        : 5; 

    const rows = await Car.aggregate([
      {
        $match: {
          isAvailable: true,
          deletedAt: { $exists: false },
        },
      },
      {
        $addFields: {
          _cityName: {
            $trim: {
              input: {
                $ifNull: ["$location.city", "$city"],
              },
            },
          },
        },
      },
      {
        $match: {
          _cityName: { $exists: true, $ne: "" },
        },
      },
      {
        $group: {
          _id: "$_cityName",
          totalCars: { $sum: 1 },
        },
      },
      { $sort: { totalCars: -1 } },
      { $limit: limit },
    ]);

    const data = rows.map((r) => ({
      city: r._id,
      totalCars: r.totalCars,
    }));

    return res.json({ success: true, data });
  } catch (e) {
    console.error("cityStats error:", e);
    return res.status(500).json({
      success: false,
      message: "Không tải được thống kê theo thành phố.",
    });
  }
};

// Thống kê số xe theo hãng (Home: "Chọn xe theo hãng")
export const brandStats = async (req, res) => {
  try {
    const limit =
      Number(req.query.limit) && Number(req.query.limit) > 0
        ? Math.min(Number(req.query.limit), 24)
        : 8; // mặc định 8 hãng

    const rows = await Car.aggregate([
      {
        $match: {
          isAvailable: true,
          deletedAt: { $exists: false },
          brand: { $exists: true, $ne: "" },
        },
      },
      {
        $group: {
          _id: "$brand",
          totalCars: { $sum: 1 },
        },
      },
      { $sort: { totalCars: -1 } },
      { $limit: limit },
    ]);

    const data = rows.map((r) => ({
      brand: r._id,
      totalCars: r.totalCars,
    }));

    return res.json({ success: true, data });
  } catch (e) {
    console.error("brandStats error:", e);
    return res.status(500).json({
      success: false,
      message: "Không tải được thống kê theo hãng xe.",
    });
  }
};
