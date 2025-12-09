import { useEffect, useState } from "react";
import api from "../lib/axios";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Calendar,
  CreditCard,
  MapPin,
  Building2,
  Upload,
  Camera,
  CheckCircle2,
  AlertCircle,
  Info,
  FileText,
  Shield,
  Image as ImageIcon,
} from "lucide-react";

export default function KycApplyForm({ initial = {}, onSubmitted }) {
  const nav = useNavigate();
  const [form, setForm] = useState({
    fullName: initial?.fullName || "",
    phone: initial?.phone || "",
    dateOfBirth: initial?.dateOfBirth?.slice(0, 10) || "",
    idNumber: initial?.idNumber || "",
    idIssueDate: initial?.idIssueDate?.slice(0, 10) || "",
    address: initial?.address || "",
    bankAccount: initial?.bankAccount || "",
    bankName: initial?.bankName || "",
    note: initial?.note || "",
    fFront: null,
    fBack: null,
    fSelfie: null,
    fVehicleRegistration: null,
    fVehicleInsurance: null,
  });

  //dieu huong ve dung trang
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get("/auth/me");
        if (!alive) return;
        const u = data?.data || {};
        if (u.kycStatus === "pending")
          nav("/register-car/pending", { replace: true });
        if (u.kycStatus === "approved")
          nav("/owner/cars/new", { replace: true });
      } catch {
        /* */
      }
    })();
    return () => {
      alive = false;
    };
  }, [nav]);

  const [previews, setPreviews] = useState({
    front: null,
    back: null,
    selfie: null,
    vehicleRegistration: null,
    vehicleInsurance: null,
  });

  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [busy, setBusy] = useState(false);

  const onChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const handleFileChange = (field, file, previewKey) => {
    if (file) {
      onChange(field, file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({ ...prev, [previewKey]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setMsgType("");
    setBusy(true);

    try {
      const fd = new FormData();
      if (form.fFront) fd.append("idFrontUrl", form.fFront);
      if (form.fBack) fd.append("idBackUrl", form.fBack);
      if (form.fSelfie) fd.append("selfieWithIdUrl", form.fSelfie);
      if (form.fVehicleRegistration)
        fd.append("vehicleRegistrationUrl", form.fVehicleRegistration);
      if (form.fVehicleInsurance)
        fd.append("vehicleInsuranceUrl", form.fVehicleInsurance);

      const up = await api.post("/uploads/kyc", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const upUrls = up?.data?.data || {};

      await api.post("/kyc/apply", {
        fullName: form.fullName,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth,
        idNumber: form.idNumber,
        idIssueDate: form.idIssueDate,
        idFrontUrl: upUrls.idFrontUrl,
        idBackUrl: upUrls.idBackUrl,
        selfieWithIdUrl: upUrls.selfieWithIdUrl,
        address: form.address,
        bankAccount: form.bankAccount,
        bankName: form.bankName,
        vehicleRegistrationUrl: upUrls.vehicleRegistrationUrl,
        vehicleInsuranceUrl: upUrls.vehicleInsuranceUrl,
        note: form.note,
      });

      setMsg(
        "Đã nộp hồ sơ thành công! Chúng tôi sẽ xét duyệt trong vòng 24-48 giờ."
      );
      setMsgType("success");
      onSubmitted?.();
      nav("/register-car/pending", { replace: true });
    } catch (e) {
      setMsg(
        e?.response?.data?.message ||
          e.message ||
          "Có lỗi xảy ra, vui lòng thử lại"
      );
      setMsgType("error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield size={24} className="text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">
                Xác minh danh tính (KYC)
              </h2>
              <p className="text-[var(--color-muted)]">
                Hoàn thành xác minh danh tính để trở thành chủ xe và bắt đầu cho
                thuê
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Message */}
      {msg && (
        <div
          className={`card mb-6 ${
            msgType === "success"
              ? "bg-success/10 border-success/20"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="card-body flex items-start gap-3">
            {msgType === "success" ? (
              <CheckCircle2
                size={20}
                className="text-success flex-shrink-0 mt-0.5"
              />
            ) : (
              <AlertCircle
                size={20}
                className="text-danger flex-shrink-0 mt-0.5"
              />
            )}
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  msgType === "success" ? "text-success" : "text-danger"
                }`}
              >
                {msgType === "success" ? "Thành công" : "Lỗi"}
              </p>
              <p
                className={`text-sm mt-1 ${
                  msgType === "success" ? "text-success/80" : "text-danger/80"
                }`}
              >
                {msg}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Notice */}
      <div className="card mb-6 bg-primary/5 border-primary/20">
        <div className="card-body flex items-start gap-3">
          <Info size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">Lưu ý quan trọng:</p>
            <ul className="space-y-1 text-[var(--color-muted)]">
              <li>• Thông tin phải chính xác và trùng khớp với CCCD</li>
              <li>• Ảnh CCCD phải rõ nét, đầy đủ 4 góc</li>
              <li>• Ảnh selfie cần có mặt người và CCCD cùng khung hình</li>
              <li>• Ảnh cà-vẹt xe phải đầy đủ và không mất viền</li>
              <li>
                • Chụp rõ toàn bộ mặt có đầy đủ thông tin (biển số, số khung/số
                máy, tên chủ xe, thời hạn bảo hiểm…). Nếu giấy tờ có 2 mặt, hãy
                chụp mặt có thông tin chính.{" "}
              </li>

              <li>• Thời gian xét duyệt: 24-48 giờ làm việc</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="card">
        <div className="card-body space-y-8">
          {/* Personal Information */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <User size={20} className="text-primary" />
              Thông tin cá nhân
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label flex items-center gap-2 mb-2">
                  <User size={16} />
                  Họ và tên <span className="text-danger">*</span>
                </label>
                <input
                  className="input w-full"
                  placeholder="Nguyễn Văn A"
                  value={form.fullName}
                  onChange={(e) => onChange("fullName", e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="label flex items-center gap-2 mb-2">
                  <Phone size={16} />
                  Số điện thoại <span className="text-danger">*</span>
                </label>
                <input
                  className="input w-full"
                  placeholder="0912345678"
                  value={form.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="label flex items-center gap-2 mb-2">
                  <Calendar size={16} />
                  Ngày sinh <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="input w-full"
                  value={form.dateOfBirth}
                  onChange={(e) => onChange("dateOfBirth", e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="label flex items-center gap-2 mb-2">
                  <CreditCard size={16} />
                  Số CCCD/CMND <span className="text-danger">*</span>
                </label>
                <input
                  className="input w-full"
                  placeholder="001234567890"
                  value={form.idNumber}
                  onChange={(e) => onChange("idNumber", e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="label flex items-center gap-2 mb-2">
                  <Calendar size={16} />
                  Ngày cấp <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="input w-full"
                  value={form.idIssueDate}
                  onChange={(e) => onChange("idIssueDate", e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="label flex items-center gap-2 mb-2">
                  <MapPin size={16} />
                  Nơi cấp
                </label>
                <input
                  className="input w-full"
                  placeholder="Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư"
                  defaultValue="Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư"
                />
              </div>

              <div className="md:col-span-2">
                <label className="label flex items-center gap-2 mb-2">
                  <MapPin size={16} />
                  Địa chỉ thường trú <span className="text-danger">*</span>
                </label>
                <input
                  className="input w-full"
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  value={form.address}
                  onChange={(e) => onChange("address", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Bank Information */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Building2 size={20} className="text-primary" />
              Thông tin ngân hàng
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label flex items-center gap-2 mb-2">
                  <Building2 size={16} />
                  Tên ngân hàng <span className="text-danger">*</span>
                </label>
                <select
                  className="select w-full"
                  value={form.bankName}
                  onChange={(e) => onChange("bankName", e.target.value)}
                  required
                >
                  <option value="">Chọn ngân hàng</option>
                  <option value="Vietcombank">Vietcombank</option>
                  <option value="VietinBank">VietinBank</option>
                  <option value="BIDV">BIDV</option>
                  <option value="Agribank">Agribank</option>
                  <option value="MB Bank">MB Bank</option>
                  <option value="Techcombank">Techcombank</option>
                  <option value="ACB">ACB</option>
                  <option value="VPBank">VPBank</option>
                  <option value="TPBank">TPBank</option>
                  <option value="Sacombank">Sacombank</option>
                </select>
              </div>

              <div>
                <label className="label flex items-center gap-2 mb-2">
                  <CreditCard size={16} />
                  Số tài khoản <span className="text-danger">*</span>
                </label>
                <input
                  className="input w-full"
                  placeholder="1234567890"
                  value={form.bankAccount}
                  onChange={(e) => onChange("bankAccount", e.target.value)}
                  required
                />
              </div>
            </div>
            <p className="text-xs text-[var(--color-muted)] mt-2">
              * Tài khoản ngân hàng dùng để nhận thanh toán từ khách thuê
            </p>
          </div>

          {/* Document Upload */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Camera size={20} className="text-primary" />
              Tải lên giấy tờ
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Front ID */}
              <div>
                <label className="label mb-2">
                  Mặt trước CCCD <span className="text-danger">*</span>
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-[var(--radius-lg)] p-4 text-center cursor-pointer transition-all ${
                    previews.front
                      ? "border-success bg-success/5"
                      : "border-[var(--color-border)] hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange("fFront", e.target.files?.[0], "front")
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  {previews.front ? (
                    <img
                      src={previews.front}
                      alt="CCCD mặt trước"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32">
                      <Upload className="mb-2" />
                      <p className="text-sm text-[var(--color-muted)]">
                        Click để tải ảnh
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Back ID */}
              <div>
                <label className="label mb-2">
                  Mặt sau CCCD <span className="text-danger">*</span>
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-[var(--radius-lg)] p-4 text-center cursor-pointer transition-all ${
                    previews.back
                      ? "border-success bg-success/5"
                      : "border-[var(--color-border)] hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange("fBack", e.target.files?.[0], "back")
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  {previews.back ? (
                    <img
                      src={previews.back}
                      alt="CCCD mặt sau"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32">
                      <Upload className="mb-2" />
                      <p className="text-sm text-[var(--color-muted)]">
                        Click để tải ảnh
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Selfie */}
              <div>
                <label className="label mb-2">
                  Selfie cầm CCCD <span className="text-danger">*</span>
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-[var(--radius-lg)] p-4 text-center cursor-pointer transition-all ${
                    previews.selfie
                      ? "border-success bg-success/5"
                      : "border-[var(--color-border)] hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange("fSelfie", e.target.files?.[0], "selfie")
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  {previews.selfie ? (
                    <img
                      src={previews.selfie}
                      alt="Selfie với CCCD"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32">
                      <Upload className="mb-2" />
                      <p className="text-sm text-[var(--color-muted)]">
                        Click để tải ảnh
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* NEW: Giấy đăng ký xe */}
              <div>
                <label className="label mb-2">
                  Giấy đăng ký xe (cà-vẹt){" "}
                  <span className="text-danger">*</span>
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-[var(--radius-lg)] p-4 text-center cursor-pointer transition-all ${
                    previews.vehicleRegistration
                      ? "border-success bg-success/5"
                      : "border-[var(--color-border)] hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(
                        "fVehicleRegistration",
                        e.target.files?.[0],
                        "vehicleRegistration"
                      )
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  {previews.vehicleRegistration ? (
                    <img
                      src={previews.vehicleRegistration}
                      alt="Giấy đăng ký xe"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32">
                      <Upload className="mb-2" />
                      <p className="text-sm text-[var(--color-muted)]">
                        Click để tải ảnh
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* NEW: Bảo hiểm xe */}
              <div>
                <label className="label mb-2">
                  Bảo hiểm xe <span className="text-danger">*</span>
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-[var(--radius-lg)] p-4 text-center cursor-pointer transition-all ${
                    previews.vehicleInsurance
                      ? "border-success bg-success/5"
                      : "border-[var(--color-border)] hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(
                        "fVehicleInsurance",
                        e.target.files?.[0],
                        "vehicleInsurance"
                      )
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  {previews.vehicleInsurance ? (
                    <img
                      src={previews.vehicleInsurance}
                      alt="Bảo hiểm xe"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32">
                      <Upload className="mb-2" />
                      <p className="text-sm text-[var(--color-muted)]">
                        Click để tải ảnh
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="text-xs text-[var(--color-muted)] mt-2">
              * CCCD dùng để xác minh danh tính, Giấy đăng ký & Bảo hiểm xe dùng
              để xác minh tài sản cho thuê.
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="label flex items-center gap-2 mb-2">
              <FileText size={16} />
              Ghi chú (tùy chọn)
            </label>
            <textarea
              className="textarea w-full"
              rows={4}
              placeholder="Thêm ghi chú nếu cần..."
              value={form.note}
              onChange={(e) => onChange("note", e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-[var(--color-border)]">
            <button
              onClick={submit}
              className="btn btn-primary w-full text-lg py-3"
              disabled={busy}
            >
              {busy ? (
                "Đang gửi hồ sơ..."
              ) : (
                <>
                  <Shield size={20} />
                  Nộp hồ sơ xác minh
                </>
              )}
            </button>
            <p className="text-xs text-center text-[var(--color-muted)] mt-3">
              Bằng việc nộp hồ sơ, bạn đồng ý với{" "}
              <a href="/terms" className="text-primary hover:underline">
                Điều khoản dịch vụ
              </a>{" "}
              và{" "}
              <a href="/privacy" className="text-primary hover:underline">
                Chính sách bảo mật
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
