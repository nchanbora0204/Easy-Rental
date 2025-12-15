import { AlertCircle, Building2, Copy, CreditCard, Info, Check } from "lucide-react";
import { fmtVND } from "../../../utils/format";

export const PaymentManualCard = ({
  payNow,
  content,
  bankAcc,
  bankName,
  bankShort,
  copiedField,
  onCopy,
}) => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
            <Building2 size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Chuyển khoản thủ công</h2>
            <p className="text-sm text-[var(--color-muted)]">
              Nhập thông tin bên dưới vào app ngân hàng
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <CopyField
            label="Số tiền"
            value={`${fmtVND(payNow)} đ`}
            copied={copiedField === "amount"}
            onCopy={() => onCopy(payNow, "amount")}
            icon={<CreditCard size={16} />}
          />
          <CopyField
            label="Nội dung"
            value={content}
            copied={copiedField === "content"}
            onCopy={() => onCopy(content, "content")}
            icon={<Info size={16} />}
            highlight
          />
          <CopyField
            label="Số tài khoản"
            value={bankAcc}
            copied={copiedField === "account"}
            onCopy={() => onCopy(bankAcc, "account")}
            icon={<CreditCard size={16} />}
          />
          <CopyField
            label="Ngân hàng"
            value={`${bankName} (${bankShort})`}
            copied={copiedField === "bank"}
            onCopy={() => onCopy(bankShort, "bank")}
            icon={<Building2 size={16} />}
          />
        </div>

        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-[var(--radius-md)] flex items-start gap-2">
          <AlertCircle size={16} className="text-warning flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[var(--color-fg)]">
            <strong>Lưu ý:</strong> Nhập đúng nội dung chuyển khoản để hệ thống tự động xác nhận
          </p>
        </div>
      </div>
    </div>
  );
};

const CopyField = ({ label, value, icon, copied, onCopy, highlight }) => {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-[var(--radius-md)] transition-all ${
        highlight ? "bg-warning/10 border border-warning/20" : "bg-[var(--color-bg)]"
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="text-[var(--color-muted)] flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-[var(--color-muted)] mb-0.5">{label}</div>
          <div className={`font-mono font-medium truncate ${highlight ? "text-warning" : ""}`}>
            {value}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onCopy}
        className={`btn px-3 py-1.5 flex-shrink-0 ${
          copied ? "bg-[var(--color-success)] text-white hover:brightness-95" : "btn-ghost"
        }`}
      >
        {copied ? (
          <>
            <Check size={16} />
            <span className="hidden sm:inline">Đã copy</span>
          </>
        ) : (
          <>
            <Copy size={16} />
            <span className="hidden sm:inline">Copy</span>
          </>
        )}
      </button>
    </div>
  );
};
