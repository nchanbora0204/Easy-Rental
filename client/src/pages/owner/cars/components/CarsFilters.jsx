import { Search } from "lucide-react";

export const CarsFilters = ({
  q,
  status,
  onQChange,
  onStatusChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="card mb-6 shadow-sm">
      <div className="card-body">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              className="input w-full pl-10"
              placeholder="Tìm theo tên xe hoặc biển số..."
              value={q}
              onChange={(e) => onQChange(e.target.value)}
            />
          </div>

          <select
            className="select min-w-[160px]"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang cho thuê</option>
            <option value="unavailable">Tạm ngừng</option>
            <option value="removed">Đã gỡ</option>
          </select>

          <button className="btn btn-primary whitespace-nowrap">Tìm kiếm</button>
        </div>
      </div>
    </form>
  );
};
