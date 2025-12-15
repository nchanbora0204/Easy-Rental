import { useEffect, useMemo, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import api from "../../lib/axios";
import { daysBetween, fmtVND, iso, formatLocation } from "../../utils/format";

import { BookingHeader } from "./components/BookingHeader";
import { BookingSteps } from "./components/BookingSteps";
import { BookingSkeleton } from "./components/BookingSkeleton";
import { BookingErrorBlock } from "./components/BookingErrorBlock";
import { CarInfoCard } from "./components/CarInfoCard";
import { CustomerForm } from "./components/CustomerForm";
import { PaymentOptions } from "./components/PaymentOptions";
import { TermsAgreement } from "./components/TermsAgreement";
import { PriceSummary } from "./components/PriceSummary";

const INSURANCE_OPTIONS = [
  { key: "none", label: "Không mua bảo hiểm", daily: 0 },
  { key: "basic", label: "Bảo hiểm cơ bản", daily: 50000 },
  { key: "plus", label: "Bảo hiểm toàn diện", daily: 120000 },
];

const DOOR_FEE = 70000;

const BookCar = () => {
  const { carId } = useParams();
  const nav = useNavigate();
  const location = useLocation();
  const [sp] = useSearchParams();

  const pricingFromState = location.state?.pricing || {};

  const [pickupDate, setPickupDate] = useState(sp.get("pickup") || "");
  const [pickupTime, setPickupTime] = useState(sp.get("pickupTime") || "");
  const [returnDate, setReturnDate] = useState(sp.get("return") || "");
  const [returnTime, setReturnTime] = useState(sp.get("returnTime") || "");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [wantInvoice, setWantInvoice] = useState(false);
  const [payOption, setPayOption] = useState("deposit");
  const [creating, setCreating] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const { data } = await api.get(`/cars/${carId}`);
        const c = data?.data || data;
        if (alive) setCar(c);
      } catch (e) {
        if (alive) {
          setErr(
            e?.response?.data?.message ||
              e.message ||
              "Không tải được thông tin xe"
          );
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [carId]);

  const days = useMemo(
    () => daysBetween(pickupDate, returnDate),
    [pickupDate, returnDate]
  );

  const pricePerDay = useMemo(
    () => Number(car?.pricePerDay || 0),
    [car?.pricePerDay]
  );

  const insKey = useMemo(
    () => sp.get("insKey") || pricingFromState.insuranceKey || "none",
    [sp, pricingFromState.insuranceKey]
  );

  const doorSelected = useMemo(
    () => sp.get("door") === "1" || Boolean(pricingFromState.doorToDoor),
    [sp, pricingFromState.doorToDoor]
  );

  const insuranceDaily = useMemo(
    () => INSURANCE_OPTIONS.find((x) => x.key === insKey)?.daily || 0,
    [insKey]
  );

  const insuranceTotal = useMemo(
    () => days * insuranceDaily,
    [days, insuranceDaily]
  );

  const baseTotal = useMemo(() => days * pricePerDay, [days, pricePerDay]);

  const deliveryTotal = useMemo(
    () => (doorSelected ? DOOR_FEE * 2 : 0),
    [doorSelected]
  );

  const discount = useMemo(
    () => Number(pricingFromState.discount || 0),
    [pricingFromState.discount]
  );

  const rentTotal = useMemo(
    () => baseTotal + insuranceTotal + deliveryTotal,
    [baseTotal, insuranceTotal, deliveryTotal]
  );

  const vat = useMemo(() => {
    const taxable = Math.max(0, rentTotal - discount);
    return Math.round(taxable * 0.1);
  }, [rentTotal, discount]);

  const subtotal = useMemo(
    () => Math.max(0, rentTotal - discount + vat),
    [rentTotal, discount, vat]
  );

  const deposit = useMemo(() => Number(car?.deposit || 500000), [car?.deposit]);

  const payOnPickup = useMemo(
    () => Math.max(0, subtotal - deposit),
    [subtotal, deposit]
  );

  const canSubmit = useMemo(() => {
    return (
      !!car &&
      days > 0 &&
      !!pickupDate &&
      !!returnDate &&
      fullName.trim().length > 0 &&
      phone.trim().length > 0 &&
      agreeTerms
    );
  }, [car, days, pickupDate, returnDate, fullName, phone, agreeTerms]);

  const handleCreate = async () => {
    if (!canSubmit || creating) return;

    setCreating(true);
    try {
      const payload = {
        car: carId,
        pickupDate: iso(pickupDate),
        returnDate: iso(returnDate),
        customerInfo: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
        },
        notes: notes.trim(),
        paymentOption: payOption,
        wantInvoice,
        extras: {
          insuranceKey: insKey,
          insuranceDaily,
          insuranceTotal,
          doorToDoor: doorSelected,
          doorFee: DOOR_FEE,
          deliveryTotal,
        },
        pricing: {
          days,
          basePrice: pricePerDay,
          baseTotal,
          discount,
          vat,
        },
      };

      const { data } = await api.post("/bookings", payload);
      const booking = data?.data;

      if (!booking?._id) throw new Error("Tạo booking thất bại");
      nav(`/pay/${booking._id}`);
    } catch (e) {
      setErr(
        e?.response?.data?.message ||
          (e?.response?.data?.errors &&
            e.response.data.errors.map((x) => x.msg).join(", ")) ||
          e.message ||
          "Không tạo được đơn"
      );
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <BookingSkeleton />;
  if (err && !car) return <BookingErrorBlock err={err} />;
  if (!car) return null;

  const carName =
    `${car.brand || ""} ${car.model || ""}`.trim() || car.name || "Xe tự lái";

  const image =
    car.images?.[0] ||
    car.image ||
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800";

  const loc = formatLocation(car);

  const steps = [
    { num: 1, label: "Tìm & chọn xe", active: false, done: true },
    { num: 2, label: "Xác nhận đơn hàng", active: true, done: false },
    { num: 3, label: "Thanh toán", active: false, done: false },
    { num: 4, label: "Nhận xe", active: false, done: false },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <BookingHeader />

      <div className="section py-8 space-y-6">
        <BookingSteps steps={steps} />

        {err ? <BookingErrorBlock err={err} compact /> : null}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CarInfoCard
              name={carName}
              image={image}
              loc={loc}
              pickupDate={pickupDate}
              pickupTime={pickupTime}
              returnDate={returnDate}
              returnTime={returnTime}
              days={days}
            />

            <CustomerForm
              fullName={fullName}
              setFullName={setFullName}
              phone={phone}
              setPhone={setPhone}
              email={email}
              setEmail={setEmail}
              notes={notes}
              setNotes={setNotes}
            />

            <PaymentOptions
              payOption={payOption}
              setPayOption={setPayOption}
              deposit={deposit}
              subtotal={subtotal}
              wantInvoice={wantInvoice}
              setWantInvoice={setWantInvoice}
              payOnPickup={payOnPickup}
            />

            <TermsAgreement
              agreeTerms={agreeTerms}
              setAgreeTerms={setAgreeTerms}
            />
          </div>

          <PriceSummary
            pricePerDay={pricePerDay}
            days={days}
            baseTotal={baseTotal}
            insuranceTotal={insuranceTotal}
            deliveryTotal={deliveryTotal}
            discount={discount}
            vat={vat}
            subtotal={subtotal}
            payOption={payOption}
            deposit={deposit}
            payOnPickup={payOnPickup}
            canSubmit={canSubmit}
            creating={creating}
            onSubmit={handleCreate}
            hint={
              !fullName.trim() || !phone.trim()
                ? "Vui lòng điền đầy đủ thông tin"
                : !agreeTerms
                ? "Vui lòng đồng ý với điều khoản"
                : "Vui lòng chọn ngày nhận/trả hợp lệ"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default BookCar;
