import { useEffect, useState } from "react";
import api from "../lib/axios";

export function useCarDetailData(carId, stateCar) {
  const [car, setCar] = useState(stateCar || null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [loading, setLoading] = useState(!stateCar);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!carId) {
      setErr("Không tìm thấy xe");
      setLoading(false);
      return;
    }
    let alive = true;
    if (stateCar) setCar(stateCar);

    const loadCar = async () => {
      setLoading(true);
      setErr("");
      try {
        const { data } = await api.get(`/cars/${carId}`);
        const c = data?.data || data;
        if (!alive) return;
        setCar(c);

        try {
          const resRel = await api.get("/cars", { params: { limit: 50 } });
          if (!alive) return;
          const list = resRel.data?.data || resRel.data?.items || [];
          const sameBrand = list
            .filter((x) => x._id !== c._id && x.brand === c.brand)
            .slice(0, 8);
          setRelated(sameBrand);
        } catch (e) {
          console.error("Không tải được xe tương tự", e);
        }
      } catch (e) {
        if (alive)
          setErr(
            e?.response?.data?.message ||
              e.message ||
              "Không tải được thông tin xe"
          );
      } finally {
        if (alive) setLoading(false);
      }
    };

    const loadReviews = async () => {
      try {
        const { data } = await api.get(`/reviews/car/${carId}`, {
          params: { page: 1, limit: 10 },
        });
        if (!alive) return;
        const items = data?.data?.items || [];
        const total = data?.data?.total ?? items.length;
        setReviews(items);
        setReviewTotal(total);
      } catch (e) {
        console.error("Không tải được đánh giá", e);
        if (!alive) return;
        setReviews([]);
        setReviewTotal(0);
      }
    };

    loadCar();
    loadReviews();
    return () => {
      alive = false;
    };
  }, [carId, stateCar]);

  return { car, related, reviews, reviewTotal, loading, err, setErr };
}
