import { GoogleGenerativeAI } from "@google/generative-ai";
import Car from "../cars/car.model.js";
import { buildCarSearchText } from "../cars/car.helper.js";

/* =========================
   KHỞI TẠO GEMINI
   ========================= */
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

/* =========================
   HELPER CHUNG
   ========================= */

// Chuẩn hóa tiếng Việt -> không dấu, lowercase, bỏ ký tự lạ
const normalizeVN = (s = "") =>
  s
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// So khớp "bỏ dấu" cho mọi pattern
const includesNorm = (normText, pattern) => {
  if (!pattern) return false;
  const np = normalizeVN(pattern);
  return normText.includes(np);
};

const escapeRegex = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// cosine similarity cho 2 vector
const cosineSimilarity = (a = [], b = []) => {
  if (!a.length || !b.length || a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
};

/* =========================
   DICTIONARY / PATTERNS
   ========================= */

// City – canonical phải khớp với dữ liệu location.city trong DB
const CITY_PATTERNS = [
  {
    canonical: "Hồ Chí Minh",
    keys: [
      "Hồ Chí Minh",
      "TP HCM",
      "TP. HCM",
      "HCM",
      "Sài Gòn",
      "Sai Gon",
      "SG",
    ],
  },
  { canonical: "Hà Nội", keys: ["Hà Nội", "Ha Noi", "Hanoi", "HN"] },
  { canonical: "Đà Nẵng", keys: ["Đà Nẵng", "Da Nang", "Danang", "DN"] },
  { canonical: "Cần Thơ", keys: ["Cần Thơ", "Can Tho", "Cantho", "CT"] },
  { canonical: "Nha Trang", keys: ["Nha Trang", "Nhatrang", "NT"] },
];

const BRAND_PATTERNS = {
  toyota: "Toyota",
  honda: "Honda",
  mazda: "Mazda",
  hyundai: "Hyundai",
  kia: "KIA",
  ford: "Ford",
  mitsubishi: "Mitsubishi",
  vinfast: "VinFast",
  mercedes: "Mercedes",
  bmw: "BMW",
};

// Hộp số: thêm đủ biến thể
const TRANSMISSION_PATTERNS = [
  {
    value: "automatic",
    keys: ["số tự động", "so tu dong", "tự động", "tu dong", "auto", "at"],
  },
  {
    value: "manual",
    keys: ["số sàn", "so san", "sàn", "san", "mt"],
  },
];

const FUEL_PATTERNS = [
  { value: "gasoline", keys: ["xăng", "xang", "xang dầu xăng"] },
  { value: "diesel", keys: ["dầu", "dau diesel", "diesel"] },
  { value: "electric", keys: ["điện", "dien", "electric", "ev"] },
  { value: "hybrid", keys: ["hybrid"] },
];

/* =========================
   PARSER CÁC FIELD RIÊNG
   ========================= */

// "7 cho", "7 ghe", "7 ghe ngoi", ...
const parseSeats = (norm) => {
  const m = norm.match(/(\d+)\s*(cho|ghe|ghe ngoi|cho ngoi)/);
  if (!m) return null;
  const n = Number(m[1]);
  return n >= 2 && n <= 50 ? n : null;
};

// bắt các cụm "600k", "700k", "1tr", "1 trieu"...
const parsePriceRange = (norm) => {
  const re = /(\d+)\s*(k|ngan|ngàn|000|tr|trieu|trieu|triệu)?/g;
  const values = [];
  let m;
  while ((m = re.exec(norm)) !== null) {
    const num = Number(m[1]);
    const unit = m[2] || "";
    let v = num;

    if (/^(k|ngan|ngàn|000)$/.test(unit)) v = num * 1000;
    else if (/^(tr|trieu|triệu)$/.test(unit)) v = num * 1_000_000;
    else continue; // không có đơn vị hoặc đơn vị lạ → bỏ (tránh dính số chỗ / năm)

    if (v > 10_000 && v < 100_000_000) values.push(v);
  }

  if (!values.length) return { minPrice: null, maxPrice: null };

  if (values.length === 1) {
    const p = values[0];
    return {
      minPrice: Math.round(p * 0.7),
      maxPrice: Math.round(p * 1.3),
    };
  }

  return {
    minPrice: Math.min(...values),
    maxPrice: Math.max(...values),
  };
};

/* =========================
   PARSE TỪ CÂU TỰ NHIÊN
   ========================= */

export const extractFiltersFromText = (raw = "") => {
  const rawStr = (raw || "").toString();
  const norm = normalizeVN(rawStr);

  console.log("[semantic] raw:", rawStr);
  console.log("[semantic] norm:", norm);

  // CITY
  let city = null;
  for (const c of CITY_PATTERNS) {
    if (c.keys.some((k) => includesNorm(norm, k))) {
      city = c.canonical;
      break;
    }
  }

  // BRAND
  let brand = null;
  for (const [key, label] of Object.entries(BRAND_PATTERNS)) {
    if (includesNorm(norm, key)) {
      brand = label;
      break;
    }
  }

  // SEATS: "5 chỗ", "7 ghế"...
  let seats = null;
  const mSeats = norm.match(/(\d+)\s*(cho|ghe|ghe ngoi|cho ngoi)/);
  if (mSeats) {
    const n = Number(mSeats[1]);
    seats = n >= 2 && n <= 50 ? n : null;
  }

  // PRICE RANGE: dùng norm cho "600k", "1tr", "700 nghìn"...
  const { minPrice, maxPrice } = parsePriceRange(norm);

  // TRANSMISSION
  let transmission = null;
  for (const t of TRANSMISSION_PATTERNS) {
    if (t.keys.some((k) => includesNorm(norm, k))) {
      transmission = t.value; // "automatic" | "manual"
      break;
    }
  }

  // FUEL
  let fuel = null;
  for (const f of FUEL_PATTERNS) {
    if (f.keys.some((k) => includesNorm(norm, k))) {
      fuel = f.value; // gasoline | diesel | electric | hybrid
      break;
    }
  }

  // SEGMENT đơn giản
  let segment = null;
  if (includesNorm(norm, "xe sang") || includesNorm(norm, "sang chảnh")) {
    segment = "luxury";
  } else if (includesNorm(norm, "giá rẻ") || includesNorm(norm, "rẻ")) {
    segment = "standard";
  }

  const onlyFeatured =
    includesNorm(norm, "nổi bật") ||
    includesNorm(norm, "được thuê nhiều") ||
    includesNorm(norm, "phổ biến");

  const parsed = {
    city,
    brand,
    seats,
    minPrice,
    maxPrice,
    transmission,
    fuel,
    segment,
    onlyFeatured,
  };

  console.log("[semantic] parsed filters:", parsed);
  return parsed;
};

/* =========================
   BUILD MONGO FILTER
   ========================= */

const buildMongoFilterFromParsed = (parsed) => {
  const {
    city,
    brand,
    seats,
    minPrice,
    maxPrice,
    transmission,
    fuel,
    segment,
    onlyFeatured,
  } = parsed;

  const f = {
    isAvailable: true,
    deletedAt: { $exists: false },
  };

  if (city) {
    f["location.city"] = { $regex: new RegExp(escapeRegex(city), "i") };
  }

  if (brand) {
    f.brand = { $regex: new RegExp(escapeRegex(brand), "i") };
  }

  if (seats) {
    f.seatingCapacity = { $gte: Number(seats) };
  }

  if (transmission) {
    f.transmission = transmission; // "automatic" | "manual"
  }

  if (fuel) {
    f.fuelType = fuel; // "gasoline" | "diesel" | "electric" | "hybrid"
  }

  if (segment) {
    f.segment = segment; // "standard" | "premium" | "luxury"
  }

  if (onlyFeatured) {
    f.featured = true;
  }

  if (minPrice || maxPrice) {
    f.pricePerDay = {};
    if (minPrice) f.pricePerDay.$gte = Number(minPrice);
    if (maxPrice) f.pricePerDay.$lte = Number(maxPrice);
  }

  return f;
};

/* =========================
   EMBEDDING (GEMINI)
   ========================= */

export const embedText = async (text) => {
  const clean = (text || "").trim();
  if (!clean) return [];

  if (!genAI) {
    throw new Error("SEMANTIC_DISABLED_NO_KEY");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const resp = await model.embedContent(clean);
    const emb = resp.embedding?.values || [];
    return emb;
  } catch (e) {
    console.error("Gemini embed error:", e);

    if (e.status === 429) {
      const err = new Error("SEMANTIC_QUOTA_EXCEEDED");
      err.original = e;
      throw err;
    }
    throw e;
  }
};

/* =========================
   UPSERT & REINDEX CAR
   ========================= */

export const upsertCarEmbedding = async (carId) => {
  const car = await Car.findById(carId);
  if (!car) return;

  const searchText = buildCarSearchText(car);
  if (!searchText) {
    car.searchText = "";
    car.searchVector = [];
    await car.save();
    return;
  }

  try {
    const vec = await embedText(searchText);
    car.searchText = searchText;
    car.searchVector = vec;
    await car.save();
  } catch (e) {
    console.error("upsertCarEmbedding error:", e.message);
  }
};

export const reindexAllCars = async (req, res) => {
  try {
    if (!genAI) {
      return res.status(500).json({
        success: false,
        message:
          "GEMINI_API_KEY chưa được cấu hình, không thể reindex semantic search.",
      });
    }

    const cars = await Car.find({});
    let updated = 0;

    for (const car of cars) {
      const searchText = buildCarSearchText(car);
      if (!searchText) continue;

      try {
        const vec = await embedText(searchText);
        car.searchText = searchText;
        car.searchVector = vec;
        await car.save();
        updated++;
      } catch (e) {
        console.error(
          `reindexAllCars: embed error for car ${car._id}:`,
          e.message
        );
      }
    }

    return res.json({
      success: true,
      message: `Đã reindex ${updated} xe.`,
    });
  } catch (e) {
    console.error("reindexAllCars error:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

/* =========================
   SEMANTIC SEARCH CHÍNH
   ========================= */

export const semanticSearchCars = async ({ text, limit = 20 }) => {
  if (!genAI) {
    // nếu không có key thì nên throw, để client fallback
    throw new Error("SEMANTIC_DISABLED_NO_KEY");
  }

  const parsed = extractFiltersFromText(text || "");
  const queryVector = await embedText(text);

  if (!queryVector || !Array.isArray(queryVector) || !queryVector.length) {
    console.warn("[semantic] queryVector empty, fallback = []");
    return [];
  }

  // 1) Full filter
  const filterFull = buildMongoFilterFromParsed(parsed);

  // 2) Bỏ min/max price + seats nhưng giữ city + brand + fuel/transmission…
  const parsedNoPriceSeat = {
    ...parsed,
    minPrice: null,
    maxPrice: null,
    seats: null,
  };
  const filterNoPriceSeat = buildMongoFilterFromParsed(parsedNoPriceSeat);

  // 3) Chỉ giữ city + các flag khác, bỏ brand
  const parsedCityOnly = {
    ...parsedNoPriceSeat,
    brand: null,
  };
  const filterCityOnly = buildMongoFilterFromParsed(parsedCityOnly);

  // 4) Global – nếu user có nói city thì vẫn giữ city, ko bỏ
  const filterGlobal = parsed.city
    ? filterCityOnly
    : { isAvailable: true, deletedAt: { $exists: false } };

  const variants = [
    { name: "full", filter: filterFull, minScore: 0.35 },
    { name: "noPriceSeat", filter: filterNoPriceSeat, minScore: 0.3 },
    { name: "cityOnly", filter: filterCityOnly, minScore: 0.25 },
    { name: "global", filter: filterGlobal, minScore: 0.2 },
  ];

  for (const v of variants) {
    const candidates = await Car.find(v.filter)
      .select(
        "_id brand model pricePerDay images seatingCapacity transmission fuelType location segment featured searchVector"
      )
      .limit(200)
      .lean();

    console.log(
      `[semantic] variant=${v.name}, filter=${JSON.stringify(
        v.filter
      )}, candidates=${candidates.length}`
    );

    if (!candidates.length) continue;

    const scored = candidates
      .filter((c) => Array.isArray(c.searchVector) && c.searchVector.length > 0)
      .map((c) => ({
        ...c,
        semanticScore: cosineSimilarity(queryVector, c.searchVector),
      }))
      .sort((a, b) => b.semanticScore - a.semanticScore);

    const good = scored.filter((c) => c.semanticScore >= v.minScore);
    if (good.length) {
      return good.slice(0, limit);
    }
  }

  return [];
};
