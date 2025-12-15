import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../lib/axios";

import { DEFAULT_RATING, MESSAGES } from "./constants";
import { buildCarName, bookingCode, isNotFound, safeMessage } from "./utils";

import { Header } from "./components/Header";
import { Alerts } from "./components/Alerts";
import { ReviewForm } from "./components/ReviewForm";

const AddReview = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const initialState = useMemo(() => {
    return {
      carName: location.state?.carName || "",
      carId: location.state?.carId || "",
    };
  }, [location.state]);

  const [carName, setCarName] = useState(initialState.carName);
  const [carId, setCarId] = useState(initialState.carId);

  const [rating, setRating] = useState(DEFAULT_RATING);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [existingReview, setExistingReview] = useState(null);

  const isReadOnly = Boolean(existingReview);
  const code = useMemo(() => bookingCode(bookingId), [bookingId]);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        let currentCarId = carId;
        if (!currentCarId) {
          const { data } = await api.get(`/bookings/${bookingId}`);
          const b = data?.data;

          if (b?.car) {
            currentCarId = b.car?._id || b.car;
            if (alive) {
              setCarId(currentCarId);
              setCarName(buildCarName(b.car));
            }
          }
        }

        try {
          const { data: reviewRes } = await api.get(
            `/reviews/booking/${bookingId}`
          );
          const rv = reviewRes?.data;

          if (rv && alive) {
            setExistingReview(rv);
            setRating(rv.rating || DEFAULT_RATING);
            setComment(rv.comment || "");
          }
        } catch (e) {
          if (!isNotFound(e)) console.error("Load review error:", e);
        }
      } catch (e) {
        if (alive) setError(safeMessage(e, MESSAGES.loadFail));
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [bookingId, carId]);

  const validate = () => {
    if (!carId) return MESSAGES.cannotDetectCar;
    if (!rating) return MESSAGES.selectRating;
    if (!comment.trim()) return MESSAGES.enterComment;
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isReadOnly) return;

    setError("");
    setSuccess("");

    const msg = validate();
    if (msg) {
      setError(msg);
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

      setSuccess(MESSAGES.sent);
      setExistingReview(data?.data || body);

      setTimeout(() => navigate("/my-bookings"), 1200);
    } catch (e) {
      setError(safeMessage(e, MESSAGES.submitFail));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="section py-12">
        <div className="max-w-xl mx-auto text-center text-[var(--color-muted)]">
          {MESSAGES.loading}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="section py-6">
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <div className="card-body">
              <Header
                onBack={() => navigate(-1)}
                bookingId={code}
                carName={carName}
                isReadOnly={isReadOnly}
              />

              <Alerts
                error={error}
                success={success}
                readOnlyHint={isReadOnly ? MESSAGES.readOnlyHint : ""}
              />

              <ReviewForm
                isReadOnly={isReadOnly}
                rating={rating}
                hoverRating={hoverRating}
                comment={comment}
                submitting={submitting}
                onRatingSelect={(v) => setRating(v)}
                onRatingHover={(v) => setHoverRating(v)}
                onRatingLeave={() => setHoverRating(0)}
                onCommentChange={setComment}
                onCancel={() => navigate("/my-bookings")}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReview;
