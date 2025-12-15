import { Search } from "lucide-react";

export const SearchEmpty = ({ onClear }) => {
  return (
    <div className="card">
      <div className="card-body text-center py-16">
        <div className="w-20 h-20 bg-[var(--color-surface)] rounded-full flex items-center justify-center mx-auto mb-4">
          <Search size={40} className="text-[var(--color-muted)]" />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          Không tìm thấy xe phù hợp
        </h3>
        <p className="text-[var(--color-muted)] mb-6">
          Thử điều chỉnh bộ lọc hoặc tìm kiếm với điều kiện khác
        </p>
        <button type="button" onClick={onClear} className="btn btn-primary">
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
};
