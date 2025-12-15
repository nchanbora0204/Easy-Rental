import { Filter, Search } from "lucide-react";
import { STATUS_OPTIONS } from "../constants";

export const BookingsFilters = ({
  q,
  status,
  from,
  to,
  onChangeQ,
  onChangeStatus,
  onChangeFrom,
  onChangeTo,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="card mb-4">
      <div className="card-body grid gap-3 md:grid-cols-5">
        <div className="flex items-center gap-2 md:col-span-2">
          <Search size={18} />
          <input
            className="input w-full"
            placeholder="Tìm theo xe / user / mã đơn…"
            value={q}
            onChange={(e) => onChangeQ(e.target.value)}
          />
        </div>

        <select
          className="select"
          value={status}
          onChange={(e) => onChangeStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="input"
          value={from}
          onChange={(e) => onChangeFrom(e.target.value)}
        />

        <input
          type="date"
          className="input"
          value={to}
          onChange={(e) => onChangeTo(e.target.value)}
        />

        <button className="btn btn-primary md:col-span-1">
          <Filter size={16} /> Lọc
        </button>
      </div>
    </form>
  );
};
