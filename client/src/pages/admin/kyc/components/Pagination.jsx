export const Pagination = ({ page, totalPages, onPrev, onNext }) => (
  <div className="flex items-center justify-end gap-3 text-sm text-gray-600">
    <button
      className="px-3 py-1 border rounded disabled:opacity-40"
      onClick={onPrev}
      disabled={page === 1}
    >
      ← Trang trước
    </button>
    <span>
      Trang <strong>{page}</strong> / {totalPages}
    </span>
    <button
      className="px-3 py-1 border rounded disabled:opacity-40"
      onClick={onNext}
      disabled={page === totalPages}
    >
      Trang sau →
    </button>
  </div>
);
