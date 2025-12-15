import { Search } from "lucide-react";
import { ROLES } from "../constants";

export const UsersFilters = ({
  q,
  role,
  onChangeQ,
  onChangeRole,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="card mb-4">
      <div className="card-body grid gap-3 md:grid-cols-3">
        <div className="flex items-center gap-2">
          <Search size={18} />
          <input
            className="input w-full"
            placeholder="Tìm tên / email…"
            value={q}
            onChange={(e) => onChangeQ(e.target.value)}
          />
        </div>

        <select
          className="select"
          value={role}
          onChange={(e) => onChangeRole(e.target.value)}
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>

        <button className="btn btn-primary">Tìm</button>
      </div>
    </form>
  );
};
