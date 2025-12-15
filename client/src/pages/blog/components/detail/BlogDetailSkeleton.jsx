export const BlogDetailSkeleton = () => {
  return (
    <div className="card animate-pulse">
      <div className="h-56 bg-[var(--color-surface)] rounded-t-[var(--radius-lg)]" />
      <div className="card-body">
        <div className="h-5 w-32 bg-[var(--color-surface)] rounded mb-3" />
        <div className="h-7 w-3/4 bg-[var(--color-surface)] rounded mb-3" />
        <div className="h-3 w-1/2 bg-[var(--color-surface)] rounded mb-6" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-[var(--color-surface)] rounded" />
          <div className="h-3 w-5/6 bg-[var(--color-surface)] rounded" />
          <div className="h-3 w-4/6 bg-[var(--color-surface)] rounded" />
        </div>
      </div>
    </div>
  );
};

export default BlogDetailSkeleton;
