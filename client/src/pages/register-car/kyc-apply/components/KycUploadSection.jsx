import { Camera, Upload } from "lucide-react";

const UploadBox = ({ label, required, preview, onPick, alt }) => {
  return (
    <div>
      <label className="label mb-2">
        {label} {required && <span className="text-danger">*</span>}
      </label>

      <div
        className={`relative border-2 border-dashed rounded-[var(--radius-lg)] p-4 text-center cursor-pointer transition-all ${
          preview
            ? "border-success bg-success/5"
            : "border-[var(--color-border)] hover:border-primary hover:bg-primary/5"
        }`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onPick(e.target.files?.[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          required={required}
        />
        {preview ? (
          <img src={preview} alt={alt} className="w-full h-32 object-cover rounded-lg" />
        ) : (
          <div className="flex flex-col items-center justify-center h-32">
            <Upload className="mb-2" />
            <p className="text-sm text-[var(--color-muted)]">Click để tải ảnh</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const KycUploadSection = ({ previews, onPick }) => {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Camera size={20} className="text-primary" />
        Tải lên giấy tờ
      </h3>

      <div className="grid md:grid-cols-3 gap-4">
        <UploadBox
          label="Mặt trước CCCD"
          required
          preview={previews.front}
          alt="CCCD mặt trước"
          onPick={(f) => onPick("fFront", f, "front")}
        />
        <UploadBox
          label="Mặt sau CCCD"
          required
          preview={previews.back}
          alt="CCCD mặt sau"
          onPick={(f) => onPick("fBack", f, "back")}
        />
        <UploadBox
          label="Selfie cầm CCCD"
          required
          preview={previews.selfie}
          alt="Selfie với CCCD"
          onPick={(f) => onPick("fSelfie", f, "selfie")}
        />
        <UploadBox
          label="Giấy đăng ký xe (cà-vẹt)"
          required
          preview={previews.vehicleRegistration}
          alt="Giấy đăng ký xe"
          onPick={(f) => onPick("fVehicleRegistration", f, "vehicleRegistration")}
        />
        <UploadBox
          label="Bảo hiểm xe"
          required
          preview={previews.vehicleInsurance}
          alt="Bảo hiểm xe"
          onPick={(f) => onPick("fVehicleInsurance", f, "vehicleInsurance")}
        />
      </div>

      <p className="text-xs text-[var(--color-muted)] mt-2">
        * CCCD dùng để xác minh danh tính, Giấy đăng ký & Bảo hiểm xe dùng để xác minh tài sản cho thuê.
      </p>
    </div>
  );
};

export default KycUploadSection;
 