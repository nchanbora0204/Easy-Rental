import { Link } from "react-router-dom";
import { FileCheck } from "lucide-react";

export const StateNone = () => {
  return (
    <div className="card mb-6">
      <div className="card-body">
        <div className="flex items-start gap-3">
          <FileCheck size={22} className="text-accent mt-1" />
          <div>
            <div className="font-semibold mb-1">Chưa có hồ sơ KYC</div>
            <div className="text-[var(--color-muted)] mb-4">
              Bạn chưa nộp hồ sơ xác minh. Vui lòng tiến hành KYC để trở thành
              chủ xe.
            </div>
            <Link className="btn btn-primary" to="/register-car">
              Bắt đầu đăng ký Owner
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
