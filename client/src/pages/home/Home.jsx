import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import { useAuth } from "../../contexts/AuthContext";
import Modal from "../../components/Modal";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { FeaturedCarsSection } from "./components/FeaturedCarsSection";
import { LuxuryCarsSection } from "./components/LuxuryCarsSection";
import { BrandSection } from "./components/BrandSection";
import { CitySection } from "./components/CitySection";
import { CtaSection } from "./components/CtaSection";
import { StepsSection } from "./components/StepsSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { FaqSection } from "./components/FaqSection";
import { FloatingActions } from "./components/FloatingActions";

import {
  findCityMetaByName,
  normalizeCityName,
} from "./homeUtils";

const Home = () => {
  const nav = useNavigate();
  const { user } = useAuth();

  const [showOwnerModal, setShowOwnerModal] = useState(false);

  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
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

  // FEATURED (standard)
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

  // LUXURY / PREMIUM
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

  // TESTIMONIALS
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

  // BRAND STATS
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

  // CITY STATS
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

  const handleSelectBrand = (name) => {
    nav(`/search?brand=${encodeURIComponent(name)}`);
  };

  const handleSelectCity = (slug) => {
    nav(`/search?city=${slug}`);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <HeroSection
        activeSlide={activeSlide}
        setActiveSlide={setActiveSlide}
        pickupLocation={pickupLocation}
        setPickupLocation={setPickupLocation}
        pickupDate={pickupDate}
        setPickupDate={setPickupDate}
        pickupTime={pickupTime}
        setPickupTime={setPickupTime}
        returnDate={returnDate}
        setReturnDate={setReturnDate}
        returnTime={returnTime}
        setReturnTime={setReturnTime}
        canSearch={canSearch}
        onSearch={onSearch}
        onRegisterCar={handleRegisterCar}
      />

      <FeaturesSection />

      <FeaturedCarsSection
        featured={featured}
        loading={loadingFeatured}
        error={apiErr}
        onClickCar={gotoDetail}
      />

      <LuxuryCarsSection
        luxury={luxury}
        loading={loadingLuxury}
        error={luxuryErr}
        onClickCar={gotoDetail}
      />

      <BrandSection
        brandStats={brandStats}
        loading={loadingBrands}
        error={brandErr}
        onSelectBrand={handleSelectBrand}
      />

      <CitySection
        cityStatsMap={cityStatsMap}
        loading={loadingCities}
        error={cityErr}
        hasCityStats={cityStats.length > 0}
        onSelectCity={handleSelectCity}
      />

      <CtaSection />

      <StepsSection />

      <TestimonialsSection
        testimonials={testimonials}
        loading={loadingTestimonials}
        error={testimonialsErr}
      />

      <FaqSection />

      <FloatingActions />

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
};

export default Home;
