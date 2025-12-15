export const PaymentHeader = ({ shortCode }) => {
  return (
    <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      <div className="section py-6">
        <h1 className="text-3xl font-bold mb-2">Thanh toán đặt xe</h1>
        <p className="text-[var(--color-muted)]">
          Mã đơn hàng:{" "}
          <span className="font-mono font-semibold text-[var(--color-fg)]">
            #{shortCode}
          </span>
        </p>
      </div>
    </div>
  );
};
