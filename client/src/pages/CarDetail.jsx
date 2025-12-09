import { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
  Link,
  useLocation,
} from "react-router-dom";
import {
  MapPin,
  Share2,
  Star,
  TrendingUp,
  Award,
  AlertCircle,
  Info,
  Heart,
} from "lucide-react";

import { fmtVND, iso, daysBetween, formatLocation } from "../utils/format";
import { useCarDetailData } from "../hooks/useCarDetailData";
import CarGallery from "../components/car/CarGallery";
import CarSpecs from "../components/car/CarSpecs";
import CarFeatures from "../components/car/CarFeatures";
import CarLocation from "../components/car/CarLocation";
import CarTerms from "../components/car/CarTerms";
import CarReviews from "../components/car/CarReviews";
import CarBookingSidebar from "../components/car/CarBookingSidebar";
import CarRelated from "../components/car/CarRelated";
import api from "../lib/axios";

export default function CarDetail() {
  const { carId } = useParams();
  const nav = useNavigate();
  const location = useLocation();
  const stateCar = location.state?.car || null;
  const [sp] = useSearchParams();

  const [pickupDate, setPickup] = useState(sp.get("pickup") || "");
  const [pickupTime, setPickupTime] = useState(sp.get("pickupTime") || "");
  const [returnDate, setReturnD] = useState(sp.get("return") || "");
  const [returnTime, setReturnTime] = useState(sp.get("returnTime") || "");

  const { car, related, reviews, reviewTotal, loading, err, setErr } =
    useCarDetailData(carId, stateCar);

  const [isFavorite, setIsFavorite] = useState(false);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState(null);

  const insuranceOptions = [
    {
      key: "none",
      label: "Không mua bảo hiểm",
      daily: 0,
      desc: "Chủ xe tự bảo hiểm",
    },
    {
      key: "basic",
      label: "Bảo hiểm cơ bản",
      daily: 50000,
      desc: "Bồi thường tối đa 5 triệu",
    },
    {
      key: "plus",
      label: "Bảo hiểm mở rộng",
      daily: 120000,
      desc: "Bồi thường tối đa 10 triệu",
    },
  ];
  const [insKey, setInsKey] = useState("none");
  const [doorToDoor, setDoorToDoor] = useState(false);
  const doorFee = 70000;
  const [coupon, setCoupon] = useState("");
  const [couponOff, setCouponOff] = useState(0);

  useEffect(() => {
    setAvailable(null);
  }, [pickupDate, returnDate]);

  const d = daysBetween(pickupDate, returnDate);
  const base = Number(car?.pricePerDay || 0);
  const baseTotal = d * base;
  const insDaily = insuranceOptions.find((x) => x.key === insKey)?.daily || 0;
  const insTotal = d * insDaily;
  const deliveryTotal = doorToDoor ? doorFee * 2 : 0;
  const subTotal = baseTotal + insTotal + deliveryTotal;
  const vat = Math.round(subTotal * 0.1);
  const deposit = Number(car?.deposit || 3000000);
  const discount = Math.min(couponOff, subTotal);
  const grand = Math.max(0, subTotal + vat - discount);

  const canCheck = useMemo(
    () => !!pickupDate && !!returnDate,
    [pickupDate, returnDate]
  );

  const checkAvailable = async () => {
    if (!car?._id || !canCheck) return;
    setChecking(true);
    try {
      const { data } = await api.get("/bookings/check-availability", {
        params: {
          carId: car._id,
          pickupDate: iso(pickupDate),
          returnDate: iso(returnDate),
        },
      });
      setAvailable(!!data?.data?.available);
    } catch (e) {
      setAvailable(null);
      setErr(
        e?.response?.data?.message || e.message || "Lỗi kiểm tra khả dụng"
      );
    } finally {
      setChecking(false);
    }
  };

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "BONFLASH") setCouponOff(200000);
    else setCouponOff(0);
  };

  const onBook = () => {
    const q = new URLSearchParams();
    if (pickupDate) q.set("pickup", pickupDate);
    if (pickupTime) q.set("pickupTime", pickupTime);
    if (returnDate) q.set("return", returnDate);
    if (returnTime) q.set("returnTime", returnTime);
    if (insKey && insKey !== "none") q.set("insKey", insKey);
    if (doorToDoor) q.set("door", "1");

    nav(`/book/${car._id}?${q.toString()}`, {
      state: {
        pricing: {
          days: d,
          basePrice: base,
          baseTotal,
          insuranceKey: insKey,
          insuranceDaily: insDaily,
          insuranceTotal: insTotal,
          doorToDoor,
          doorFee,
          deliveryTotal,
          subTotal,
          vat,
          total: grand,
        },
      },
    });
  };

  if (loading) return <LoadingSkeleton />;
  if (err) return <ErrorBlock err={err} />;
  if (!car) return null;

  const name =
    `${car.brand || ""} ${car.model || ""}`.trim() || car.name || "Xe tự lái";
  const images = car.images?.length ? car.images : [car.image].filter(Boolean);
  const loc = formatLocation(car);
  const seatsLabel = car.seatingCapacity
    ? `${car.seatingCapacity} chỗ`
    : "Đang cập nhật";
  const transmissionLabel =
    car.transmission === "automatic"
      ? "Số tự động"
      : car.transmission === "manual"
      ? "Số sàn"
      : "Đang cập nhật";
  const fuelLabel =
    car.fuelType === "gasoline"
      ? "Xăng"
      : car.fuelType === "diesel"
      ? "Dầu"
      : car.fuelType === "electric"
      ? "Điện"
      : "Đang cập nhật";
  const consumptionLabel = car.fuelConsumption || "9L/100km";
  const reviewCountHeader =
    reviewTotal || car.reviewCount || car.totalReviews || reviews.length || 0;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Breadcrumb name={name} />
      <div className="section py-8 space-y-6">
        <Header
          name={name}
          loc={loc}
          car={car}
          reviewCountHeader={reviewCountHeader}
          isFavorite={isFavorite}
          setIsFavorite={setIsFavorite}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CarGallery name={name} images={images} />
            <CarSpecs
              seatsLabel={seatsLabel}
              transmissionLabel={transmissionLabel}
              fuelLabel={fuelLabel}
              consumptionLabel={consumptionLabel}
            />
            {car.description && (
              <div className="card">
                <div className="card-body">
                  <h3 className="font-semibold text-lg mb-3">Mô tả xe</h3>
                  <p className="text-[var(--color-muted)] leading-relaxed whitespace-pre-line">
                    {car.description}
                  </p>
                </div>
              </div>
            )}
            <CarFeatures features={car.features} />
            <CarLocation loc={loc} />
            <CarTerms />
            <CarReviews
              reviews={reviews}
              reviewCountHeader={reviewCountHeader}
            />
            <CancellationPolicy />
          </div>

          <CarBookingSidebar
            car={car}
            pickupDate={pickupDate}
            pickupTime={pickupTime}
            returnDate={returnDate}
            returnTime={returnTime}
            setPickup={setPickup}
            setPickupTime={setPickupTime}
            setReturnD={setReturnD}
            setReturnTime={setReturnTime}
            canCheck={canCheck}
            checking={checking}
            checkAvailable={checkAvailable}
            available={available}
            insuranceOptions={insuranceOptions}
            insKey={insKey}
            setInsKey={setInsKey}
            doorToDoor={doorToDoor}
            setDoorToDoor={setDoorToDoor}
            doorFee={doorFee}
            coupon={coupon}
            setCoupon={setCoupon}
            applyCoupon={applyCoupon}
            couponOff={couponOff}
            base={base}
            d={d}
            baseTotal={baseTotal}
            insTotal={insTotal}
            deliveryTotal={deliveryTotal}
            discount={discount}
            vat={vat}
            grand={grand}
            deposit={deposit}
            onBook={onBook}
          />
        </div>

        <CarRelated related={related} brand={car.brand} />
      </div>
    </div>
  );
}

