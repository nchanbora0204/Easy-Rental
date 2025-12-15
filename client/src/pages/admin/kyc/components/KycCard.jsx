import { ImageIcon, Check, X, Loader2 } from "lucide-react";
import { buildDocUrls, formatCreatedAt, pickFirst } from "../utils";

export const KycCard = ({
  u,
  busy,
  rejectReason,
  onChangeRejectReason,
  onApprove,
  onReject,
  onRefresh,
  onOpenImage,
}) => {
  const profile = u.kycProfile || u.profile || u;

  const docUrls = buildDocUrls(profile);

  const phone = pickFirst(
    profile?.phone,
    u?.phone,
    profile?.mobile,
    u?.mobile,
    u?.contactPhone
  );
  const address = pickFirst(
    profile?.address,
    u?.address,
    u?.location?.address,
    profile?.location?.address
  );
  const city = pickFirst(
    profile?.city,
    profile?.cityName,
    u?.city,
    u?.location?.city,
    profile?.location?.city
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">
              {pickFirst(profile?.fullName, u?.name, u?.email) || "Chưa có tên"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{u?.email}</p>
            <p className="text-xs text-gray-500 mt-1 font-mono bg-white/50 inline-block px-2 py-0.5 rounded">
              ID: {u._id}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">
              ⏳ Chờ duyệt
            </span>
            {u?.createdAt && (
              <p className="text-xs text-gray-500">
                {formatCreatedAt(u.createdAt)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* LEFT COLUMN - User Information */}
        <div className="space-y-6">
          {/* Personal Info Section */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-blue-600 rounded"></div>
              Thông tin cá nhân
            </h4>
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <div className="flex">
                <span className="text-sm text-gray-600 w-32 flex-shrink-0 font-medium">
                  Họ và tên:
                </span>
                <span className="text-sm text-gray-900 font-semibold">
                  {profile?.fullName || "—"}
                </span>
              </div>
              <div className="flex">
                <span className="text-sm text-gray-600 w-32 flex-shrink-0 font-medium">
                  Số điện thoại:
                </span>
                <span className="text-sm text-gray-900 font-semibold">
                  {phone || "—"}
                </span>
              </div>
              <div className="flex">
                <span className="text-sm text-gray-600 w-32 flex-shrink-0 font-medium">
                  Email:
                </span>
                <span className="text-sm text-gray-900 break-all">
                  {u?.email || "—"}
                </span>
              </div>
              <div className="flex">
                <span className="text-sm text-gray-600 w-32 flex-shrink-0 font-medium">
                  Địa chỉ:
                </span>
                <span className="text-sm text-gray-900">{address || "—"}</span>
              </div>
              <div className="flex">
                <span className="text-sm text-gray-600 w-32 flex-shrink-0 font-medium">
                  Thành phố:
                </span>
                <span className="text-sm text-gray-900 font-semibold">
                  {city || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Note Section */}
          {profile?.note && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
              <p className="text-xs font-semibold text-amber-900 uppercase mb-1">
                Ghi chú từ tài xế
              </p>
              <p className="text-sm text-amber-900">{profile.note}</p>
            </div>
          )}

          {/* Reject Reason Input */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-red-600 rounded"></div>
              Lý do từ chối
            </h4>
            <textarea
              placeholder="Nhập lý do từ chối nếu bạn quyết định không duyệt hồ sơ này..."
              value={rejectReason}
              onChange={(e) => onChangeRejectReason(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              * Bắt buộc nhập khi từ chối hồ sơ
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onApprove}
              disabled={busy}
            >
              {busy ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Check className="w-5 h-5" />
              )}
              Phê duyệt hồ sơ
            </button>

            <button
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onReject}
              disabled={busy}
            >
              {busy ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <X className="w-5 h-5" />
              )}
              Từ chối hồ sơ
            </button>

            <button
              className="w-full px-5 py-2.5 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onRefresh}
              disabled={busy}
            >
              🔄 Làm mới
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN - Documents Gallery */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-purple-600 rounded"></div>
            Tài liệu đính kèm
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {docUrls.map((d) => (
              <div key={d.key} className="group">
                <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  {d.label}
                </div>
                {d.url ? (
                  <div className="relative overflow-hidden rounded-lg border-2 border-gray-200">
                    <img
                      src={d.url}
                      alt={d.label}
                      className="w-full h-40 object-cover cursor-pointer"
                      onClick={() => onOpenImage(d.url)}
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                    <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500 font-medium">
                      Chưa tải lên
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
