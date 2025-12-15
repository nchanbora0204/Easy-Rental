import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Car, MapPin, User, ChevronRight } from "lucide-react";
import api from "../../lib/axios";
import {
  CAR_BRANDS,
  CITY_OPTIONS,
  FUEL_OPTIONS,
  SEATS_OPTIONS,
  TRANSMISSION_OPTIONS,
} from "../constants";
import { Field } from "./Field";

export const RegistrationForm = ({ user, formData, setFormData }) => {
  const nav = useNavigate();
  const [sp, setSp] = useSearchParams();

  const setField = (key) => (e) => {
    const value = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const openAuth = (tab) => {
    const next = new URLSearchParams(sp);
    next.set("auth", tab);
    setSp(next, { replace: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      openAuth("register");
      return;
    }

    try {
      await api.post("/leads/consign-car", {
        ...formData,
        source: "register-car-landing",
      });
    } catch {
      // ignore
    }

    nav("/register-car/start");
  };

  return (
    <section id="register-form" className="section py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Kiếm thu nhập thụ động dễ dàng cùng EasyRental!
          </h2>
          <p className="text-[var(--color-muted)]">
            Điền thông tin bên dưới để bắt đầu cho thuê xe
          </p>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Cá nhân */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <User size={20} className="text-primary" /> Thông tin cá nhân
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Họ và tên *">
                    <input
                      className="input"
                      required
                      placeholder="Nguyễn Văn A"
                      value={formData.fullName}
                      onChange={setField("fullName")}
                    />
                  </Field>

                  <Field label="Số điện thoại *">
                    <input
                      className="input"
                      required
                      placeholder="0912345678"
                      value={formData.phone}
                      onChange={setField("phone")}
                    />
                  </Field>

                  <div className="md:col-span-2">
                    <Field label="Email *">
                      <input
                        type="email"
                        className="input"
                        required
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={setField("email")}
                      />
                    </Field>
                  </div>
                </div>
              </div>

              {/* Địa chỉ */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-primary" /> Địa chỉ
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Thành phố *">
                    <select className="select" required value={formData.city} onChange={setField("city")}>
                      <option value="">Chọn thành phố</option>
                      {CITY_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Quận/Huyện *">
                    <input
                      className="input"
                      required
                      placeholder="Quận 1"
                      value={formData.district}
                      onChange={setField("district")}
                    />
                  </Field>

                  <div className="md:col-span-2">
                    <Field label="Địa chỉ cụ thể">
                      <input
                        className="input"
                        placeholder="Số nhà, tên đường..."
                        value={formData.address}
                        onChange={setField("address")}
                      />
                    </Field>
                  </div>
                </div>
              </div>

              {/* Xe */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Car size={20} className="text-primary" /> Thông tin xe
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Hãng xe *">
                    <select className="select" required value={formData.carBrand} onChange={setField("carBrand")}>
                      <option value="">Chọn hãng</option>
                      {CAR_BRANDS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Dòng xe *">
                    <input
                      className="input"
                      required
                      placeholder="Vios, City, Mazda 3..."
                      value={formData.carModel}
                      onChange={setField("carModel")}
                    />
                  </Field>

                  <Field label="Năm sản xuất *">
                    <input
                      type="number"
                      className="input"
                      required
                      min={1995}
                      max={new Date().getFullYear()}
                      placeholder="2020"
                      value={formData.year}
                      onChange={setField("year")}
                    />
                  </Field>

                  <Field label="Biển số xe *">
                    <input
                      className="input"
                      required
                      placeholder="51A-12345"
                      value={formData.licensePlate}
                      onChange={setField("licensePlate")}
                    />
                  </Field>

                  <Field label="Số chỗ ngồi *">
                    <select className="select" required value={formData.seats} onChange={setField("seats")}>
                      <option value="">Chọn số chỗ</option>
                      {SEATS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Hộp số *">
                    <select className="select" required value={formData.transmission} onChange={setField("transmission")}>
                      <option value="">Chọn hộp số</option>
                      {TRANSMISSION_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Nhiên liệu *">
                    <select className="select" required value={formData.fuel} onChange={setField("fuel")}>
                      <option value="">Chọn nhiên liệu</option>
                      {FUEL_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Giá thuê (đ/ngày) *">
                    <input
                      type="number"
                      className="input"
                      required
                      min={100000}
                      step={50000}
                      placeholder="500000"
                      value={formData.pricePerDay}
                      onChange={setField("pricePerDay")}
                    />
                  </Field>
                </div>
              </div>

              {/* Ghi chú */}
              <div>
                <Field label="Ghi chú thêm">
                  <textarea
                    className="textarea"
                    rows={4}
                    placeholder="Mô tả thêm về xe, tình trạng xe, yêu cầu đặc biệt..."
                    value={formData.notes}
                    onChange={setField("notes")}
                  />
                </Field>
              </div>

              {/* Điều khoản */}
              <div className="flex items-start gap-3 p-4 bg-[var(--color-bg)] rounded-[var(--radius-md)]">
                <input
                  type="checkbox"
                  required
                  checked={formData.agreeTerms}
                  onChange={setField("agreeTerms")}
                  className="mt-1"
                />
                <div className="text-sm">
                  Tôi đồng ý với{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Điều khoản dịch vụ
                  </Link>
                  ,{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Chính sách bảo mật
                  </Link>{" "}
                  và{" "}
                  <Link to="/owner-policy" className="text-primary hover:underline">
                    Chính sách cho chủ xe
                  </Link>
                  .
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full text-lg py-3">
                Đăng ký ngay <ChevronRight size={20} />
              </button>

              {!user && (
                <div className="text-xs text-[var(--color-muted)] text-center">
                  Bạn chưa đăng nhập — bấm đăng ký sẽ mở form tạo tài khoản.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
