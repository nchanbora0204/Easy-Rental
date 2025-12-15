import { User, Phone, Calendar, CreditCard, MapPin } from "lucide-react";
import { DEFAULT_ISSUE_PLACE } from "../kycApplyConstants";

export const KycPersonalSection = ({ form, onChange }) => {
  return (
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
            defaultValue={DEFAULT_ISSUE_PLACE}
            placeholder={DEFAULT_ISSUE_PLACE}
            readOnly
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
  );
};

export default KycPersonalSection;
