import { Link } from "react-router-dom";
import { RefreshCcw, XCircle } from "lucide-react";

export const StateRejected = ({ profile, onRefresh }) => {
  return (
    <div className="card mb-6 border border-red-200 bg-red-50">
      <div className="card-body">
        <div className="flex items-start gap-3">
          <XCircle size={22} className="text-danger mt-1" />
          <div className="flex-1">
            <div className="font-semibold mb-1">Hồ sơ bị từ chối</div>
            <div className="text-[var(--color-muted)]">
              {profile?.note
                ? `Lý do: ${profile.note}`
                : "Hồ sơ chưa đạt yêu cầu. Vui lòng cập nhật và gửi lại."}
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <Link className="btn btn-primary" to="/register-car">
            Làm lại hồ sơ
          </Link>
          <button className="btn btn-ghost" onClick={onRefresh}>
            <RefreshCcw size={16} /> Làm mới
          </button>
        </div>
      </div>
    </div>
  );
};
