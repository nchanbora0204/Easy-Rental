import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import OwnerLayout from "../layout/OwnerLayout";

import { CarsFilters } from "../cars/components/CarsFilters";
import { CarsTable } from "../cars/components/CarsTable";
import { Pagination } from "../cars/components/Pagination";

import {
  getOwnerCars,
  removeOwnerCar,
  restoreOwnerCar,
  toggleOwnerCar,
} from "./cars.service";
import { calcPageCount, getApiErrorMessage } from "./cars.utils";

export const OwnerCars = () => {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const pageCount = useMemo(() => calcPageCount(total, limit), [total, limit]);

  const fetchData = useCallback(
    async ({ nextPage = page, nextStatus = status, nextQ = q } = {}) => {
      setLoading(true);
      setMsg("");
      try {
        const { items, total: t } = await getOwnerCars({
          q: nextQ,
          status: nextStatus,
          page: nextPage,
          limit,
        });
        setRows(items);
        setTotal(t);
      } catch (e) {
        setMsg(getApiErrorMessage(e, "Có lỗi xảy ra"));
      } finally {
        setLoading(false);
      }
    },
    [q, status, page, limit]
  );

  useEffect(() => {
    fetchData({ nextPage: page, nextStatus: status, nextQ: q });
  }, [page, status, fetchData, q]);

  const onSearch = useCallback(
    (e) => {
      e.preventDefault();
      const nextPage = 1;
      setPage(nextPage);
      fetchData({ nextPage, nextStatus: status, nextQ: q });
    },
    [fetchData, q, status]
  );

  const handleStatusChange = useCallback((val) => {
    setStatus(val);
    setPage(1);
    // effect sẽ tự fetch theo page/status mới, UI không đổi
  }, []);

  const doToggle = useCallback(async (id) => {
    try {
      await toggleOwnerCar(id);
      setRows((s) =>
        s.map((r) => (r._id === id ? { ...r, isAvailable: !r.isAvailable } : r))
      );
    } catch (e) {
      setMsg(getApiErrorMessage(e, "Có lỗi xảy ra"));
    }
  }, []);

  const doRemove = useCallback(async (id) => {
    try {
      await removeOwnerCar(id);
      setRows((s) =>
        s.map((r) =>
          r._id === id ? { ...r, removed: true, isAvailable: false } : r
        )
      );
    } catch (e) {
      setMsg(getApiErrorMessage(e, "Có lỗi xảy ra"));
    }
  }, []);

  const doRestore = useCallback(async (id) => {
    try {
      await restoreOwnerCar(id);
      setRows((s) =>
        s.map((r) =>
          r._id === id ? { ...r, removed: false, isAvailable: true } : r
        )
      );
    } catch (e) {
      setMsg(getApiErrorMessage(e, "Có lỗi xảy ra"));
    }
  }, []);

  return (
    <OwnerLayout>
      <div className="section py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Quản lý xe của tôi
            </h1>
            <p className="text-gray-500 text-sm">
              Quản lý danh sách xe cho thuê của bạn
            </p>
          </div>

          <Link
            to="/owner/cars/new"
            className="btn btn-primary inline-flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
          >
            <Plus size={18} /> Thêm xe mới
          </Link>
        </div>

        {/* Error Message */}
        {msg && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {msg}
          </div>
        )}

        {/* Search & Filter */}
        <CarsFilters
          q={q}
          status={status}
          onQChange={setQ}
          onStatusChange={handleStatusChange}
          onSubmit={onSearch}
        />

        {/* Table */}
        <div className="card shadow-sm">
          <CarsTable
            rows={rows}
            loading={loading}
            onToggle={doToggle}
            onRemove={doRemove}
            onRestore={doRestore}
          />

          {/* Pagination */}
          <Pagination
            page={page}
            limit={limit}
            total={total}
            pageCount={pageCount}
            onPrev={() => setPage((p) => p - 1)}
            onNext={() => setPage((p) => p + 1)}
          />
        </div>
      </div>
    </OwnerLayout>
  );
};

export default OwnerCars;
