import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Star,
  ChevronRight,
  Shield,
  CreditCard,
  Headphones,
  Phone,
} from "lucide-react";
import api from "../lib/axios";
import { useAuth } from "../contexts/AuthContext";
import Modal from "../components/Modal";

const fmtVND = (n) => new Intl.NumberFormat("vi-VN").format(Number(n || 0));

const formatLocation = (car) => {
  const loc = car?.location ?? car?.city ?? car?.address;
  if (!loc) return "";
  if (typeof loc === "string") return loc;
  const { address, district, ward, city, province, state } = loc;
  return [address, district || ward, city || province || state]
    .filter(Boolean)
    .join(", ");
};

// ================== CITY META + HELPERS ==================
const CITY_META = [
  {
    slug: "hcm",
    label: "TP. Hồ Chí Minh",
    image: "/cities/sg.jpg",
    aliases: [
      "Hồ Chí Minh",
      "TP. Hồ Chí Minh",
      "TP Hồ Chí Minh",
      "Ho Chi Minh",
      "Thành phố Hồ Chí Minh",
    ],
  },
  {
    slug: "hanoi",
    label: "Hà Nội",
    image: "/cities/hn.jpg",
    aliases: ["Hà Nội", "Ha Noi", "Thành phố Hà Nội"],
  },
  {
    slug: "danang",
    label: "Đà Nẵng",
    image: "/cities/dn.jpg",
    aliases: ["Đà Nẵng", "Da Nang", "Thanh pho Da Nang"],
  },
  {
    slug: "cantho",
    label: "Cần Thơ",
    image: "/cities/ct.jpg",
    aliases: ["Cần Thơ", "Can Tho", "TP. Cần Thơ"],
  },
  {
    slug: "nhatrang",
    label: "Nha Trang",
    image: "/cities/nt.jpg",
    aliases: ["Nha Trang", "Thành phố Nha Trang"],
  },
];

// dùng cho select ở hero
const CITY_OPTIONS = CITY_META.map(({ slug, label }) => ({
  value: slug,
  label,
}));

const normalizeCityName = (s = "") =>
  s
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const findCityMetaByName = (name = "") => {
  const norm = normalizeCityName(name);
  return (
    CITY_META.find((c) => {
      if (normalizeCityName(c.label) === norm) return true;
      if (c.aliases) {
        return c.aliases.some((a) => normalizeCityName(a) === norm);
      }
      return false;
    }) || null
  );
};

// ================== BRAND LOGOS ==================
const BRAND_LOGOS = {
  NISSAN: "/brands/nissan.png",
  BMW: "/brands/bmw.png",
  KIA: "/brands/kia.png",
  MG: "/brands/MG.png",
  HONDA: "/brands/honda.png",
  MAZDA: "/brands/mazda.png",
  VOLKSWAGEN: "/brands/volkswagen.png",
  MERCEDES: "/brands/mercedes.png",
  TOYOTA: "/brands/toyota.png",
  FORD: "/brands/ford.png",
  MITSUBISHI: "/brands/mitsubishi.png",
  HYUNDAI: "/brands/hyundai.png",
  AUDI: "/brands/audi.png",
  VOLVO: "/brands/volvo.png",
  SUBARU: "/brands/subaru.png",
  LEXUS: "/brands/lexus.png",
};

// badge phân khúc xe
const getSegmentBadge = (segment) => {
  switch (segment) {
    case "luxury":
      return {
        label: "Xe sang",
        className: "bg-purple-600 text-white",
      };
    case "premium":
      return {
        label: "Xe cao cấp",
        className: "bg-amber-500 text-white",
      };
    default:
      return {
        label: "Xe tiêu chuẩn",
        className: "bg-sky-600 text-white",
      };
  }
};

const HERO_SLIDES = [
  {
    id: 1,
    src: "/scenery/camping.jpg",
    alt: "Hành trình khám phá cùng gia đình",
  },
  {
    id: 2,
    src: "/scenery/ntview.jpg",
    alt: "Du lịch biển cùng bạn bè",
  },
  {
    id: 3,
    src: "/scenery/road.jpg",
    alt: "Công tác linh hoạt trong thành phố",
  },
];

