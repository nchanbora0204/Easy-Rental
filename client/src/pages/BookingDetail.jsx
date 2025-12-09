import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/axios";
import {
  Car,
  Calendar,
  DollarSign,
  MapPin,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

const StatusCard = ({ status }) => {
  const config = {
    pending: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
      icon: AlertCircle,
      label: "Chờ thanh toán",
    },
    confirmed: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      icon: CheckCircle,
      label: "Đã xác nhận",
    },
    ongoing: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      icon: Clock,
      label: "Đang thuê",
    },
    completed: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      icon: CheckCircle,
      label: "Hoàn thành",
    },
    cancelled: {
      bg: "bg-gray-50",
      border: "border-gray-200",
      text: "text-gray-700",
      icon: XCircle,
      label: "Đã hủy",
    },
  };

  const style = config[status] || config.pending;
  const Icon = style.icon;

  return (
    <div
      className={`${style.bg} ${style.border} border-2 rounded-xl p-4 flex items-center gap-3`}
    >
      <Icon className={style.text} size={24} />
      <div>
        <div className="text-sm text-gray-600">Trạng thái</div>
        <div className={`font-semibold ${style.text}`}>{style.label}</div>
      </div>
    </div>
  );
};

export default function BookingDetail() {
  const { bookingId } = useParams();
  const nav = useNavigate();
  const [bk, setBk] = useState(null);
  const [err, setErr] = useState("");

  const paid = useMemo(
    () => bk && ["confirmed", "ongoing", "completed"].includes(bk.status),
    [bk]
  );

  useEffect(() => {
    const run = async () => {
      try {
        const { data } = await api.get(`/bookings/${bookingId}`);
        setBk(data?.data || null);
        setErr("");
      } catch (e) {
        setErr(e?.response?.data?.message || e.message || "Không tải được đơn");
      }
    };
    run();
  }, [bookingId]);

  const cancel = async () => {
    if (!confirm("Hủy đơn này?")) return;
    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      const { data } = await api.get(`/bookings/${bookingId}`);
      setBk(data?.data || null);
    } catch (e) {
      alert(e?.response?.data?.message || "Hủy thất bại");
    }
  };

  if (err) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <XCircle className="mx-auto text-red-500 mb-3" size={48} />
            <p className="text-red-700 font-medium">{err}</p>
            <button
              onClick={() => nav("/bookings")}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!bk) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => nav("/bookings")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Quay lại</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Chi tiết đơn #{bookingId?.slice(-6)?.toUpperCase()}
          </h1>
        </div>

        {/* Status Card */}
        <div className="mb-6">
          <StatusCard status={bk.status} />
        </div>

        {/* Main Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center gap-3">
              <Car size={32} />
              <div>
                <h2 className="text-2xl font-bold">
                  {bk.car?.brand} {bk.car?.model}
                </h2>
                <p className="text-blue-100 text-sm">
                  {bk.car?.location?.city || "Không rõ địa điểm"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Date Info */}
            <div className="flex items-start gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <Calendar
                size={20}
                className="text-blue-600 mt-0.5 flex-shrink-0"
              />
              <div className="flex-1">
                <div className="text-sm text-gray-600 mb-1">Thời gian thuê</div>
                <div className="font-medium text-gray-800">
                  {new Date(bk.pickupDate).toLocaleString("vi-VN")}
                  <span className="mx-2 text-gray-400">→</span>
                  {new Date(bk.returnDate).toLocaleString("vi-VN")}
                </div>
              </div>
            </div>

            {/* Location Info */}
            {bk.car?.location && (
              <div className="flex items-start gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <MapPin
                  size={20}
                  className="text-blue-600 mt-0.5 flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="text-sm text-gray-600 mb-1">Địa điểm</div>
                  <div className="font-medium text-gray-800">
                    {bk.car.location.city}
                    {bk.car.location.address && ` - ${bk.car.location.address}`}
                  </div>
                </div>
              </div>
            )}

            {/* Price Info */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <DollarSign
                size={20}
                className="text-blue-600 mt-0.5 flex-shrink-0"
              />
              <div className="flex-1">
                <div className="text-sm text-blue-700 mb-1">Tổng chi phí</div>
                <div className="text-2xl font-bold text-blue-600">
                  {Number(bk.total).toLocaleString()} đ
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {!paid && (
              <button
                onClick={() => nav(`/pay/${bk._id}`)}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Thanh toán
              </button>
            )}

            {bk.status === "pending" && (
              <button
                onClick={cancel}
                className="flex-1 border-2 border-red-300 text-red-600 px-6 py-3 rounded-xl font-medium hover:bg-red-50 transition-colors"
              >
                Hủy
              </button>
            )}

            <button
              onClick={() => nav("/bookings")}
              className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Về danh sách
            </button>
          </div>
        </div>

        {/* Warning for pending status */}
        {bk.status === "pending" && (
          <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4 flex gap-3">
            <AlertCircle className="text-orange-600 flex-shrink-0" size={20} />
            <div className="text-sm text-orange-800">
              <p className="font-medium mb-1">Vui lòng hoàn tất thanh toán</p>
              <p>Đơn của bạn sẽ tự động hủy sau 24 giờ nếu chưa thanh toán.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
