import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export const StateApproved = () => {
  return (
    <div className="card mb-6 border border-green-200 bg-green-50">
      <div className="card-body">
        <div className="flex items-start gap-3">
          <ShieldCheck size={22} className="text-success mt-1" />
          <div>
            <div className="font-semibold mb-1">Đã duyệt</div>
            <div className="text-[var(--color-muted)]">
              Chúc mừng! Tài khoản đã trở thành <b>Owner</b>. Hệ thống sẽ chuyển
              bạn sang trang đăng xe trong giây lát…
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Link className="btn btn-primary" to="/owner/cars/new">
            Đi tới đăng xe ngay
          </Link>
        </div>
      </div>
    </div>
  );
};
