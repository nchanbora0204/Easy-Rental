export const StatusError = ({ err, onRetry }) => {
  return (
    <div className="card mb-4 border border-red-200 bg-red-50">
      <div className="card-body">
        <div className="font-semibold text-danger mb-2">Lỗi</div>
        <div className="text-[var(--color-muted)] mb-3">
          {err?.response?.data?.message || err?.message}
        </div>
        <button className="btn btn-primary" onClick={onRetry}>
          Thử lại
        </button>
      </div>
    </div>
  );
};
