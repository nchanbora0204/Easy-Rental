export const BookingActionsCard = ({ paid, status, onPay, onCancel, onBack }) => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="flex flex-col sm:flex-row gap-3">
          {!paid ? (
            <button type="button" onClick={onPay} className="btn btn-primary flex-1">
              Thanh toán
            </button>
          ) : null}

          {status === "pending" ? (
            <button type="button" onClick={onCancel} className="btn btn-outline flex-1">
              Hủy
            </button>
          ) : null}

          <button type="button" onClick={onBack} className="btn btn-ghost flex-1">
            Về danh sách
          </button>
        </div>
      </div>
    </div>
  );
};
