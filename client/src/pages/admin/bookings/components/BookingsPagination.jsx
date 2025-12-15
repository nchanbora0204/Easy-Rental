export const BookingsPagination = ({ page, total, limit, onPrev, onNext }) => {
  const hasNext = page * limit < total;
  const totalPages = total ? Math.ceil(total / limit) : 1;

  return (
    <div className="px-4 py-3 border-t flex items-center justify-between">
      <button disabled={page <= 1} onClick={onPrev} className="btn btn-ghost">
        ← Trước
      </button>

      <div className="text-sm text-[var(--color-muted)]">
        Trang {page} / {totalPages}
      </div>

      <button disabled={!hasNext} onClick={onNext} className="btn btn-ghost">
        Sau →
      </button>
    </div>
  );
};
