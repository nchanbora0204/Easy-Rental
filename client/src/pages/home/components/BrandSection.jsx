import { FadeSection } from "../../../components/common/FadeSection";
import { BRAND_LOGOS } from "../homeConstants";

export const BrandSection = ({
  brandStats,
  loading,
  error,
  onSelectBrand,
}) => {
  return (
    <FadeSection className="section py-12">
      <h2 className="text-2xl font-bold text-center mb-8">
        Chọn xe theo hãng
      </h2>

      {error && (
        <p className="text-center text-sm text-[var(--color-danger)] mb-4">
          {error}
        </p>
      )}

      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
        {loading && !brandStats.length ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="card animate-pulse flex items-center justify-center"
            >
              <div className="card-body">
                <div className="h-8 bg-[var(--color-surface)] rounded" />
              </div>
            </div>
          ))
        ) : brandStats.length ? (
          brandStats.map((b, idx) => {
            const rawName = b.brand || b._id || "Khác";
            const name = rawName.toString().trim();
            const key = name.toUpperCase();
            const logo = BRAND_LOGOS[key] || "/brands/placeholder.png";
            const total = b.totalCars ?? b.count ?? 0;

            return (
              <button
                key={key + idx}
                className="card hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => onSelectBrand(name)}
              >
                <div className="card-body flex flex-col items-center justify-center p-3">
                  <img
                    src={logo}
                    alt={name}
                    className="h-8 w-auto grayscale group-hover:grayscale-0 transition-all mb-1 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/brands/placeholder.png";
                    }}
                  />
                  <span className="text-xs font-semibold mt-1 text-center">
                    {name}
                  </span>
                  <span className="text-[10px] text-[var(--color-muted)]">
                    {total} xe
                  </span>
                </div>
              </button>
            );
          })
        ) : (
          <p className="col-span-full text-center text-sm text-[var(--color-muted)]">
            Hiện chưa có dữ liệu hãng xe.
          </p>
        )}
      </div>
    </FadeSection>
  );
};
