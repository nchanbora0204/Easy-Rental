import { Building2, CreditCard } from "lucide-react";
import { BANK_OPTIONS } from "../kycApplyConstants";

export const KycBankSection = ({ form, onChange }) => {
  return (
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
            {BANK_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
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
  );
};

export default KycBankSection;
