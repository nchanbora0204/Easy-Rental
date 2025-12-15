import { Clock, RefreshCcw } from "lucide-react";
import { KycRow } from "./KycRow";
import { fmtDateTime } from "../kycPending.utils";

export const StatePending = ({ profile, onRefresh }) => {
  return (
    <div className="card mb-6">
      <div className="card-body">
        <div className="flex items-start gap-3">
          <Clock size={22} className="text-warning mt-1" />
          <div className="flex-1">
            <div className="font-semibold mb-1">Đang chờ duyệt</div>
            <div className="text-[var(--color-muted)]">
              Hồ sơ của bạn đang được xét duyệt (thường trong 24–48 giờ). Trang
              này sẽ tự làm mới mỗi 10 giây.
            </div>
          </div>
          <button
            onClick={onRefresh}
            className="btn btn-ghost inline-flex items-center gap-2"
          >
            <RefreshCcw size={16} /> Làm mới
          </button>
        </div>

        <div className="mt-4">
          <div className="font-semibold mb-2">Tóm tắt hồ sơ</div>
          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-4">
            <KycRow label="Họ tên" value={profile?.fullName} />
            <KycRow label="Số CCCD" value={profile?.idNumber} />
            <KycRow label="SĐT" value={profile?.phone} />
            <KycRow label="Ngày nộp" value={fmtDateTime(profile?.appliedAt)} />
          </div>
        </div>
      </div>
    </div>
  );
};
