import { CreditCard } from "lucide-react";
import { fmtVND } from "../../../utils/format";

export const PaymentOptions = ({
  payOption,
  setPayOption,
  deposit,
  subtotal,
  wantInvoice,
  setWantInvoice,
  payOnPickup,
}) => {
  return (
    <div className="card">
      <div className="card-body">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <CreditCard size={20} className="text-primary" />
          Phương thức thanh toán
        </h2>

        <div className="space-y-3">
          <Option
            checked={payOption === "deposit"}
            onChange={() => setPayOption("deposit")}
            title="Thanh toán đặt cọc"
            right={`${fmtVND(deposit)}đ`}
            desc="Giữ chỗ ngay, hoàn lại 100% nếu xe không khả dụng. Số tiền còn lại thanh toán khi nhận xe."
          />

          <Option
            checked={payOption === "full"}
            onChange={() => setPayOption("full")}
            title="Thanh toán toàn bộ"
            right={`${fmtVND(subtotal)}đ`}
            desc="Thanh toán 100% ngay. Nhận xe dễ dàng hơn, không cần thanh toán thêm."
          />

          <Option
            checked={payOption === "later"}
            onChange={() => setPayOption("later")}
            title="Thanh toán khi nhận xe"
            right={`${fmtVND(subtotal)}đ`}
            desc="Không thanh toán online. Thanh toán trực tiếp cho chủ xe khi nhận xe."
          />
        </div>

        <div className="mt-4 p-4 bg-[var(--color-bg)] rounded-[var(--radius-md)]">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={wantInvoice}
              onChange={(e) => setWantInvoice(e.target.checked)}
              className="mt-1"
            />
            <div>
              <span className="font-medium">Xuất hóa đơn VAT</span>
              <p className="text-sm text-[var(--color-muted)] mt-1">
                Yêu cầu xuất hóa đơn đỏ cho doanh nghiệp
              </p>
            </div>
          </label>
        </div>

        {payOption === "deposit" ? (
          <div className="mt-4 bg-primary/5 border border-primary/20 rounded-[var(--radius-md)] p-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Thanh toán ngay</span>
              <span className="font-bold text-primary">{fmtVND(deposit)}đ</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-muted)]">
                Thanh toán khi nhận xe
              </span>
              <span className="font-medium">{fmtVND(payOnPickup)}đ</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const Option = ({ checked, onChange, title, right, desc }) => {
  return (
    <label
      className={`flex items-start gap-3 p-4 border-2 rounded-[var(--radius-lg)] cursor-pointer transition-all ${
        checked
          ? "border-primary bg-primary/5"
          : "border-[var(--color-border)] hover:border-primary/50"
      }`}
    >
      <input
        type="radio"
        name="pay"
        className="mt-1"
        checked={checked}
        onChange={onChange}
      />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold">{title}</span>
          <span className="text-lg font-bold text-primary">{right}</span>
        </div>
        <p className="text-sm text-[var(--color-muted)]">{desc}</p>
      </div>
    </label>
  );
};