//helper component
function Breadcrumb({ name }) {
  return (
    <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      <div className="section py-3">
        <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
          <Link to="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <Chevron />
          <Link to="/search" className="hover:text-primary transition-colors">
            Tìm xe
          </Link>
          <Chevron />
          <span className="text-[var(--color-fg)]">{name}</span>
        </div>
      </div>
    </div>
  );
}
function Chevron() {
  return <span className="text-[var(--color-muted)]">›</span>;
}

function Header({
  name,
  loc,
  car,
  reviewCountHeader,
  isFavorite,
  setIsFavorite,
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">{name}</h1>
          {car.featured && (
            <span className="badge badge-warning flex items-center gap-1">
              <TrendingUp size={14} />
              Nổi bật
            </span>
          )}
        </div>
        {(loc || car.avgRating || car.trips) && (
          <div className="flex flex-wrap items-center gap-4 text-[var(--color-muted)]">
            {loc && (
              <span className="flex items-center gap-1.5">
                <MapPin size={16} className="text-primary" />
                {loc}
              </span>
            )}
            {(car.avgRating || reviewCountHeader) && (
              <span className="flex items-center gap-1.5">
                <Star size={16} className="text-warning" fill="currentColor" />
                {car.avgRating && (
                  <span className="font-semibold text-[var(--color-fg)]">
                    {car.avgRating.toFixed
                      ? car.avgRating.toFixed(1)
                      : car.avgRating}
                  </span>
                )}
                <span className="text-sm">({reviewCountHeader} đánh giá)</span>
              </span>
            )}
            {car.trips && (
              <span className="flex items-center gap-1.5">
                <Award size={16} className="text-accent" />
                {car.trips} chuyến
              </span>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className={`btn ${isFavorite ? "btn-primary" : "btn-ghost"}`}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
        <button className="btn btn-ghost">
          <Share2 size={18} />
          Chia sẻ
        </button>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="section py-8">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card animate-pulse">
            <div className="h-96 bg-[var(--color-surface)]" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-[var(--color-surface)] rounded-[var(--radius-md)]"
              />
            ))}
          </div>
        </div>
        <div className="card animate-pulse h-[600px]" />
      </div>
    </div>
  );
}

function ErrorBlock({ err }) {
  return (
    <div className="section py-8">
      <div className="card bg-red-50 border-red-200">
        <div className="card-body flex items-center gap-3 text-danger">
          <AlertCircle size={24} />
          <span>{err}</span>
        </div>
      </div>
    </div>
  );
}

function CancellationPolicy() {
  return (
    <div className="card">
      <div className="card-body">
        <h3 className="font-semibold text-lg mb-4">Chính sách hủy chuyến</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left py-3 px-2 font-semibold">
                  Thời gian hủy
                </th>
                <th className="text-left py-3 px-2 font-semibold">Hoàn tiền</th>
                <th className="text-left py-3 px-2 font-semibold">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="text-[var(--color-muted)]">
              <tr className="border-b border-[var(--color-border)]">
                <td className="py-3 px-2">≥ 10 ngày trước chuyến</td>
                <td className="py-3 px-2">
                  <span className="badge badge-success">100%</span>
                </td>
                <td className="py-3 px-2">Hoàn toàn bộ</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="py-3 px-2">6-9 ngày trước chuyến</td>
                <td className="py-3 px-2">
                  <span className="badge badge-warning">50%</span>
                </td>
                <td className="py-3 px-2">Hoàn một nửa</td>
              </tr>
              <tr>
                <td className="py-3 px-2">{"<"} 5 ngày trước chuyến</td>
                <td className="py-3 px-2">
                  <span className="badge badge-danger">0%</span>
                </td>
                <td className="py-3 px-2">Không hoàn</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
