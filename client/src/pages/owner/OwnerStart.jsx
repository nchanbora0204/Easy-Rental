import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../lib/axios";
import {
  MapPin,
  ChevronRight,
  User,
  Phone,
  Mail,
  CheckCircle2,
  Shield,
  DollarSign,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
  Award,
  ArrowRight,
} from "lucide-react";

export default function OwnerStart() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [sp, setSp] = useSearchParams();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    agree: false,
  });
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!user) return;
      try {
        const { data } = await api.get("/auth/me");
        const u = data?.data || {};
        setForm((s) => ({
          ...s,
          name: u.name || "",
          phone: u.phone || "",
          email: u.email || "",
          city: u.city || "",
        }));
      } catch {
        /* empty */
      }
    })();
  }, [user]);

  useEffect(() => {
    (async () => {
      if (!user) return;
      try {
        const { data } = await api.get("/kyc/me");
        const st = data?.data?.kycStatus;
        if (st === "approved") nav("/owner/cars/new");
        if (st === "pending") nav("/register-car/pending");
      } catch {
        /* empty */
      }
    })();
  }, [user, nav]);

  const openAuth = (tab) => {
    const next = new URLSearchParams(sp);
    next.set("auth", tab);
    next.set("next", "/register-car/kyc");
    setSp(next, { replace: false });
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setMsgType("");

    if (!form.agree) {
      setMsg("Vui lòng đồng ý với điều khoản và chính sách");
      setMsgType("error");
      return;
    }

    if (!user) return openAuth("register");

    try {
      setLoading(true);
      await api.patch("/users/me", {
        name: form.name,
        phone: form.phone,
        city: form.city,
      });
      nav("/register-car/kyc");
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message || "Có lỗi xảy ra");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      num: 1,
      title: "Đăng ký chủ xe",
      desc: "Điền thông tin cơ bản",
      active: true,
    },
    {
      num: 2,
      title: "Xác minh KYC",
      desc: "Xác minh danh tính",
      active: false,
    },
    {
      num: 3,
      title: "Đăng tin xe",
      desc: "Hoàn tất và bắt đầu cho thuê",
      active: false,
    },
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "Thu nhập ổn định",
      desc: "10-15 triệu/tháng",
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      icon: Shield,
      title: "Bảo hiểm toàn diện",
      desc: "An tâm 100%",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Clock,
      title: "Hỗ trợ 24/7",
      desc: "Luôn sẵn sàng",
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      icon: TrendingUp,
      title: "Dễ dàng quản lý",
      desc: "Dashboard thông minh",
      color: "text-warning",
      bg: "bg-warning/10",
    },
  ];

  const stats = [
    { icon: Users, value: "50K+", label: "Chủ xe" },
    { icon: Award, value: "100%", label: "Bảo hiểm" },
    { icon: TrendingUp, value: "15tr", label: "Thu nhập TB" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&h=800&fit=crop"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />

        <div className="relative z-10 section py-20">
          <div className="max-w-3xl">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-[var(--radius-pill)] text-sm font-semibold backdrop-blur-sm">
                Kiếm thu nhập thụ động
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ký gửi xe thật đơn giản cùng{" "}
              <span className="text-accent">EasyRental</span>
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Chỉ 3 bước đơn giản để bắt đầu cho thuê xe và kiếm thu nhập
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-3 text-white">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#owner-form"
              className="btn bg-accent text-white hover:bg-accent/90 text-lg px-8 inline-flex items-center gap-2"
            >
              Bắt đầu ngay
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="section py-16 bg-[var(--color-surface)]">
        <h2 className="text-3xl font-bold text-center mb-12">
          Quy trình đăng ký đơn giản
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-3 flex-1">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl transition-all ${
                      step.active
                        ? "bg-accent text-white ring-4 ring-accent/20"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.num}
                  </div>
                  <div className="text-center">
                    <h3
                      className={`font-semibold mb-1 ${
                        step.active
                          ? "text-accent"
                          : "text-[var(--color-muted)]"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm text-[var(--color-muted)]">
                      {step.desc}
                    </p>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div className="h-0.5 flex-1 mx-4 bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section py-16">
        <h2 className="text-3xl font-bold text-center mb-4">
          Lợi ích khi trở thành chủ xe
        </h2>
        <p className="text-center text-[var(--color-muted)] mb-12 max-w-2xl mx-auto">
          Tham gia cùng hơn 50,000 chủ xe đang kiếm thu nhập thụ động
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="card hover:shadow-xl transition-all text-center"
            >
              <div className="card-body">
                <div
                  className={`w-16 h-16 ${benefit.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                >
                  <benefit.icon size={32} className={benefit.color} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-[var(--color-muted)]">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Form Section */}
      <section
        id="owner-form"
        className="section py-16 bg-[var(--color-surface)]"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Đăng ký chủ xe</h2>
            <p className="text-[var(--color-muted)]">
              Điền thông tin bên dưới để bắt đầu hành trình kiếm thu nhập
            </p>
          </div>

          {/* Alert Message */}
          {msg && (
            <div
              className={`card mb-6 ${
                msgType === "error"
                  ? "bg-red-50 border-red-200"
                  : "bg-success/10 border-success/20"
              }`}
            >
              <div className="card-body flex items-start gap-3">
                <AlertCircle
                  size={20}
                  className={`flex-shrink-0 mt-0.5 ${
                    msgType === "error" ? "text-danger" : "text-success"
                  }`}
                />
                <p
                  className={`text-sm ${
                    msgType === "error" ? "text-danger" : "text-success"
                  }`}
                >
                  {msg}
                </p>
              </div>
            </div>
          )}

          <div className="card shadow-lg">
            <div className="card-body">
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="label flex items-center gap-2 mb-2">
                    <User size={16} className="text-primary" />
                    Họ và tên <span className="text-danger">*</span>
                  </label>
                  <input
                    className="input w-full"
                    placeholder="Nguyễn Văn A"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                {/* Phone & Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label flex items-center gap-2 mb-2">
                      <Phone size={16} className="text-primary" />
                      Số điện thoại <span className="text-danger">*</span>
                    </label>
                    <input
                      className="input w-full"
                      placeholder="0912345678"
                      required
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="label flex items-center gap-2 mb-2">
                      <Mail size={16} className="text-primary" />
                      Email {user && "(Đã xác minh)"}
                    </label>
                    <input
                      className="input w-full"
                      type="email"
                      disabled={!!user}
                      placeholder="email@example.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="label flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-primary" />
                    Thành phố <span className="text-danger">*</span>
                  </label>
                  <select
                    className="select w-full"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  >
                    <option value="">Chọn thành phố</option>
                    <option>Hồ Chí Minh</option>
                    <option>Hà Nội</option>
                    <option>Đà Nẵng</option>
                    <option>Cần Thơ</option>
                    <option>Nha Trang</option>
                    <option>Hải Phòng</option>
                    <option>Bình Dương</option>
                  </select>
                </div>

                {/* Terms Checkbox */}
                <div className="p-4 bg-[var(--color-bg)] rounded-[var(--radius-lg)]">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.agree}
                      onChange={(e) =>
                        setForm({ ...form, agree: e.target.checked })
                      }
                      className="mt-1"
                    />
                    <span className="text-sm">
                      Tôi đã đọc và đồng ý với{" "}
                      <a
                        href="/terms"
                        className="text-primary hover:underline font-medium"
                      >
                        Điều khoản dịch vụ
                      </a>
                      ,{" "}
                      <a
                        href="/privacy"
                        className="text-primary hover:underline font-medium"
                      >
                        Chính sách bảo mật
                      </a>{" "}
                      và{" "}
                      <a
                        href="/owner-policy"
                        className="text-primary hover:underline font-medium"
                      >
                        Chính sách cho chủ xe
                      </a>
                      .
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  onClick={submit}
                  className="btn btn-primary w-full text-lg py-3"
                  disabled={loading}
                >
                  {loading ? (
                    "Đang xử lý..."
                  ) : (
                    <>
                      <Shield size={20} />
                      Bắt đầu xác minh KYC
                      <ChevronRight size={20} />
                    </>
                  )}
                </button>

                {/* Login Link */}
                {!user && (
                  <div className="text-center pt-4 border-t border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-muted)]">
                      Đã có tài khoản?{" "}
                      <button
                        type="button"
                        className="text-primary font-medium hover:underline"
                        onClick={() => openAuth("login")}
                      >
                        Đăng nhập để tiếp tục
                      </button>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-primary/5 rounded-[var(--radius-lg)] flex items-start gap-3">
            <Shield size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-primary mb-1">
                Thông tin của bạn được bảo mật
              </p>
              <p className="text-[var(--color-muted)]">
                Chúng tôi cam kết bảo vệ thông tin cá nhân và dữ liệu của bạn
                theo tiêu chuẩn bảo mật cao nhất
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
