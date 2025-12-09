import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../lib/axios";
import {
  Car,
  DollarSign,
  Shield,
  CheckCircle2,
  User,
  MapPin,
  ChevronRight,
  Star,
  Clock,
  Award,
  Users,
  Zap,
} from "lucide-react";

export default function OwnerRegistration() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [sp, setSp] = useSearchParams();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    district: "",
    address: "",
    carBrand: "",
    carModel: "",
    year: "",
    licensePlate: "",
    seats: "",
    transmission: "",
    fuel: "",
    pricePerDay: "",
    notes: "",
    agreeTerms: false,
  });

  // Prefill khi đã đăng nhập
  useEffect(() => {
    if (!user) return;
    setFormData((s) => ({
      ...s,
      fullName: user.name || s.fullName,
      phone: user.phone || s.phone,
      email: user.email || s.email,
      city: user.city || s.city,
    }));
  }, [user]);

  const benefits = [
    {
      icon: DollarSign,
      title: "Kiếm thu nhập thụ động dễ dàng",
      desc: "Cho thuê xe khi không sử dụng, thu nhập 10–15 triệu/tháng",
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      icon: Shield,
      title: "An toàn tuyệt đối – EasyRental lo trọn gói",
      desc: "Bảo hiểm chuyến đi & hỗ trợ 24/7, đối soát minh bạch",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Users,
      title: "Cộng đồng lớn & tin cậy",
      desc: "Hàng chục nghìn chủ xe đang tin dùng",
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      icon: Zap,
      title: "Nhanh chóng & tiện lợi",
      desc: "Đăng ký chỉ ~10 phút, duyệt trong 24h",
      color: "text-warning",
      bg: "bg-warning/10",
    },
  ];

  const steps = [
    {
      step: 1,
      title: "Chuẩn bị xe & giấy tờ cần thiết",
      desc: "Đủ giấy tờ hợp lệ, bảo hiểm còn hạn, tình trạng xe tốt.",
    },
    {
      step: 2,
      title: "Đăng thông tin xe minh bạch",
      desc: "Nhập thông tin, tải ảnh/giấy tờ lên hệ thống.",
    },
    {
      step: 3,
      title: "Nhận thu nhập khi cho thuê",
      desc: "Xe hiển thị cho khách; bắt đầu nhận đơn & doanh thu.",
    },
  ];

  // Mở AuthModal qua query (?auth=register|login)
  const openAuth = (tab) => {
    const next = new URLSearchParams(sp);
    next.set("auth", tab);
    setSp(next, { replace: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Nếu chưa đăng nhập → mở đăng ký (hoặc login nếu bạn muốn)
    if (!user) {
      openAuth("register");
      return;
    }

    // (Tuỳ chọn) gửi lead trước khi vào luồng KYC
    try {
      await api.post("/leads/consign-car", {
        ...formData,
        source: "register-car-landing",
      });
    } catch {
      // không chặn luồng nếu lead fail
    }

    // Sang luồng KYC/đăng xe
    nav("/register-car/start");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* HERO */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&h=800&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        <div className="relative z-10 section py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Cho thuê <span className="whitespace-nowrap">nhẹ nhàng</span>,
              <br />
              thu nhập <span className="whitespace-nowrap">
                thảnh thơi
              </span>{" "}
              cùng
              <br />
              <span className="text-accent">EasyRental</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Biến chiếc xe nhàn rỗi thành thu nhập thụ động
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                ["50K+", "Chủ xe"],
                ["10–15tr", "Thu nhập/tháng"],
                ["24/7", "Hỗ trợ"],
                ["100%", "Bảo hiểm"],
              ].map(([n, t]) => (
                <div key={t} className="text-center">
                  <div className="text-3xl font-bold text-accent mb-1">{n}</div>
                  <div className="text-sm text-gray-200">{t}</div>
                </div>
              ))}
            </div>

            <a
              href="#register-form"
              className="btn bg-accent text-white hover:bg-accent/90 text-lg px-8 inline-flex items-center gap-2"
            >
              Đăng ký ngay <ChevronRight size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* 3 BƯỚC */}
      <section className="section py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Cho thuê 3 bước siêu dễ – chỉ 10 phút
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                {s.step}
              </div>
              <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-[var(--color-muted)]">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LỢI ÍCH */}
      <section className="section py-16 bg-[var(--color-surface)]">
        <h2 className="text-3xl font-bold text-center mb-4">
          An tâm tuyệt đối – EasyRental lo trọn gói
        </h2>
        <p className="text-center text-[var(--color-muted)] mb-12 max-w-3xl mx-auto">
          Hàng chục nghìn chủ xe cho thuê thành công mỗi ngày trên hệ thống.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="card hover:shadow-lg transition-shadow text-center"
            >
              <div className="card-body">
                <div
                  className={`w-16 h-16 ${b.bg} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <b.icon size={32} className={b.color} />
                </div>
                <h3 className="font-semibold mb-2">{b.title}</h3>
                <p className="text-sm text-[var(--color-muted)]">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ĐÁNH GIÁ */}
      <section className="section py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Chủ xe nói gì về EasyRental
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              name: "Anh Minh",
              car: "Toyota Vios 2022",
              rating: 5,
              text: "Thu nhập ổn định 12–15 triệu/tháng. Quy trình đơn giản, hỗ trợ nhiệt tình.",
              avatar: "https://i.pravatar.cc/150?img=12",
            },
            {
              name: "Chị Hương",
              car: "Honda City 2021",
              rating: 5,
              text: "An tâm vì có bảo hiểm & xác minh khách chặt chẽ.",
              avatar: "https://i.pravatar.cc/150?img=45",
            },
            {
              name: "Anh Tuấn",
              car: "Mazda 3 2020",
              rating: 5,
              text: "Đăng ký dễ, thanh toán nhanh. Xe được khách giữ gìn.",
              avatar: "https://i.pravatar.cc/150?img=33",
            },
          ].map((r, idx) => (
            <div key={idx} className="card hover:shadow-lg transition-shadow">
              <div className="card-body">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-warning"
                      fill="currentColor"
                    />
                  ))}
                </div>
                <p className="text-[var(--color-muted)] mb-4 text-sm">
                  {r.text}
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-[var(--color-border)]">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-sm text-[var(--color-muted)]">{r.car}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BẢNG SO SÁNH */}
      <section className="section py-16 bg-[var(--color-surface)]">
        <h2 className="text-3xl font-bold text-center mb-12">
          EasyRental – giải pháp vượt trội cho thuê xe tự lái
        </h2>
        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left py-4 px-4">Tiêu chí</th>
                <th className="text-center py-4 px-4 bg-accent/5">
                  <div className="font-bold text-accent">EasyRental</div>
                </th>
                <th className="text-center py-4 px-4">Tự cho thuê</th>
                <th className="text-center py-4 px-4">Nền tảng khác</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                ["Bảo hiểm xe toàn diện", true, false, false],
                ["Hỗ trợ 24/7", true, false, false],
                ["Xác minh khách hàng", true, false, true],
                ["Thanh toán nhanh chóng", true, false, true],
                ["Phí dịch vụ thấp", true, true, false],
              ].map((row, i) => (
                <tr key={i} className="border-b border-[var(--color-border)]">
                  <td className="py-3 px-4">{row[0]}</td>
                  {[1, 2, 3].map((idx) => (
                    <td
                      key={idx}
                      className={`text-center py-3 px-4 ${
                        idx === 1 ? "bg-accent/5" : ""
                      }`}
                    >
                      {row[idx] ? (
                        <CheckCircle2
                          size={20}
                          className="text-success mx-auto"
                        />
                      ) : (
                        <span className="text-[var(--color-muted)]">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FORM ĐĂNG KÝ */}
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
                    <User size={20} className="text-primary" /> Thông tin cá
                    nhân
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Họ và tên *</label>
                      <input
                        className="input"
                        required
                        placeholder="Nguyễn Văn A"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="label">Số điện thoại *</label>
                      <input
                        className="input"
                        required
                        placeholder="0912345678"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="label">Email *</label>
                      <input
                        type="email"
                        className="input"
                        required
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Địa chỉ */}
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <MapPin size={20} className="text-primary" /> Địa chỉ
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Thành phố *</label>
                      <select
                        className="select"
                        required
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                      >
                        <option value="">Chọn thành phố</option>
                        <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                        <option value="Hà Nội">Hà Nội</option>
                        <option value="Đà Nẵng">Đà Nẵng</option>
                        <option value="Cần Thơ">Cần Thơ</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Quận/Huyện *</label>
                      <input
                        className="input"
                        required
                        placeholder="Quận 1"
                        value={formData.district}
                        onChange={(e) =>
                          setFormData({ ...formData, district: e.target.value })
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="label">Địa chỉ cụ thể</label>
                      <input
                        className="input"
                        placeholder="Số nhà, tên đường..."
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Xe */}
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Car size={20} className="text-primary" /> Thông tin xe
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Hãng xe *</label>
                      <select
                        className="select"
                        required
                        value={formData.carBrand}
                        onChange={(e) =>
                          setFormData({ ...formData, carBrand: e.target.value })
                        }
                      >
                        <option value="">Chọn hãng</option>
                        {[
                          "Toyota",
                          "Honda",
                          "Mazda",
                          "Hyundai",
                          "KIA",
                          "VinFast",
                        ].map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label">Dòng xe *</label>
                      <input
                        className="input"
                        required
                        placeholder="Vios, City, Mazda 3..."
                        value={formData.carModel}
                        onChange={(e) =>
                          setFormData({ ...formData, carModel: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="label">Năm sản xuất *</label>
                      <input
                        type="number"
                        className="input"
                        required
                        min={1995}
                        max={new Date().getFullYear()}
                        placeholder="2020"
                        value={formData.year}
                        onChange={(e) =>
                          setFormData({ ...formData, year: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="label">Biển số xe *</label>
                      <input
                        className="input"
                        required
                        placeholder="51A-12345"
                        value={formData.licensePlate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            licensePlate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="label">Số chỗ ngồi *</label>
                      <select
                        className="select"
                        required
                        value={formData.seats}
                        onChange={(e) =>
                          setFormData({ ...formData, seats: e.target.value })
                        }
                      >
                        <option value="">Chọn số chỗ</option>
                        {["4", "5", "7", "9"].map((n) => (
                          <option key={n} value={n}>
                            {n} chỗ
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label">Hộp số *</label>
                      <select
                        className="select"
                        required
                        value={formData.transmission}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            transmission: e.target.value,
                          })
                        }
                      >
                        <option value="">Chọn hộp số</option>
                        <option value="automatic">Số tự động</option>
                        <option value="manual">Số sàn</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Nhiên liệu *</label>
                      <select
                        className="select"
                        required
                        value={formData.fuel}
                        onChange={(e) =>
                          setFormData({ ...formData, fuel: e.target.value })
                        }
                      >
                        <option value="">Chọn nhiên liệu</option>
                        <option value="Xăng">Xăng</option>
                        <option value="Dầu diesel">Dầu diesel</option>
                        <option value="Điện">Điện</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Giá thuê (đ/ngày) *</label>
                      <input
                        type="number"
                        className="input"
                        required
                        min={100000}
                        step={50000}
                        placeholder="500000"
                        value={formData.pricePerDay}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pricePerDay: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Ghi chú */}
                <div>
                  <label className="label">Ghi chú thêm</label>
                  <textarea
                    className="textarea"
                    rows={4}
                    placeholder="Mô tả thêm về xe, tình trạng xe, yêu cầu đặc biệt..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>

                {/* Điều khoản */}
                <div className="flex items-start gap-3 p-4 bg-[var(--color-bg)] rounded-[var(--radius-md)]">
                  <input
                    type="checkbox"
                    required
                    checked={formData.agreeTerms}
                    onChange={(e) =>
                      setFormData({ ...formData, agreeTerms: e.target.checked })
                    }
                    className="mt-1"
                  />
                  <div className="text-sm">
                    Tôi đồng ý với{" "}
                    <a href="/terms" className="text-primary hover:underline">
                      Điều khoản dịch vụ
                    </a>
                    ,{" "}
                    <a href="/privacy" className="text-primary hover:underline">
                      Chính sách bảo mật
                    </a>{" "}
                    và{" "}
                    <a
                      href="/owner-policy"
                      className="text-primary hover:underline"
                    >
                      Chính sách cho chủ xe
                    </a>
                    .
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full text-lg py-3"
                >
                  Đăng ký ngay <ChevronRight size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
