import { MapPin, ChevronRight, User, Phone, Mail, Shield } from "lucide-react";

export const OwnerStartForm = ({
  user,
  form,
  setForm,
  submit,
  loading,
  openAuth,
}) => {
  return (
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

        <div className="card shadow-lg">
          <div className="card-body">
            <div className="space-y-6">
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
                  onChange={(e) =>
                    setForm((s) => ({ ...s, name: e.target.value }))
                  }
                />
              </div>

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
                      setForm((s) => ({ ...s, phone: e.target.value }))
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
                      setForm((s) => ({ ...s, email: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div>
                <label className="label flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-primary" />
                  Thành phố <span className="text-danger">*</span>
                </label>
                <select
                  className="select w-full"
                  required
                  value={form.city}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, city: e.target.value }))
                  }
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

              <div className="p-4 bg-[var(--color-bg)] rounded-[var(--radius-lg)]">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.agree}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, agree: e.target.checked }))
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
      </div>
    </section>
  );
};
