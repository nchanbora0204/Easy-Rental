import { SearchSkeletonGrid } from "./SearchSkeletonGrid";
import { SearchEmpty } from "./SearchEmpty";
import { SearchError } from "./SearchError";
import { CarGridCard } from "./CarGridCard";
import { CarListRow } from "./CarListRow";
import { Pagination } from "./Pagination";

export const SearchResults = ({
  loading,
  err,
  cars,
  viewMode,
  onClear,
  page,
  totalPages,
  onChangePage,
}) => {
  if (loading) return <SearchSkeletonGrid />;
  if (err) return <SearchError err={err} />;
  if (!cars?.length) return <SearchEmpty onClear={onClear} />;

  return (
    <div className="space-y-6">
      {viewMode === "list" ? (
        <div className="space-y-4">
          {cars.map((c) => (
            <CarListRow key={c._id || c.id} car={c} />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cars.map((c) => (
            <CarGridCard key={c._id || c.id} car={c} />
          ))}
        </div>
      )}

      <div className="pt-2">
        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={onChangePage}
        />
      </div>
    </div>
  );
};
