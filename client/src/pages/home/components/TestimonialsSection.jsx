import { Star } from "lucide-react";
import { FadeSection } from "../../../components/common/FadeSection";

export const TestimonialsSection = ({ testimonials, loading, error }) => {
  return (
    <FadeSection className="section py-12">
      <h2 className="text-2xl font-bold text-center mb-8">
        Đánh giá khách hàng
      </h2>

      {error && (
        <p className="text-center text-sm text-[var(--color-danger)] mb-4">
          {error}
        </p>
      )}

      {loading && !testimonials.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="card animate-pulse hover:shadow-lg transition-shadow"
            >
              <div className="card-body">
                <div className="h-4 w-24 bg-[var(--color-surface)] rounded mb-3" />
                <div className="h-10 w-full bg-[var(--color-surface)] rounded mb-4" />
                <div className="flex items-center gap-3 pt-3 border-t border-[var(--color-border)]">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-surface)]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 bg-[var(--color-surface)] rounded" />
                    <div className="h-3 w-16 bg-[var(--color-surface)] rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {testimonials.length ? (
            testimonials.map((t) => {
              const id = t._id || t.id;
              const rating = t.rating || t.stars || 5;
              const name =
                t.user?.name || t.userName || "Khách hàng ẩn danh";
              const avatar =
                t.user?.avatarUrl ||
                t.user?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  name
                )}`;
              const text = t.comment || t.text || "";
              const date = t.createdAt
                ? new Date(t.createdAt).toLocaleDateString("vi-VN")
                : t.date || "";

              return (
                <div
                  key={id}
                  className="card hover:shadow-lg transition-shadow"
                >
                  <div className="card-body">
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: rating }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className="text-warning"
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-[var(--color-muted)] mb-4 line-clamp-3">
                      {text}
                    </p>
                    <div className="flex items-center gap-3 pt-3 border-t border-[var(--color-border)]">
                      <img
                        src={avatar}
                        alt={name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {name}
                        </p>
                        {date && (
                          <p className="text-xs text-[var(--color-muted)]">
                            {date}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="col-span-full text-center text-sm text-[var(--color-muted)]">
              Hiện chưa có đánh giá nào.
            </p>
          )}
        </div>
      )}
    </FadeSection>
  );
};
