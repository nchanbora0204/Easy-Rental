import { useEffect, useMemo, useState } from "react";
import api from "../../lib/axios";
import OwnerLayout from "./OwnerLayout";
import {
  CalendarDays,
  AlertCircle,
  Lock,
  Unlock,
  X,
  Car,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const msPerDay = 24 * 60 * 60 * 1000;

function fmtDate(d) {
  return d.toISOString().slice(0, 10);
}

export default function OwnerCalendar() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [events, setEvents] = useState({ bookings: [], blocks: [] });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [selected, setSelected] = useState(null);
  const [blockReason, setBlockReason] = useState("");
  const [blockBusy, setBlockBusy] = useState(false);

  // Tính range của view calendar
  const viewRange = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    const start = new Date(startOfMonth);
    const day = start.getDay() || 7;
    start.setDate(start.getDate() - (day - 1));
    start.setHours(0, 0, 0, 0);

    const end = new Date(endOfMonth);
    const endDay = end.getDay() || 7;
    end.setDate(end.getDate() + (7 - endDay));
    end.setHours(23, 59, 59, 999);

    return { start, end, monthStart: startOfMonth, monthEnd: endOfMonth };
  }, [currentMonth]);

  // Sinh mảng ngày
  const days = useMemo(() => {
    const arr = [];
    const d = new Date(viewRange.start);
    while (d.getTime() <= viewRange.end.getTime()) {
      arr.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return arr;
  }, [viewRange]);

  // Map theo dateStr
  const dayMap = useMemo(() => {
    const map = {};

    events.bookings.forEach((b) => {
      if (!b.pickupDate || !b.returnDate) return;
      const start = new Date(b.pickupDate);
      const end = new Date(b.returnDate);

      let cur = new Date(start);
      cur.setHours(0, 0, 0, 0);

      const last = new Date(end);
      last.setHours(0, 0, 0, 0);

      while (cur.getTime() <= last.getTime()) {
        const key = fmtDate(cur);
        if (!map[key]) map[key] = { bookings: [], block: null };
        map[key].bookings.push(b);
        cur = new Date(cur.getTime() + msPerDay);
      }
    });

    events.blocks.forEach((blk) => {
      const d = new Date(blk.date);
      const key = fmtDate(d);
      if (!map[key]) map[key] = { bookings: [], block: blk };
      else map[key].block = blk;
    });

    return map;
  }, [events]);

  const fetchCalendar = async () => {
    setLoading(true);
    setMsg("");
    try {
      const from = fmtDate(viewRange.monthStart);
      const to = fmtDate(viewRange.monthEnd);

      const { data } = await api.get("/owner/calendar", {
        params: { from, to },
      });
      const d = data?.data || {};
      setEvents({
        bookings: d.bookings || [],
        blocks: d.blocks || [],
      });
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth]);

  const openDay = (day) => {
    const dateStr = fmtDate(day);
    const cell = dayMap[dateStr] || { bookings: [], block: null };
    setSelected({
      day,
      dateStr,
      block: cell.block,
      bookings: cell.bookings,
    });
    setBlockReason(cell.block?.reason || "");
  };

  const closeDay = () => {
    setSelected(null);
    setBlockReason("");
  };

  const toggleBlock = async () => {
    if (!selected) return;
    setBlockBusy(true);
    try {
      if (selected.block) {
        await api.delete(`/owner/calendar/blocks/${selected.block._id}`);
        setEvents((prev) => ({
          ...prev,
          blocks: prev.blocks.filter((b) => b._id !== selected.block._id),
        }));
        setSelected((s) => (s ? { ...s, block: null } : s));
      } else {
        const { data } = await api.post("/owner/calendar/blocks", {
          date: selected.dateStr,
          reason: blockReason,
        });
        const blk = data?.data;
        if (blk) {
          setEvents((prev) => ({
            ...prev,
            blocks: [...prev.blocks, blk],
          }));
          setSelected((s) => (s ? { ...s, block: blk } : s));
        }
      }
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    } finally {
      setBlockBusy(false);
    }
  };

  const monthLabel = useMemo(() => {
    return currentMonth.toLocaleDateString("vi-VN", {
      month: "long",
      year: "numeric",
    });
  }, [currentMonth]);

  const goPrevMonth = () => {
    setCurrentMonth((d) => {
      const nd = new Date(d);
      nd.setMonth(nd.getMonth() - 1);
      return nd;
    });
  };

  const goNextMonth = () => {
    setCurrentMonth((d) => {
      const nd = new Date(d);
      nd.setMonth(nd.getMonth() + 1);
      return nd;
    });
  };

  const goToday = () => {
    const t = new Date();
    t.setDate(1);
    t.setHours(0, 0, 0, 0);
    setCurrentMonth(t);
  };

  return (
    <OwnerLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <CalendarDays className="text-blue-600" size={28} />
              Lịch xe
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Xem lịch đặt xe và quản lý ngày cho thuê
            </p>
          </div>

          <button
            type="button"
            onClick={goToday}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Hôm nay
          </button>
        </div>

        {/* Thông báo lỗi */}
        {msg && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle
              size={20}
              className="text-red-600 flex-shrink-0 mt-0.5"
            />
            <span className="text-sm text-red-700">{msg}</span>
          </div>
        )}

        {/* Calendar Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Calendar Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={goPrevMonth}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-700" />
              </button>

              <h2 className="text-lg font-semibold text-gray-800 capitalize">
                {monthLabel}
              </h2>

              <button
                type="button"
                onClick={goNextMonth}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronRight size={20} className="text-gray-700" />
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-white border-2 border-gray-300" />
              <span className="text-gray-600">Trống</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-300" />
              <span className="text-gray-600">Có đơn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-100 border-2 border-red-300" />
              <span className="text-gray-600">Đã chặn</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-2">
              {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-gray-600 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {loading ? (
              <div className="py-20 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600" />
                <p className="mt-4 text-sm text-gray-600">Đang tải...</p>
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-2">
                {days.map((day) => {
                  const dateStr = fmtDate(day);
                  const cell = dayMap[dateStr] || {
                    bookings: [],
                    block: null,
                  };
                  const isCurMonth = day.getMonth() === currentMonth.getMonth();
                  const today = new Date();
                  const isToday =
                    today.getFullYear() === day.getFullYear() &&
                    today.getMonth() === day.getMonth() &&
                    today.getDate() === day.getDate();

                  const hasBlock = !!cell.block;
                  const hasBookings = cell.bookings.length > 0;

                  let bgClass =
                    "bg-white border-2 border-gray-200 hover:border-gray-300";
                  if (hasBlock) {
                    bgClass =
                      "bg-red-50 border-2 border-red-300 hover:border-red-400";
                  } else if (hasBookings) {
                    bgClass =
                      "bg-blue-50 border-2 border-blue-300 hover:border-blue-400";
                  }

                  return (
                    <button
                      type="button"
                      key={dateStr}
                      onClick={() => openDay(day)}
                      className={`
                        min-h-[100px] rounded-lg p-2 text-left flex flex-col
                        transition-all ${bgClass}
                        ${!isCurMonth ? "opacity-40" : ""}
                        ${isToday ? "ring-2 ring-blue-600 ring-offset-2" : ""}
                      `}
                    >
                      <div className="font-semibold text-sm mb-1">
                        <span
                          className={
                            isToday ? "text-blue-600" : "text-gray-700"
                          }
                        >
                          {day.getDate()}
                        </span>
                      </div>

                      <div className="space-y-1 flex-1">
                        {hasBookings && (
                          <div className="text-xs bg-blue-600 text-white px-2 py-1 rounded flex items-center gap-1">
                            <Car size={12} />
                            <span>{cell.bookings.length}</span>
                          </div>
                        )}
                        {hasBlock && (
                          <div className="text-xs bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1">
                            <Lock size={12} />
                            <span>Chặn</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {selected && (
          <DayModal
            selected={selected}
            onClose={closeDay}
            blockReason={blockReason}
            setBlockReason={setBlockReason}
            onToggleBlock={toggleBlock}
            blockBusy={blockBusy}
          />
        )}
      </div>
    </OwnerLayout>
  );
}

function DayModal({
  selected,
  onClose,
  blockReason,
  setBlockReason,
  onToggleBlock,
  blockBusy,
}) {
  const d = selected.day;
  const dateLabel = d.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hasBlock = !!selected.block;
  const hasBookings = selected.bookings.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div>
            <h3 className="font-semibold text-gray-800 capitalize">
              {dateLabel}
            </h3>
            <div className="mt-1">
              {hasBlock ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                  <Lock size={14} />
                  Đã chặn
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  <Unlock size={14} />
                  Đang mở
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Lý do chặn */}
          {hasBlock && selected.block?.reason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">
                <strong>Lý do chặn:</strong> {selected.block.reason}
              </p>
            </div>
          )}

          {/* Danh sách booking */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
              <span>Đơn thuê trong ngày</span>
              <span className="text-sm font-normal text-gray-500">
                {selected.bookings.length} đơn
              </span>
            </h4>

            {hasBookings ? (
              <div className="space-y-3">
                {selected.bookings.map((b) => (
                  <div
                    key={b._id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Car size={18} className="text-blue-600" />
                        <span className="font-semibold text-gray-800">
                          {b.car?.brand} {b.car?.model}
                        </span>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <UserIcon size={16} />
                        <span>{b.user?.name || b.user?.email || "Khách"}</span>
                      </div>
                      <div className="text-xs bg-gray-50 rounded p-2">
                        <div>
                          <strong>Nhận:</strong>{" "}
                          {b.pickupDate
                            ? new Date(b.pickupDate).toLocaleString("vi-VN")
                            : "-"}
                        </div>
                        <div>
                          <strong>Trả:</strong>{" "}
                          {b.returnDate
                            ? new Date(b.returnDate).toLocaleString("vi-VN")
                            : "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                Không có đơn thuê nào
              </div>
            )}
          </div>

          {/* Form chặn/mở ngày */}
          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lý do chặn ngày (tùy chọn)
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              rows={3}
              placeholder="Ví dụ: Bảo dưỡng xe, đi công tác..."
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onToggleBlock}
            disabled={blockBusy}
            className={`
              w-full py-3 rounded-lg font-medium transition-colors
              ${
                hasBlock
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }
              ${blockBusy ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {blockBusy
              ? "Đang xử lý..."
              : hasBlock
              ? "Mở lại ngày cho thuê"
              : "Chặn ngày này"}
          </button>
          <p className="text-xs text-gray-500 text-center mt-3">
            {hasBlock
              ? "Mở lại để cho phép khách đặt xe vào ngày này"
              : "Chặn ngày sẽ không cho phép đơn mới, đơn cũ vẫn giữ nguyên"}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const statusConfig = {
    pending: { label: "Chờ xác nhận", color: "bg-amber-100 text-amber-700" },
    confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-700" },
    ongoing: { label: "Đang thuê", color: "bg-green-100 text-green-700" },
    completed: { label: "Hoàn thành", color: "bg-gray-100 text-gray-700" },
    cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700" },
    cancelled_timeout: { label: "Hết hạn", color: "bg-gray-100 text-gray-600" },
  };

  const config = statusConfig[status] || {
    label: status || "-",
    color: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.label}
    </span>
  );
}
