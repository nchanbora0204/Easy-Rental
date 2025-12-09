import { Star } from "lucide-react";

export default function CarReviews({ reviews, reviewCountHeader }) {
  const hasReviews = reviews.length > 0;
  const noReviews = !hasReviews && reviewCountHeader === 0;

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold mb-3">Đánh giá ({reviewCountHeader})</h2>

      {noReviews ? (
        <p className="text-sm text-gray-500">
          Chưa có đánh giá nào cho xe này.
        </p>
      ) : hasReviews ? (
        <div className="space-y-4">
          {reviews.map((rv) => (
            <div key={rv._id} className="border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3 mb-1">
                <img
                  src={rv.user?.avatar || "/avatar.png"}
                  className="w-8 h-8 rounded-full"
                  alt=""
                />
                <div>
                  <p className="text-sm font-semibold">
                    {rv.user?.name || "Khách hàng"}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-yellow-500">
                    {Array.from({ length: rv.rating }).map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
              {rv.comment && (
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {rv.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          Không tải được danh sách đánh giá. Vui lòng thử lại.
        </p>
      )}
    </section>
  );
}
