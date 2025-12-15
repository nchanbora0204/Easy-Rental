import React, { useEffect, useMemo, useState } from "react";
import OwnerLayout from "../layout/OwnerLayout";
import {
  CalendarDays,
  AlertCircle,
  Lock,
  Car,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import DayModal from "./components/DayModal";
import {
  fetchOwnerCalendar,
  createCalendarBlock,
  deleteCalendarBlock,
} from "./ownerCalendar.service";
import {
  buildDays,
  buildDayMap,
  buildViewRange,
  fmtDate,
  isToday,
} from "./ownerCalendar.utils";

export const OwnerCalendar = () => {
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

  const viewRange = useMemo(() => buildViewRange(currentMonth), [currentMonth]);
  const days = useMemo(() => buildDays(viewRange), [viewRange]);
  const dayMap = useMemo(() => buildDayMap(events), [events]);

  const monthLabel = useMemo(() => {
    return currentMonth.toLocaleDateString("vi-VN", {
      month: "long",
      year: "numeric",
    });
  }, [currentMonth]);

  const fetchCalendar = async () => {
    setLoading(true);
    setMsg("");
    try {
      const from = fmtDate(viewRange.monthStart);
      const to = fmtDate(viewRange.monthEnd);
      const res = await fetchOwnerCalendar({ from, to });
      setEvents(res);
    } catch (e) {
      setMsg(e?.response?.data?.message || e?.message || "Lỗi tải lịch");
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
    setMsg("");

    try {
      if (selected.block) {
        await deleteCalendarBlock(selected.block._id);

        setEvents((prev) => ({
          ...prev,
          blocks: prev.blocks.filter((b) => b._id !== selected.block._id),
        }));
        setSelected((s) => (s ? { ...s, block: null } : s));
      } else {
        const blk = await createCalendarBlock({
          date: selected.dateStr,
          reason: blockReason,
        });

        if (blk) {
          setEvents((prev) => ({ ...prev, blocks: [...prev.blocks, blk] }));
          setSelected((s) => (s ? { ...s, block: blk } : s));
        }
      }
    } catch (e) {
      setMsg(e?.response?.data?.message || e?.message || "Lỗi cập nhật block");
    } finally {
      setBlockBusy(false);
    }
  };

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
                  const cell = dayMap[dateStr] || { bookings: [], block: null };

                  const isCurMonth = day.getMonth() === currentMonth.getMonth();
                  const today = isToday(day);

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
                        ${today ? "ring-2 ring-blue-600 ring-offset-2" : ""}
                      `}
                    >
                      <div className="font-semibold text-sm mb-1">
                        <span
                          className={today ? "text-blue-600" : "text-gray-700"}
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
};

export default OwnerCalendar;
