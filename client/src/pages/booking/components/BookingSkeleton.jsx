export const BookingSkeleton = () => {
  return (
    <div className="section py-8">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card animate-pulse h-40" />
          <div className="card animate-pulse h-96" />
        </div>
        <div className="card animate-pulse h-[500px]" />
      </div>
    </div>
  );
};
