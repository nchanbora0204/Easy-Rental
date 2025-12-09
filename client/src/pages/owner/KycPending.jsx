import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useKycStatus from "../../hooks/useKycStatus";
import {
  Clock,
  ShieldCheck,
  XCircle,
  RefreshCcw,
  FileCheck,
} from "lucide-react";

function Row({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-[var(--color-border)] last:border-0">
      <div className="text-[var(--color-muted)]">{label}</div>
      <div className="font-medium text-right">{value || "—"}</div>
    </div>
  );
}

const fmt = (d) => {
  try {
    const dt = new Date(d);
    if (Number.isNaN(+dt)) return "";
    return dt.toLocaleString();
  } catch {
    return "";
  }
};

export default function KycPending() {
  const nav = useNavigate();
  const { role, kycStatus, ownerStatus, profile, loading, err, refresh } =
    useKycStatus(10000);

  useEffect(() => {
    if (kycStatus === "approved") {
      nav("/owner/cars/new", { replace: true });
    }
  }, [kycStatus, nav]);

  return (
    <div className="section max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">
        Trạng thái xác minh Owner (KYC)
      </h1>

      {/* Status banner */}
      {loading && (
        <div className="card mb-4">
          <div className="card-body flex items-center gap-3">
            <RefreshCcw className="animate-spin" size={20} />
            <div>Đang tải trạng thái…</div>
          </div>
        </div>
      )}

      {err && (
        <div className="card mb-4 border border-red-200 bg-red-50">
          <div className="card-body">
            <div className="font-semibold text-danger mb-2">Lỗi</div>
            <div className="text-[var(--color-muted)] mb-3">
              {err?.response?.data?.message || err.message}
            </div>
            <button className="btn btn-primary" onClick={refresh}>
              Thử lại
            </button>
          </div>
        </div>
      )}

      {!loading && !err && (
        <>
          {kycStatus === "none" && (
            <div className="card mb-6">
              <div className="card-body">
                <div className="flex items-start gap-3">
                  <FileCheck size={22} className="text-accent mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Chưa có hồ sơ KYC</div>
                    <div className="text-[var(--color-muted)] mb-4">
                      Bạn chưa nộp hồ sơ xác minh. Vui lòng tiến hành KYC để trở
                      thành chủ xe.
                    </div>
                    <Link className="btn btn-primary" to="/register-car">
                      Bắt đầu đăng ký Owner
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {kycStatus === "pending" && (
            <div className="card mb-6">
              <div className="card-body">
                <div className="flex items-start gap-3">
                  <Clock size={22} className="text-warning mt-1" />
                  <div className="flex-1">
                    <div className="font-semibold mb-1">Đang chờ duyệt</div>
                    <div className="text-[var(--color-muted)]">
                      Hồ sơ của bạn đang được xét duyệt (thường trong 24–48
                      giờ). Trang này sẽ tự làm mới mỗi 10 giây.
                    </div>
                  </div>
                  <button
                    onClick={refresh}
                    className="btn btn-ghost inline-flex items-center gap-2"
                  >
                    <RefreshCcw size={16} /> Làm mới
                  </button>
                </div>

                <div className="mt-4">
                  <div className="font-semibold mb-2">Tóm tắt hồ sơ</div>
                  <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-4">
                    <Row label="Họ tên" value={profile?.fullName} />
                    <Row label="Số CCCD" value={profile?.idNumber} />
                    <Row label="SĐT" value={profile?.phone} />
                    <Row label="Ngày nộp" value={fmt(profile?.appliedAt)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {kycStatus === "rejected" && (
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
                  <button className="btn btn-ghost" onClick={refresh}>
                    <RefreshCcw size={16} /> Làm mới
                  </button>
                </div>
              </div>
            </div>
          )}

          {kycStatus === "approved" && (
            <div className="card mb-6 border border-green-200 bg-green-50">
              <div className="card-body">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={22} className="text-success mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Đã duyệt</div>
                    <div className="text-[var(--color-muted)]">
                      Chúc mừng! Tài khoản đã trở thành <b>Owner</b>. Hệ thống
                      sẽ chuyển bạn sang trang đăng xe trong giây lát…
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
          )}
        </>
      )}

      <div className="text-sm text-[var(--color-muted)]">
        Vai trò hiện tại: <b>{role || "—"}</b> • Trạng thái KYC:{" "}
        <b>{kycStatus || "—"}</b> • Trạng thái chủ xe:{" "}
        <b>{ownerStatus || "—"}</b>
      </div>
    </div>
  );
}
