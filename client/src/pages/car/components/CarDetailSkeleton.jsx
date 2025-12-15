export const CarDetailSkeleton = () => {
  return (
    <div className="section py-8">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card animate-pulse">
            <div className="h-96 bg-[var(--color-surface)]" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-24 bg-[var(--color-surface)] rounded-[var(--radius-md)]"
              />
            ))}
          </div>
        </div>
        <div className="card animate-pulse h-[600px]" />
      </div>
    </div>
  );
};
