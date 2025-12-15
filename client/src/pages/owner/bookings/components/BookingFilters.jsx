import { Search } from "lucide-react";
import { STATUS_OPTIONS } from "../ownerBookings.constants";

export const BookingsFilters = ({
  q,
  status,
  searchRef,
  onChangeQ,
  onChangeStatus,
  onSubmit,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-gray-200 rounded-lg p-4 flex flex-wrap items-center gap-3"
    >
      <div className="flex-1 min-w-[220px] flex items-center gap-2">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          ref={searchRef}
          type="text"
          placeholder="Tìm theo xe, khách hàng, email..."
          className="input flex-1"
          value={q}
          onChange={(e) => onChangeQ(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <select className="select" value={status} onChange={(e) => onChangeStatus(e.target.value)}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">
          Tìm
        </button>
      </div>
    </form>
  );
};
