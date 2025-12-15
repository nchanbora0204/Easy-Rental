export const BookingDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="section py-6">
          <div className="h-5 w-24 bg-[var(--color-border)]/40 rounded mb-3 animate-pulse" />
          <div className="h-8 w-64 bg-[var(--color-border)]/40 rounded animate-pulse" />
          <div className="h-4 w-80 bg-[var(--color-border)]/30 rounded mt-2 animate-pulse" />
        </div>
      </div>

      <div className="section py-8 space-y-4">
        <div className="h-20 rounded-[var(--radius-lg)] bg-[var(--color-surface)] animate-pulse" />
        <div className="h-64 rounded-[var(--radius-lg)] bg-[var(--color-surface)] animate-pulse" />
        <div className="h-24 rounded-[var(--radius-lg)] bg-[var(--color-surface)] animate-pulse" />
      </div>
    </div>
  );
};
