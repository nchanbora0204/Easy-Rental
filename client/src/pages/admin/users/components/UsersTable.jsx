import {
  ShieldBan,
  ShieldCheck,
  UserRound,
  Mail,
  Calendar,
  Loader2,
} from "lucide-react";
import { getIsLocked } from "../utils";

export const UsersTable = ({ rows, loading, onLock, onUnlock }) => {
  return (
    <div className="card">
      <div className="card-body overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-3 px-2">Người dùng</th>
              <th className="py-3 px-2">Email</th>
              <th className="py-3 px-2">Vai trò</th>
              <th className="py-3 px-2">KYC</th>
              <th className="py-3 px-2">Ngày tạo</th>
              <th className="py-3 px-2">Trạng thái</th>
              <th className="py-3 px-2 text-right">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="py-6 text-center">
                  <Loader2 className="inline animate-spin" /> Đang tải…
                </td>
              </tr>
            ) : rows.length ? (
              rows.map((u) => {
                const isLocked = getIsLocked(u);
                return (
                  <tr key={u._id} className="border-b last:border-0">
                    <td className="py-3 px-2 flex items-center gap-2">
                      <UserRound size={16} />{" "}
                      {u.name || u.fullName || "(Chưa đặt tên)"}
                    </td>

                    <td className="py-3 px-2 flex items-center gap-2">
                      <Mail size={16} /> {u.email}
                    </td>

                    <td className="py-3 px-2">{u.role}</td>
                    <td className="py-3 px-2">{u.kycStatus || "-"}</td>

                    <td className="py-3 px-2 flex items-center gap-2">
                      <Calendar size={16} />{" "}
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleString()
                        : "-"}
                    </td>

                    <td className="py-3 px-2">
                      {isLocked ? (
                        <span className="text-danger">Locked</span>
                      ) : (
                        <span className="text-success">Active</span>
                      )}
                    </td>

                    <td className="py-3 px-2 text-right">
                      {isLocked ? (
                        <button
                          type="button"
                          onClick={() => onUnlock(u._id)}
                          className="btn btn-outline inline-flex items-center gap-1"
                        >
                          <ShieldCheck size={16} /> Mở khóa
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onLock(u._id)}
                          className="btn btn-ghost text-danger inline-flex items-center gap-1"
                        >
                          <ShieldBan size={16} /> Khóa
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="py-6 text-center text-[var(--color-muted)]"
                >
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
