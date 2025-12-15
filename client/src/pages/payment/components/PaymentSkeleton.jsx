export const PaymentSkeleton = () => {
  return (
    <div className="section py-8">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card animate-pulse h-48" />
          <div className="card animate-pulse h-64" />
        </div>
        <div className="card animate-pulse h-96" />
      </div>
    </div>
  );
};
