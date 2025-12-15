import { Search } from "lucide-react";
import { STATUS_OPTIONS } from "../constants";

export const CarsFilters = ({
  q,
  status,
  onChangeQ,
  onChangeStatus,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="card mb-4">
      <div className="card-body grid gap-3 md:grid-cols-3">
        <div className="flex items-center gap-2">
          <Search size={18} />
          <input
            className="input w-full"
            placeholder="Tìm theo tên xe / biển số…"
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

        <button className="btn btn-primary">Tìm</button>
      </div>
    </form>
  );
};
