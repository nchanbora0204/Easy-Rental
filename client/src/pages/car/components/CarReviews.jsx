import { Star } from "lucide-react";

export const CarReviews = ({ reviews = [], reviewCountHeader = 0 }) => {
  const hasReviews = reviews.length > 0;
  const noReviews = !hasReviews && reviewCountHeader === 0;

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold mb-3">Đánh giá ({reviewCountHeader})</h2>

      {noReviews ? (
        <p className="text-sm text-[var(--color-muted)]">Chưa có đánh giá nào cho xe này.</p>
      ) : hasReviews ? (
        <div className="space-y-4">
          {reviews.map((rv) => (
            <div key={rv._id || rv.id} className="border-b border-[var(--color-border)] pb-3">
              <div className="flex items-center gap-3 mb-1">
                <img
                  src={rv.user?.avatar || "/avatar.png"}
                  className="w-8 h-8 rounded-full object-cover"
                  alt=""
                />
                <div>
                  <p className="text-sm font-semibold">{rv.user?.name || "Khách hàng"}</p>
                  <div className="flex items-center gap-1 text-xs text-warning">
                    {Array.from({ length: rv.rating || 0 }).map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>

              {rv.comment ? (
                <p className="text-sm text-[var(--color-muted)] whitespace-pre-line">
                  {rv.comment}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--color-muted)]">
          Không tải được danh sách đánh giá. Vui lòng thử lại.
        </p>
      )}
    </section>
  );
};
