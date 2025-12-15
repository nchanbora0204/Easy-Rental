import { FileText, Mail, Phone, User } from "lucide-react";

export const CustomerForm = ({
  fullName,
  setFullName,
  phone,
  setPhone,
  email,
  setEmail,
  notes,
  setNotes,
}) => {
  return (
    <div className="card">
      <div className="card-body">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <User size={20} className="text-primary" />
          Thông tin người thuê
        </h2>

        <div className="space-y-4">
          <div>
            <label className="label flex items-center gap-2 mb-2">
              <User size={16} />
              Họ và tên <span className="text-danger">*</span>
            </label>
            <input
              className="input"
              placeholder="Nguyễn Văn A"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label flex items-center gap-2 mb-2">
                <Phone size={16} />
                Số điện thoại <span className="text-danger">*</span>
              </label>
              <input
                className="input"
                placeholder="0912345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label flex items-center gap-2 mb-2">
                <Mail size={16} />
                Email (tùy chọn)
              </label>
              <input
                type="email"
                className="input"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label flex items-center gap-2 mb-2">
              <FileText size={16} />
              Ghi chú (tùy chọn)
            </label>
            <textarea
              className="textarea"
              rows={3}
              placeholder="Thêm ghi chú cho chủ xe..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
