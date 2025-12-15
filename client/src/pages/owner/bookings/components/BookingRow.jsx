import { Calendar, Clock, MapPin, User as UserIcon, Car as CarIcon, Loader2 } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { buildActionList, fmtDateTimeVI, fmtDateVI, fmtMoneyVI, fmtTimeVI, pickCarUser } from "../ownerBookings.utils";

export const BookingRow = ({ booking, actionKey, onChangeStatus }) => {
  const { carData, userData, carName, userName, location } = pickCarUser(booking);

  const actions = buildActionList(booking.status);

  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50">
      <td className="px-4 py-3 align-top">
        <div className="font-semibold flex items-center gap-2">
          <CarIcon className="w-4 h-4 text-blue-500" />
          {carName}
        </div>
        {location && (
          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" />
            {location}
          </div>
        )}
      </td>

      <td className="px-4 py-3 align-top">
        <div className="flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{userName}</span>
        </div>
        {userData?.phone && <div className="text-xs text-gray-500 mt-1">{userData.phone}</div>}
      </td>

      <td className="px-4 py-3 align-top">
        <div className="flex items-start gap-2 text-xs text-gray-600">
          <Calendar className="w-3 h-3 mt-0.5" />
          <div>
            <div>
              Nhận: {fmtDateVI(booking.pickupDate)} {fmtTimeVI(booking.pickupDate)}
            </div>
            <div>
              Trả: {fmtDateVI(booking.returnDate)} {fmtTimeVI(booking.returnDate)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <Clock className="w-3 h-3" />
          {booking.days || 0} ngày
        </div>
      </td>

      <td className="px-4 py-3 align-top text-right">
        <div className="font-semibold text-gray-900">{fmtMoneyVI(booking.total)}đ</div>
        <div className="text-xs text-gray-500">{booking.currency || "VND"}</div>
        <div className="text-[10px] text-gray-400 mt-1">Tạo lúc: {fmtDateTimeVI(booking.createdAt)}</div>
      </td>

      <td className="px-4 py-3 align-top text-center">
        <StatusBadge status={booking.status} />
      </td>

      <td className="px-4 py-3 align-top text-center">
        {actions.length === 0 ? (
          <span className="text-xs text-gray-400">—</span>
        ) : (
          <div className="flex flex-wrap gap-1 justify-center">
            {actions.map((a) => {
              const key = `${booking._id}:${a.to}`;
              const loading = actionKey === key;
              return (
                <button
                  key={a.to}
                  type="button"
                  className={`btn btn-xs ${a.style}`}
                  onClick={() => onChangeStatus(booking._id, a.to)}
                  disabled={loading}
                >
                  {loading && (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin inline-block" />
                  )}
                  {a.label}
                </button>
              );
            })}
          </div>
        )}
      </td>
    </tr>
  );
};
