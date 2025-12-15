import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination = ({ page, limit, total, pageCount, onPrev, onNext }) => {
  if (!(total > 0)) return null;

  return (
    <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
      <p className="text-sm text-gray-600">
        Hiển thị <span className="font-medium">{(page - 1) * limit + 1}</span> -{" "}
        <span className="font-medium">{Math.min(page * limit, total)}</span>{" "}
        trong tổng số <span className="font-medium">{total}</span> xe
      </p>

      <div className="flex items-center gap-2">
        <button
          disabled={page <= 1}
          onClick={onPrev}
          className="btn btn-ghost inline-flex items-center gap-1 disabled:opacity-40"
        >
          <ChevronLeft size={16} /> Trước
        </button>

        <span className="text-sm text-gray-600 px-3">
          Trang {page} / {pageCount}
        </span>

        <button
          disabled={page >= pageCount}
          onClick={onNext}
          className="btn btn-ghost inline-flex items-center gap-1 disabled:opacity-40"
        >
          Sau <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
