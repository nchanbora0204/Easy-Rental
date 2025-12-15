import { Info, QrCode, Smartphone } from "lucide-react";

export const PaymentQrCard = ({ qrUrl }) => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <QrCode size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Quét mã QR để thanh toán</h2>
            <p className="text-sm text-[var(--color-muted)]">
              Cách nhanh nhất - Tự động xác nhận
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center">
            {qrUrl ? (
              <>
                <div className="relative">
                  <img
                    src={qrUrl}
                    alt="VietQR"
                    className="w-64 h-64 object-contain border-2 border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <Smartphone size={24} className="text-white" />
                  </div>
                </div>
                <p className="text-sm text-[var(--color-muted)] mt-4 text-center">
                  Mở app ngân hàng và quét mã QR
                </p>
              </>
            ) : (
              <div className="w-64 h-64 bg-[var(--color-surface)] rounded-[var(--radius-xl)] flex items-center justify-center">
                <p className="text-[var(--color-muted)] text-sm text-center px-4">
                  Thiếu cấu hình ngân hàng
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Step
              n={1}
              title="Mở app Ngân hàng"
              desc="Sử dụng bất kỳ app ngân hàng nào"
            />
            <Step
              n={2}
              title="Quét mã QR"
              desc='Tìm tính năng "Chuyển khoản QR"'
            />
            <Step
              n={3}
              title="Xác nhận thanh toán"
              desc="Hệ thống tự động xác nhận trong vài giây"
            />

            <div className="p-3 bg-accent/10 rounded-[var(--radius-md)] flex items-start gap-2">
              <Info size={16} className="text-accent flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--color-fg)]">
                Nội dung chuyển khoản đã được tự động điền sẵn trong mã QR
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step = ({ n, title, desc }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-sm font-bold text-primary">{n}</span>
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-[var(--color-muted)]">{desc}</p>
      </div>
    </div>
  );
};
