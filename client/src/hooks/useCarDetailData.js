import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../lib/axios";

const pickCar = (data) => data?.data ?? data;

const pickList = (res) => res?.data?.data ?? res?.data?.items ?? [];

export function useCarDetailData(carId, stateCar) {
  const [car, setCar] = useState(stateCar || null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [loading, setLoading] = useState(!stateCar);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (stateCar) setCar(stateCar);
  }, [stateCar]);

  const fetchCar = useCallback(
    async (signal) => {
      const res = await api.get(`/cars/${carId}`, { signal });
      return pickCar(res.data);
    },
    [carId]
  );

  const fetchRelated = useCallback(
    async (brand, currentId, signal) => {
      try {
        const res = await api.get("/cars", { params: { limit: 50 }, signal });
        const list = pickList(res);

        return list
          .filter((x) => x?._id !== currentId && x?.brand === brand)
          .slice(0, 8);
      } catch (e) {
        console.error("Không tải được xe tương tự", e);
        return [];
      }
    },
    []
  );

  const fetchReviews = useCallback(
    async (signal) => {
      try {
        const { data } = await api.get(`/reviews/car/${carId}`, {
          params: { page: 1, limit: 10 },
          signal,
        });

        const items = data?.data?.items || [];
        const total = data?.data?.total ?? items.length;

        return { items, total };
      } catch (e) {
        console.error("Không tải được đánh giá", e);
        return { items: [], total: 0 };
      }
    },
    [carId]
  );

  const isReady = useMemo(() => Boolean(carId), [carId]);

  useEffect(() => {
    if (!isReady) {
      setErr("Không tìm thấy xe");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const run = async () => {
      setLoading(true);
      setErr("");

      try {
        const c = await fetchCar(controller.signal);
        setCar(c);

      
        const [rel, rev] = await Promise.all([
          fetchRelated(c?.brand, c?._id, controller.signal),
          fetchReviews(controller.signal),
        ]);

        setRelated(rel);
        setReviews(rev.items);
        setReviewTotal(rev.total);
      } catch (e) {
        
        const aborted =
          e?.name === "CanceledError" ||
          e?.name === "AbortError" ||
          e?.code === "ERR_CANCELED";

        if (!aborted) {
          setErr(
            e?.response?.data?.message || e?.message || "Không tải được thông tin xe"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    run();

    return () => controller.abort();
  }, [isReady, fetchCar, fetchRelated, fetchReviews]);

  return { car, related, reviews, reviewTotal, loading, err, setErr };
}
