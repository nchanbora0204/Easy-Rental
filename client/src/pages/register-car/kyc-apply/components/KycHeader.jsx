import { Shield } from "lucide-react";

export const KycHeader = () => {
  return (
    <div className="card mb-6">
      <div className="card-body">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Shield size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Xác minh danh tính (KYC)</h2>
            <p className="text-[var(--color-muted)]">
              Hoàn thành xác minh danh tính để trở thành chủ xe và bắt đầu cho thuê
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycHeader;
