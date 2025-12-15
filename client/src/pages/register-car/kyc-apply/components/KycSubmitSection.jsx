import { Shield } from "lucide-react";

export const KycSubmitSection = ({ busy, onSubmit }) => {
  return (
    <div className="pt-4 border-t border-[var(--color-border)]">
      <button
        type="button"
        onClick={onSubmit}
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
  );
};

export default KycSubmitSection;
