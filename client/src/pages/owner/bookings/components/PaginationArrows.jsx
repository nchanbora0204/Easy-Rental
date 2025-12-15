export const PaginationArrows = ({ page, pages, onPrev, onNext }) => {
  if (!pages || pages <= 1) return null;

  return (
    <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between text-sm">
      <span className="text-gray-500">
        Trang {page}/{pages}
      </span>
      <div className="flex items-center gap-2">
        <button className="btn btn-xs" disabled={page <= 1} onClick={onPrev}>
          ← Trước
        </button>
        <button className="btn btn-xs" disabled={page >= pages} onClick={onNext}>
          Sau →
        </button>
      </div>
    </div>
  );
};
