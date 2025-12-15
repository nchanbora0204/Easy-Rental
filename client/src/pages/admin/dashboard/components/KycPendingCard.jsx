import { ShieldCheck, CheckCircle2, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const KycPendingCard = ({ kycList, onApprove, onReject }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-gray-600" size={20} />
          <h2 className="font-semibold text-gray-800">KYC chờ duyệt</h2>
        </div>
        <Link
          to="/admin/kyc"
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Xem tất cả →
        </Link>
      </div>

      <div className="p-6">
        {kycList.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Không có yêu cầu nào</p>
        ) : (
          <div className="space-y-3">
            {kycList.slice(0, 5).map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {user.kycProfile?.fullName || "Chưa có tên"}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onApprove(user._id)}
                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                  >
                    <CheckCircle2 size={18} />
                  </button>
                  <button
                    onClick={() => onReject(user._id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
