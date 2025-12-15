import {
  MapPin,
  Shield,
  CreditCard,
  Headphones,
  ChevronRight,
} from "lucide-react";
import { CITY_OPTIONS, HERO_SLIDES } from "../homeConstants";

export const HeroSection = ({
  activeSlide,
  setActiveSlide,
  pickupLocation,
  setPickupLocation,
  pickupDate,
  setPickupDate,
  pickupTime,
  setPickupTime,
  returnDate,
  setReturnDate,
  returnTime,
  setReturnTime,
  canSearch,
  onSearch,
  onRegisterCar,
}) => {
  return (
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
              Đặt xe trong vài phút, nhận xe nhanh tại các địa điểm gần bạn. Giá
              rõ ràng, bảo hiểm đầy đủ, hỗ trợ 24/7.
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
                onClick={onRegisterCar}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-white/10 hover:bg-white/15 backdrop-blur font-medium"
              >
                Trở thành chủ xe
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Form tìm xe */}
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

      {/* Dots */}
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
  );
};
