import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { Star, ArrowLeft, AlertCircle, Check } from "lucide-react";
import api from "../lib/axios";

export default function AddReview() {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [carName, setCarName] = useState(location.state?.carName || "");
  const [carId, setCarId] = useState(location.state?.carId || "");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [existingReview, setExistingReview] = useState(null);

  // Load thông tin booking + review hiện tại (nếu có)
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        let currentCarId = carId;
        let currentCarName = carName;

        // Nếu chưa có carId (vào trực tiếp url), thì gọi /bookings/:id
        if (!currentCarId) {
          const { data } = await api.get(`/bookings/${bookingId}`);
          const b = data?.data;
          if (b?.car) {
            currentCarId = b.car._id || b.car;
            currentCarName =
              `${b.car.brand || ""} ${b.car.model || ""}`.trim() || "Xe tự lái";
            setCarId(currentCarId);
            setCarName(currentCarName);
          }
        }

        // Kiểm tra xem đã có review cho booking này chưa
        try {
          const { data: reviewRes } = await api.get(
            `/reviews/booking/${bookingId}`
          );
          if (reviewRes?.data) {
            setExistingReview(reviewRes.data);
            setRating(reviewRes.data.rating || 5);
            setComment(reviewRes.data.comment || "");
          }
        } catch (e) {
          // Nếu 404 (chưa có review) thì bỏ qua, chỉ log lỗi khác
          if (e?.response?.status !== 404) {
            console.error("Load review error:", e);
          }
        }
      } catch (e) {
        setError(e?.response?.data?.message || e.message || "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!carId) {
      setError("Không xác định được xe của đơn này.");
      return;
    }
    if (!rating) {
      setError("Vui lòng chọn số sao.");
      return;
    }
    if (!comment.trim()) {
      setError("Vui lòng nhập nội dung đánh giá.");
      return;
    }

    try {
      setSubmitting(true);
      const body = {
        booking: bookingId,
        car: carId,
        rating,
        comment: comment.trim(),
      };

      const { data } = await api.post("/reviews", body);
      setSuccess("Đã gửi đánh giá. Cảm ơn bạn!");
      setExistingReview(data?.data || body);

      // Quay về danh sách đơn sau 1.2s
      setTimeout(() => {
        navigate("/my-bookings");
      }, 1200);
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Lỗi gửi đánh giá";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const isReadOnly = !!existingReview;

  if (loading) {
    return (
      <div className="section py-12">
        <div className="max-w-xl mx-auto text-center text-[var(--color-muted)]">
          Đang tải...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="section py-6">
        <button
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          Quay lại
        </button>

        <div className="max-w-2xl mx-auto">
          <div className="card">
            <div className="card-body">
              <h1 className="text-2xl font-bold mb-2">
                {isReadOnly ? "Đánh giá của bạn" : "Viết đánh giá"}
              </h1>
              <p className="text-[var(--color-muted)] mb-4">
                Đơn thuê: <strong>#{bookingId.slice(-6)}</strong>{" "}
                {carName && (
                  <>
                    · Xe: <strong>{carName}</strong>
                  </>
                )}
              </p>

              {error && (
                <div className="mb-4 flex items-start gap-2 text-[var(--color-danger)] text-sm">
                  <AlertCircle size={18} className="mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-4 flex items-start gap-2 text-green-600 text-sm">
                  <Check size={18} className="mt-0.5" />
                  <span>{success}</span>
                </div>
              )}

              {isReadOnly && (
                <div className="mb-4 text-sm text-[var(--color-muted)]">
                  Bạn đã đánh giá đơn này trước đó. Thông tin hiển thị bên dưới
                  là đánh giá hiện tại của bạn.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating stars */}
                <div>
                  <label className="label mb-2">Đánh giá chung</label>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const v = idx + 1;
                      const active = (hoverRating || rating) >= v;
                      return (
                        <button
                          key={v}
                          type="button"
                          disabled={isReadOnly}
                          onClick={() => !isReadOnly && setRating(v)}
                          onMouseEnter={() => !isReadOnly && setHoverRating(v)}
                          onMouseLeave={() => !isReadOnly && setHoverRating(0)}
                          className="p-1"
                        >
                          <Star
                            size={32}
                            className={
                              active ? "text-yellow-400" : "text-gray-300"
                            }
                            fill={active ? "currentColor" : "none"}
                          />
                        </button>
                      );
                    })}
                    <span className="text-sm text-[var(--color-muted)] ml-2">
                      {rating}/5
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="label mb-2">Nhận xét chi tiết</label>
                  <textarea
                    className="input min-h-[120px] resize-none"
                    placeholder="Chia sẻ trải nghiệm của bạn: chất lượng xe, thái độ chủ xe, quá trình nhận/trả xe..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={isReadOnly}
                  />
                </div>

                {!isReadOnly && (
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => navigate("/my-bookings")}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                    </button>
                  </div>
                )}

                {isReadOnly && (
                  <div className="flex justify-end">
                    <Link to="/my-bookings" className="btn btn-primary">
                      Quay lại đơn của tôi
                    </Link>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
