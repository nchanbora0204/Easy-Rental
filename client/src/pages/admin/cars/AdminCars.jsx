import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { fetchCars, carAction } from "./api";
import { CarsHeader } from "./components/CarsHeader";
import { ErrorMessage } from "./components/ErrorMessage";
import { CarsFilters } from "./components/CarsFilters";
import { CarsTable } from "./components/CarsTable";
import { CarsPagination } from "./components/CarsPagination";
import { CarsHint } from "./components/CarsHint";

const AdminCars = () => {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(
    async ({ keepPage = true } = {}) => {
      setLoading(true);
      setMsg("");
      try {
        const nextPage = keepPage ? page : 1;

        const { items, total: t } = await fetchCars({
          q,
          status,
          page: nextPage,
          limit,
        });

        setRows(items);
        setTotal(t);
        if (!keepPage) setPage(1);
      } catch (e) {
        setMsg(e?.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    },
    [q, status, page, limit]
  );

  useEffect(() => {
    load({ keepPage: true });
  }, [load, page, status]);

  const onSearch = useCallback(
    (e) => {
      e.preventDefault();
      setPage(1);
      load({ keepPage: false });
    },
    [load]
  );

  const optimisticUpdate = useCallback((id, kind) => {
    setRows((s) =>
      s.map((r) =>
        r._id === id
          ? {
              ...r,
              status: kind === "remove" ? "removed" : "active",
              deletedAt:
                kind === "remove" ? new Date().toISOString() : undefined,
            }
          : r
      )
    );
  }, []);

  const onRemove = useCallback(
    async (id) => {
      try {
        setMsg("");
        optimisticUpdate(id, "remove");
        await carAction({ id, kind: "remove" });
      } catch (e) {
        setMsg(e?.response?.data?.message || e.message);
        // fallback: reload để sync lại nếu lỗi
        load({ keepPage: true });
      }
    },
    [optimisticUpdate, load]
  );

  const onRestore = useCallback(
    async (id) => {
      try {
        setMsg("");
        optimisticUpdate(id, "restore");
        await carAction({ id, kind: "restore" });
      } catch (e) {
        setMsg(e?.response?.data?.message || e.message);
        load({ keepPage: true });
      }
    },
    [optimisticUpdate, load]
  );

  return (
    <AdminLayout>
      <div className="section py-6">
        <CarsHeader />
        <ErrorMessage msg={msg} />

        <CarsFilters
          q={q}
          status={status}
          onChangeQ={setQ}
          onChangeStatus={(v) => {
            setStatus(v);
            setPage(1);
          }}
          onSubmit={onSearch}
        />

        <div className="card">
          <CarsTable
            rows={rows}
            loading={loading}
            onRemove={onRemove}
            onRestore={onRestore}
          />
          <CarsPagination
            page={page}
            limit={limit}
            total={total}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => p + 1)}
          />
        </div>

        <CarsHint />
      </div>
    </AdminLayout>
  );
};

export default AdminCars;
