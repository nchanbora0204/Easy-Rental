import { FadeSection } from "../../../components/common/FadeSection";
import { CITY_META } from "../homeConstants";

export const CitySection = ({
  cityStatsMap,
  loading,
  error,
  hasCityStats,
  onSelectCity,
}) => {
  return (
    <FadeSection className="section py-12">
      <h2 className="text-2xl font-bold text-center mb-8">
        Địa điểm nổi bật
      </h2>
      {error && (
        <p className="text-center text-sm text-[var(--color-danger)] mb-4">
          {error}
        </p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {loading && !hasCityStats
          ? Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="card overflow-hidden animate-pulse">
                <div className="h-32 bg-[var(--color-surface)]" />
              </div>
            ))
          : CITY_META.map((meta) => {
              const total = cityStatsMap.get(meta.slug) || 0;

              return (
                <button
                  key={meta.slug}
                  className="card overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group text-left"
                  onClick={() => onSelectCity(meta.slug)}
                >
                  <div className="relative h-32">
                    <img
                      src={meta.image}
                      alt={meta.label}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="card-body text-center py-4">
                    <h3 className="font-bold text-lg mb-1">{meta.label}</h3>
                    <p className="text-primary font-medium text-sm">
                      {total ? `${total}+ xe` : "0 xe"}
                    </p>
                  </div>
                </button>
              );
            })}
      </div>
    </FadeSection>
  );
};
