import { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import api from "../../lib/axios";
import { iso, fmtVND, daysBetween, formatLocation } from "../../utils/format";
import { useCarDetailData } from "../../hooks/useCarDetailData";

import { CarBreadcrumb } from "./components/CarBreadcrumb";
import { CarHeader } from "./components/CarHeader";
import { CarDetailSkeleton } from "./components/CarDetailSkeleton";
import { CarErrorBlock } from "./components/CarErrorBlock";
import { CancellationPolicy } from "./components/CancellationPolicy";

import { CarGallery } from "./components/CarGallery";
import { CarSpecs } from "./components/CarSpecs";
import { CarFeatures } from "./components/CarFeatures";
import { CarLocation } from "./components/CarLocation";
import { CarTerms } from "./components/CarTerms";
import { CarReviews } from "./components/CarReviews";
import { CarBookingSidebar } from "./components/CarBookingSidebar";
import { CarRelated } from "./components/CarRelated";

const INSURANCE_OPTIONS = [
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

const DOOR_FEE = 70000;

const CarDetail = () => {
  const { carId } = useParams();
  const nav = useNavigate();
  const location = useLocation();
  const stateCar = location.state?.car || null;
  const [sp] = useSearchParams();

  const [pickupDate, setPickupDate] = useState(sp.get("pickup") || "");
  const [pickupTime, setPickupTime] = useState(sp.get("pickupTime") || "");
  const [returnDate, setReturnDate] = useState(sp.get("return") || "");
  const [returnTime, setReturnTime] = useState(sp.get("returnTime") || "");

  const { car, related, reviews, reviewTotal, loading, err, setErr } =
    useCarDetailData(carId, stateCar);

  const [isFavorite, setIsFavorite] = useState(false);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState(null);

  const [insKey, setInsKey] = useState("none");
  const [doorToDoor, setDoorToDoor] = useState(false);

  const [coupon, setCoupon] = useState("");
  const [couponOff, setCouponOff] = useState(0);

  useEffect(() => {
    setAvailable(null);
  }, [pickupDate, returnDate]);

  const canCheck = useMemo(
    () => !!pickupDate && !!returnDate,
    [pickupDate, returnDate]
  );

  const days = useMemo(
    () => daysBetween(pickupDate, returnDate),
    [pickupDate, returnDate]
  );

  const pricing = useMemo(() => {
    const base = Number(car?.pricePerDay || 0);
    const baseTotal = days * base;

    const insDaily =
      INSURANCE_OPTIONS.find((x) => x.key === insKey)?.daily || 0;
    const insTotal = days * insDaily;

    const deliveryTotal = doorToDoor ? DOOR_FEE * 2 : 0;

    const subTotal = baseTotal + insTotal + deliveryTotal;
    const vat = Math.round(subTotal * 0.1);
    const deposit = Number(car?.deposit || 3000000);

    const discount = Math.min(couponOff, subTotal);
    const grand = Math.max(0, subTotal + vat - discount);

    return {
      days,
      base,
      baseTotal,
      insuranceKey: insKey,
      insuranceDaily: insDaily,
      insuranceTotal: insTotal,
      doorToDoor,
      doorFee: DOOR_FEE,
      deliveryTotal,
      subTotal,
      vat,
      discount,
      total: grand,
      deposit,
    };
  }, [
    car?._id,
    car?.pricePerDay,
    car?.deposit,
    days,
    insKey,
    doorToDoor,
    couponOff,
  ]);

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

  const buildBookingQuery = () => {
    const q = new URLSearchParams();
    if (pickupDate) q.set("pickup", pickupDate);
    if (pickupTime) q.set("pickupTime", pickupTime);
    if (returnDate) q.set("return", returnDate);
    if (returnTime) q.set("returnTime", returnTime);
    if (insKey && insKey !== "none") q.set("insKey", insKey);
    if (doorToDoor) q.set("door", "1");
    return q.toString();
  };

  const onBook = () => {
    if (!car?._id) return;

    nav(`/book/${car._id}?${buildBookingQuery()}`, {
      state: {
        pricing: {
          days: pricing.days,
          basePrice: pricing.base,
          baseTotal: pricing.baseTotal,
          insuranceKey: pricing.insuranceKey,
          insuranceDaily: pricing.insuranceDaily,
          insuranceTotal: pricing.insuranceTotal,
          doorToDoor: pricing.doorToDoor,
          doorFee: pricing.doorFee,
          deliveryTotal: pricing.deliveryTotal,
          subTotal: pricing.subTotal,
          vat: pricing.vat,
          total: pricing.total,
        },
      },
    });
  };

  if (loading) return <CarDetailSkeleton />;
  if (err) return <CarErrorBlock err={err} />;
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
    reviewTotal || car.reviewCount || car.totalReviews || reviews?.length || 0;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <CarBreadcrumb name={name} />

      <div className="section py-8 space-y-6">
        <CarHeader
          name={name}
          loc={loc}
          car={car}
          reviewCountHeader={reviewCountHeader}
          isFavorite={isFavorite}
          onToggleFavorite={() => setIsFavorite((v) => !v)}
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
              reviews={reviews || []}
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
            setPickup={setPickupDate}
            setPickupTime={setPickupTime}
            setReturnD={setReturnDate}
            setReturnTime={setReturnTime}
            canCheck={canCheck}
            checking={checking}
            checkAvailable={checkAvailable}
            available={available}
            insuranceOptions={INSURANCE_OPTIONS}
            insKey={insKey}
            setInsKey={setInsKey}
            doorToDoor={doorToDoor}
            setDoorToDoor={setDoorToDoor}
            doorFee={DOOR_FEE}
            coupon={coupon}
            setCoupon={setCoupon}
            applyCoupon={applyCoupon}
            couponOff={couponOff}
            base={pricing.base}
            d={pricing.days}
            baseTotal={pricing.baseTotal}
            insTotal={pricing.insuranceTotal}
            deliveryTotal={pricing.deliveryTotal}
            discount={pricing.discount}
            vat={pricing.vat}
            grand={pricing.total}
            deposit={pricing.deposit}
            onBook={onBook}
          />
        </div>

        <CarRelated related={related} brand={car.brand} />
      </div>
    </div>
  );
};

export default CarDetail;
