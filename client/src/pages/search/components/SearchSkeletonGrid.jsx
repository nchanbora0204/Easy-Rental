export const SearchSkeletonGrid = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="h-48 bg-[var(--color-bg)]" />
          <div className="card-body space-y-3">
            <div className="h-4 bg-[var(--color-bg)] rounded w-3/4" />
            <div className="h-4 bg-[var(--color-bg)] rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};