const SUPPORT_PHONE = "0916549515";
const ZALO_LINK = "https://zalo.me/0916549515";

function useFadeInOnScroll() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function FadeSection({ className = "", children }) {
  const [ref, visible] = useFadeInOnScroll();
  return (
    <section
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
      }}
    >
      {children}
    </section>
  );
}

export default function Home() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [showOwnerModal, setShowOwnerModal] = useState(false);

  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const [pickupLocation, setPickupLocation] = useState("hcm");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const canSearch = useMemo(
    () => !!(pickupDate && returnDate),
    [pickupDate, returnDate]
  );

  const [featured, setFeatured] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [apiErr, setApiErr] = useState("");
  const [luxury, setLuxury] = useState([]);
  const [loadingLuxury, setLoadingLuxury] = useState(true);
  const [luxuryErr, setLuxuryErr] = useState("");
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [testimonialsErr, setTestimonialsErr] = useState("");
  const [brandStats, setBrandStats] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [brandErr, setBrandErr] = useState("");
  const [cityStats, setCityStats] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [cityErr, setCityErr] = useState("");

  // ================== FEATURED (CHỈ XE TIÊU CHUẨN) ==================
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingFeatured(true);
        setApiErr("");
        const { data } = await api.get("/cars", {
          params: { limit: 20 },
        });
        const list = data?.data ?? data?.items ?? [];

        // chỉ giữ xe standard / chưa gắn segment => Xe nổi bật
        const standardList = list.filter(
          (c) => !c.segment || c.segment === "standard"
        );

        if (alive) setFeatured(standardList.slice(0, 6));
      } catch (e) {
        if (alive)
          setApiErr(
            e?.response?.data?.message ||
              e.message ||
              "Không thể tải được xe nổi bật"
          );
      } finally {
        if (alive) setLoadingFeatured(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // ================== LUXURY / PREMIUM ==================
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingLuxury(true);
        setLuxuryErr("");
        const { data } = await api.get("/cars", {
          params: { limit: 30 },
        });
        const list = data?.data ?? data?.items ?? [];

        const luxList = list.filter(
          (c) => c.segment === "luxury" || c.segment === "premium"
        );

        if (alive) setLuxury(luxList.slice(0, 6));
      } catch (e) {
        if (alive) {
          setLuxuryErr(
            e?.response?.data?.message ||
              e.message ||
              "Không thể tải được danh sách xe cao cấp."
          );
        }
      } finally {
        if (alive) setLoadingLuxury(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // ================== TESTIMONIALS ==================
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoadingTestimonials(true);
        setTestimonialsErr("");

        const { data } = await api.get("/reviews", {
          params: { limit: 5, sort: "recent" },
        });

        const list = data?.data ?? data?.items ?? data?.reviews ?? data ?? [];
        if (alive) setTestimonials(list);
      } catch (e) {
        if (alive) {
          console.error("Load home reviews error:", e);
          setTestimonialsErr(
            e?.response?.data?.message ||
              e.message ||
              "Không thể tải được đánh giá khách hàng."
          );
        }
      } finally {
        if (alive) setLoadingTestimonials(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // ================== BRAND STATS ==================
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingBrands(true);
        setBrandErr("");
        const { data } = await api.get("/cars/stats/brands", {
          params: { limit: 8 },
        });
        const list = data?.data ?? data?.items ?? [];
        if (alive) setBrandStats(list);
      } catch (e) {
        if (alive) {
          console.error("home brands stats error", e);
          setBrandErr(
            e?.response?.data?.message ||
              e.message ||
              "Không thể tải được thống kê theo hãng xe."
          );
        }
      } finally {
        if (alive) setLoadingBrands(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // ================== CITY STATS ==================
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingCities(true);
        setCityErr("");
        const { data } = await api.get("/cars/stats/cities", {
          params: { limit: 5 },
        });
        const list = data?.data ?? data?.items ?? [];
        if (alive) setCityStats(list);
      } catch (e) {
        if (alive) {
          console.error("home cities stats error", e);
          setCityErr(
            e?.response?.data?.message ||
              e.message ||
              "Không thể tải được thống kê theo địa điểm."
          );
        }
      } finally {
        if (alive) setLoadingCities(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Map city stats theo slug để dễ render
  const cityStatsMap = useMemo(() => {
    const map = new Map();

    cityStats.forEach((c) => {
      const rawName = c.city || c._id || "";
      const total = c.totalCars ?? c.count ?? 0;
      if (!rawName) return;

      const meta = findCityMetaByName(rawName);
      const key = meta?.slug || normalizeCityName(rawName);

      if (!key) return;
      map.set(key, total);
    });

    return map;
  }, [cityStats]);

  const faqs = [
    "Tại sao nên lựa chọn thuê xe tự lái Bonboncar?",
    "Phí thuê xe có bao gồm bảo hiểm xe không?",
    "Điều kiện và thủ tục thuê xe bao gồm gì?",
    "Xe có đầy đủ giấy tờ không?",
    "Tôi cần phải đặt cọc khi thuê xe?",
    "Tôi có thể hủy hoặc thay đổi đơn hàng không?",
    "Trường hợp xe bị hư hỏng cần xử lý thế nào?",
  ];
  const steps = [
    {
      icon: "01",
      title: "Chọn xe trên hệ thống",
      desc: "Duyệt và lựa chọn xe phù hợp",
    },
    {
      icon: "02",
      title: "Đặt xe qua hệ thống",
      desc: "Đặt xe nhanh chóng online",
    },
    {
      icon: "03",
      title: "Nhận xe và khởi hành",
      desc: "Tận hưởng chuyến đi",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "An toàn & bảo hiểm",
      desc: "Mỗi chuyến đi đều được bảo hiểm và hỗ trợ xử lý sự cố.",
    },
    {
      icon: CreditCard,
      title: "Giá minh bạch",
      desc: "Giá thuê rõ ràng theo ngày, không phí ẩn, thanh toán linh hoạt.",
    },
    {
      icon: Headphones,
      title: "Hỗ trợ 24/7",
      desc: "Đội ngũ CSKH sẵn sàng hỗ trợ bạn trong suốt hành trình.",
    },
  ];

  const buildQS = () => {
    const p = new URLSearchParams();
    if (pickupDate) p.set("pickup", pickupDate);
    if (pickupTime) p.set("pickupTime", pickupTime);
    if (returnDate) p.set("return", returnDate);
    if (returnTime) p.set("returnTime", returnTime);
    const s = p.toString();
    return s ? `?${s}` : "";
  };

  const onSearch = () => {
    const qs = new URLSearchParams();
    if (pickupLocation) qs.set("city", pickupLocation);
    if (pickupDate) qs.set("pickup", pickupDate);
    if (pickupTime) qs.set("pickupTime", pickupTime);
    if (returnDate) qs.set("return", returnDate);
    if (returnTime) qs.set("returnTime", returnTime);
    nav(`/search?${qs.toString()}`);
  };

  const gotoDetail = (id, name, carObj) => {
    if (id) {
      nav(`/cars/${id}${buildQS()}`, { state: { car: carObj } });
    } else {
      nav(`/search?keyword=${encodeURIComponent(name)}`);
    }
  };

  const handleRegisterCar = () => {
    if (user?.role === "owner") {
      setShowOwnerModal(true);
    } else {
      nav("/register-car/kyc");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* HERO */}
      <section className="relative min-h-[640px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="flex h-full w-full transition-transform duration-[1200ms] ease-out"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {HERO_SLIDES.map((slide) => (
              <div key={slide.id} className="relative w-full shrink-0">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-10 items-center">
            <div className="text-white space-y-6 max-w-xl">
              <p className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-xs font-medium backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400 mr-2" />
                4.8/5 từ hàng trăm chuyến đi
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Thuê xe tự lái
                <br />
                <span className="text-accent">cho mọi hành trình</span>
              </h1>
              <p className="text-sm md:text-base text-white/80">
                Đặt xe trong vài phút, nhận xe nhanh tại các địa điểm gần bạn.
                Giá rõ ràng, bảo hiểm đầy đủ, hỗ trợ 24/7.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <Shield size={16} /> Bảo hiểm chuyến đi
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard size={16} /> Thanh toán linh hoạt
                </div>
                <div className="flex items-center gap-2">
                  <Headphones size={16} /> Hỗ trợ 24/7
                </div>
              </div>
              <div className="flex gap-4 text-xs text-white/70">
                <button
                  onClick={handleRegisterCar}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-white/10 hover:bg-white/15 backdrop-blur font-medium"
                >
                  Trở thành chủ xe
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* FORM TÌM XE */}
            <div className="card bg-white/95 backdrop-blur-sm shadow-xl shadow-black/10">
              <div className="card-body">
                <h2 className="text-lg font-semibold mb-4">
                  Tìm xe phù hợp cho chuyến đi
                </h2>
                <div className="grid gap-4">
                  <div>
                    <label className="label flex items-center gap-2">
                      <MapPin size={16} />
                      Địa điểm nhận xe
                    </label>
                    <select
                      className="select"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                    >
                      {CITY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Ngày nhận xe</label>
                      <input
                        type="date"
                        className="input text-sm"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label">Giờ nhận xe</label>
                      <input
                        type="time"
                        className="input text-sm"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Ngày trả xe</label>
                      <input
                        type="date"
                        className="input text-sm"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label">Giờ trả xe</label>
                      <input
                        type="time"
                        className="input text-sm"
                        value={returnTime}
                        onChange={(e) => setReturnTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    className="btn btn-primary w-full mt-2"
                    onClick={onSearch}
                    disabled={!canSearch}
                  >
                    Tìm xe ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HERO DOTS */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setActiveSlide(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === activeSlide ? "w-6 bg-white" : "w-3 bg-white/50"
              }`}
              aria-label={`Xem ảnh ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* SMALL FEATURES */}
      <FadeSection className="section -mt-10 pb-4 relative z-20">
        <div className="grid md:grid-cols-3 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="card bg-white shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="card-body flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{f.title}</h3>
                    <p className="text-sm text-[var(--color-muted)]">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </FadeSection>

      {/* =============== XE NỔI BẬT (STANDARD ONLY) =============== */}
      <FadeSection className="section py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Xe nổi bật</h2>
          <Link
            to="/search"
            className="text-primary hover:underline flex items-center gap-1 text-sm font-medium"
          >
            Xem thêm <ChevronRight size={16} />
          </Link>
        </div>

        {apiErr && (
          <div className="card mb-4">
            <div className="card-body text-[var(--color-danger)] text-sm">
              {apiErr}
            </div>
          </div>
        )}

        {loadingFeatured && !featured.length && (
          <div className="text-sm text-[var(--color-muted)] mb-4">
            Đang tải danh sách xe nổi bật...
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.length ? (
            featured.map((car) => {
              const id = car._id || car.id;
              const name =
                `${car.brand || ""} ${car.model || ""}`.trim() ||
                car.name ||
                "Xe cho thuê";
              const image =
                car.images?.[0] ||
                car.image ||
                "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&h=500&fit=crop";

              const pricePerDay = car.pricePerDay;
              const priceText = pricePerDay
                ? `${fmtVND(pricePerDay)} ₫`
                : car.price || "";

              const loc = formatLocation(car) || car.location;
              const rating = car.avgRating ?? car.rating;
              const trips = car.tripCount ?? car.trips;

              const { label: badgeLabel, className: badgeClass } =
                getSegmentBadge(car.segment);

              const oldPrice =
                car.oldPrice != null ? `${fmtVND(car.oldPrice)} ₫` : null;

              return (
                <button
                  key={id || name}
                  className="card group hover:shadow-xl transition-all cursor-pointer text-left"
                  onClick={() => gotoDetail(id, name, car)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={image}
                      alt={name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold shadow-sm ${badgeClass}`}
                      >
                        {badgeLabel}
                      </span>
                    </div>
                    {rating ? (
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-yellow-300">
                          <Star
                            size={14}
                            className="text-yellow-300"
                            fill="currentColor"
                          />{" "}
                          {rating}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <div className="card-body">
                    <h3 className="font-semibold text-lg">{name}</h3>
                    {loc && (
                      <div className="flex items-center gap-2 text-sm text-[var(--color-muted)] mb-2">
                        <MapPin size={14} />
                        {loc}
                      </div>
                    )}
                    {(rating || trips) && (
                      <div className="flex items-center gap-3 mb-3">
                        {rating && (
                          <div className="flex items-center gap-1">
                            <Star
                              size={14}
                              className="text-yellow-400"
                              fill="currentColor"
                            />
                            <span className="text-sm font-medium">
                              {rating}
                            </span>
                          </div>
                        )}
                        {trips ? (
                          <span className="text-[var(--color-muted)] text-sm">
                            Đã {trips} chuyến
                          </span>
                        ) : null}
                      </div>
                    )}
                    <div className="border-t border-[var(--color-border)] pt-3 flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold">{priceText}</span>
                        {oldPrice && (
                          <span className="text-sm text-[var(--color-muted)] line-through">
                            {oldPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="col-span-full text-center text-sm text-[var(--color-muted)]">
              Hiện chưa có xe nào đang cho thuê.
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <Link to="/search" className="btn btn-outline">
            Xem thêm xe đang cho thuê
          </Link>
        </div>
      </FadeSection>

      {/* =============== LUXURY / PREMIUM SECTION =============== */}
      <FadeSection className="section py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Xe xịn - Xe sang - Xe cao cấp</h2>
          <Link
            to="/search?segment=luxury"
            className="text-primary hover:underline flex items-center gap-1 text-sm font-medium"
          >
            Xem thêm <ChevronRight size={16} />
          </Link>
        </div>

        {luxuryErr && (
          <div className="card mb-4">
            <div className="card-body text-[var(--color-danger)] text-sm">
              {luxuryErr}
            </div>
          </div>
        )}

        {loadingLuxury && !luxury.length && (
          <div className="text-sm text-[var(--color-muted)] mb-4">
            Đang tải danh sách xe cao cấp...
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {luxury.length
            ? luxury.map((car) => {
                const id = car._id || car.id;
                const name =
                  `${car.brand || ""} ${car.model || ""}`.trim() ||
                  car.name ||
                  "Xe cao cấp";

                const image =
                  car.images?.[0] ||
                  car.image ||
                  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&h=500&fit=crop";

                const pricePerDay = car.pricePerDay;
                const priceText = pricePerDay
                  ? `${fmtVND(pricePerDay)} ₫`
                  : car.price || "";

                const loc = formatLocation(car) || car.location;
                const rating = car.avgRating ?? car.rating;
                const trips = car.tripCount ?? car.trips;

                const { label: badgeLabel, className: badgeClass } =
                  getSegmentBadge(car.segment);

                return (
                  <button
                    key={id || name}
                    className="card group hover:shadow-xl transition-all cursor-pointer text-left"
                    onClick={() => gotoDetail(id, name, car)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={image}
                        alt={name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold shadow-sm ${badgeClass}`}
                        >
                          {badgeLabel}
                        </span>
                      </div>
                      {rating ? (
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-yellow-300">
                            <Star
                              size={14}
                              className="text-yellow-300"
                              fill="currentColor"
                            />{" "}
                            {rating}
                          </span>
                        </div>
                      ) : null}
                    </div>
                    <div className="card-body">
                      <h3 className="font-semibold text-lg">{name}</h3>
                      {loc && (
                        <div className="flex items-center gap-2 text-sm text-[var(--color-muted)] mb-2">
                          <MapPin size={14} />
                          {loc}
                        </div>
                      )}
                      {(rating || trips) && (
                        <div className="flex items-center gap-3 mb-3">
                          {rating && (
                            <div className="flex items-center gap-1">
                              <Star
                                size={14}
                                className="text-yellow-400"
                                fill="currentColor"
                              />
                              <span className="text-sm font-medium">
                                {rating}
                              </span>
                            </div>
                          )}
                          {trips && (
                            <span className="text-sm text-[var(--color-muted)]">
                              Đã {trips} chuyến
                            </span>
                          )}
                        </div>
                      )}
                      <div className="border-t border-[var(--color-border)] pt-3">
                        <span className="text-lg font-bold">{priceText}</span>
                      </div>
                    </div>
                  </button>
                );
              })
            : !loadingLuxury && (
                <div className="col-span-full text-center text-sm text-[var(--color-muted)]">
                  Hiện chưa có xe cao cấp.
                </div>
              )}
        </div>

        <div className="text-center mt-8">
          <Link to="/search?segment=luxury" className="btn btn-outline">
            Xem thêm xe cao cấp
          </Link>
        </div>
      </FadeSection>

      {/* BRAND SECTION (giữ nguyên logic cũ) */}
      <FadeSection className="section py-12">
        <h2 className="text-2xl font-bold text-center mb-8">
          Chọn xe theo hãng
        </h2>

        {brandErr && (
          <p className="text-center text-sm text-[var(--color-danger)] mb-4">
            {brandErr}
          </p>
        )}

        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {loadingBrands && !brandStats.length ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="card animate-pulse flex items-center justify-center"
              >
                <div className="card-body">
                  <div className="h-8 bg-[var(--color-surface)] rounded" />
                </div>
              </div>
            ))
          ) : brandStats.length ? (
            brandStats.map((b, idx) => {
              const rawName = b.brand || b._id || "Khác";
              const name = rawName.toString().trim();
              const key = name.toUpperCase();
              const logo = BRAND_LOGOS[key] || "/brands/placeholder.png";
              const total = b.totalCars ?? b.count ?? 0;

              return (
                <button
                  key={key + idx}
                  className="card hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() =>
                    nav(`/search?brand=${encodeURIComponent(name)}`)
                  }
                >
                  <div className="card-body flex flex-col items-center justify-center p-3">
                    <img
                      src={logo}
                      alt={name}
                      className="h-8 w-auto grayscale group-hover:grayscale-0 transition-all mb-1 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "/brands/placeholder.png";
                      }}
                    />
                    <span className="text-xs font-semibold mt-1 text-center">
                      {name}
                    </span>
                    <span className="text-[10px] text-[var(--color-muted)]">
                      {total} xe
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <p className="col-span-full text-center text-sm text-[var(--color-muted)]">
              Hiện chưa có dữ liệu hãng xe.
            </p>
          )}
        </div>
      </FadeSection>

      {/* CITY SECTION */}
      <FadeSection className="section py-12">
        <h2 className="text-2xl font-bold text-center mb-8">
          Địa điểm nổi bật
        </h2>
        {cityErr && (
          <p className="text-center text-sm text-[var(--color-danger)] mb-4">
            {cityErr}
          </p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {loadingCities && !cityStats.length
            ? Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="card overflow-hidden animate-pulse">
                  <div className="h-32 bg-[var(--color-surface)]" />
                </div>
              ))
            : CITY_META.map((meta) => {
                const total = cityStatsMap.get(meta.slug) || 0;

                return (
                  <button
                    key={meta.slug}
                    className="card overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group text-left"
                    onClick={() => nav(`/search?city=${meta.slug}`)}
                  >
                    <div className="relative h-32">
                      <img
                        src={meta.image}
                        alt={meta.label}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="card-body text-center py-4">
                      <h3 className="font-bold text-lg mb-1">{meta.label}</h3>
                      <p className="text-primary font-medium text-sm">
                        {total ? `${total}+ xe` : "0 xe"}
                      </p>
                    </div>
                  </button>
                );
              })}
        </div>
      </FadeSection>

      {/* CTA SECTION */}
      <FadeSection className="section py-12">
        <div className="card bg-gradient-to-br from-accent/10 to-primary/5">
          <div className="card-body text-center py-16">
            <h2 className="text-3xl font-bold mb-3">1000+ xe và hơn thế nữa</h2>
            <p className="text-xl text-primary font-semibold mb-2">
              Hãy trải nghiệm hôm nay!
            </p>
            <p className="text-[var(--color-muted)] mb-6 max-w-2xl mx-auto">
              Với hơn 1000 xe đa dạng từ phổ thông đến cao cấp, chúng tôi cam
              kết mang đến trải nghiệm thuê xe tốt nhất cho bạn.
            </p>
            <Link to="/search" className="btn btn-primary">
              Tìm xe
            </Link>
          </div>
        </div>
      </FadeSection>

      {/* STEPS SECTION */}
      <FadeSection className="relative py-16 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=400&fit=crop"
          alt="Steps background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 section">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            3 bước đặt xe dễ dàng
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, idx) => (
              <div key={idx} className="text-center text-white">
                <div className="text-6xl mb-4">{step.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-white/80">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* TESTIMONIALS */}
      <FadeSection className="section py-12">
        <h2 className="text-2xl font-bold text-center mb-8">
          Đánh giá khách hàng
        </h2>

        {testimonialsErr && (
          <p className="text-center text-sm text-[var(--color-danger)] mb-4">
            {testimonialsErr}
          </p>
        )}

        {loadingTestimonials && !testimonials.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="card animate-pulse hover:shadow-lg transition-shadow"
              >
                <div className="card-body">
                  <div className="h-4 w-24 bg-[var(--color-surface)] rounded mb-3" />
                  <div className="h-10 w-full bg-[var(--color-surface)] rounded mb-4" />
                  <div className="flex items-center gap-3 pt-3 border-t border-[var(--color-border)]">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-surface)]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-24 bg-[var(--color-surface)] rounded" />
                      <div className="h-3 w-16 bg-[var(--color-surface)] rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {testimonials.length ? (
              testimonials.map((t) => {
                const id = t._id || t.id;
                const rating = t.rating || t.stars || 5;
                const name = t.user?.name || t.userName || "Khách hàng ẩn danh";
                const avatar =
                  t.user?.avatarUrl ||
                  t.user?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    name
                  )}`;
                const text = t.comment || t.text || "";
                const date = t.createdAt
                  ? new Date(t.createdAt).toLocaleDateString("vi-VN")
                  : t.date || "";

                return (
                  <div
                    key={id}
                    className="card hover:shadow-lg transition-shadow"
                  >
                    <div className="card-body">
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: rating }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className="text-warning"
                            fill="currentColor"
                          />
                        ))}
                      </div>
                      <p className="text-sm text-[var(--color-muted)] mb-4 line-clamp-3">
                        {text}
                      </p>
                      <div className="flex items-center gap-3 pt-3 border-t border-[var(--color-border)]">
                        <img
                          src={avatar}
                          alt={name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">
                            {name}
                          </p>
                          {date && (
                            <p className="text-xs text-[var(--color-muted)]">
                              {date}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="col-span-full text-center text-sm text-[var(--color-muted)]">
                Hiện chưa có đánh giá nào.
              </p>
            )}
          </div>
        )}
      </FadeSection>

      {/* FAQ */}
      <FadeSection className="section py-12 bg-[var(--color-surface)]">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl font-bold mb-3 text-white">
              Câu hỏi thường gặp
            </h2>
            <p className="text-[var(--color-muted)]">
              Một số thắc mắc phổ biến khi thuê xe tự lái. Nếu bạn vẫn cần hỗ
              trợ, hãy liên hệ chúng tôi qua chat hoặc hotline bên dưới.
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((q, idx) => (
              <div
                key={idx}
                className="card hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="card-body flex gap-3 items-start">
                  <div className="mt-1 text-primary font-semibold">
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </div>
                  <p className="font-medium">{q}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* FLOATING ACTION BUTTONS */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <a
          href={ZALO_LINK}
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 bg-accent rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-bounce"
        >
          <img src="/logo/zalo1.svg" className="w-7 h-7 object-contain" />
        </a>

        <a
          href={`tel:${SUPPORT_PHONE}`}
          className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-bounce"
        >
          <Phone size={24} className="text-white" />
        </a>
      </div>

      {/* OWNER MODAL */}
      <Modal open={showOwnerModal} onClose={() => setShowOwnerModal(false)}>
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Bạn đã trở thành chủ xe!</h2>
          <p className="mb-4">
            Chúc mừng, bạn đã có thể quản lý xe và đăng xe cho thuê trên hệ
            thống.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowOwnerModal(false);
              nav("/owner/dashboard");
            }}
          >
            Vào trang chủ xe
          </button>
        </div>
      </Modal>
    </div>
  );
}
