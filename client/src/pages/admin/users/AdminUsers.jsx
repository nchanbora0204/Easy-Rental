import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { fetchUsers, lockUser, unlockUser } from "./api";
import { UsersHeader } from "./components/UsersHeader";
import { ErrorMessage } from "./components/ErrorMessage";
import { UsersFilters } from "./components/UsersFilters";
import { UsersTable } from "./components/UsersTable";
import { UsersPagination } from "./components/UsersPagination";

const AdminUsers = () => {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
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

        const { items, total: t } = await fetchUsers({
          q,
          role,
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
    [q, role, page, limit]
  );

  useEffect(() => {
    load({ keepPage: true });
  }, [load, page, role]);

  const onSearch = useCallback(
    (e) => {
      e.preventDefault();
      setPage(1);
      load({ keepPage: false });
    },
    [load]
  );

  const optimisticSetLocked = useCallback((id, locked) => {
    setRows((s) =>
      s.map((r) => (r._id === id ? { ...r, locked, isLocked: locked } : r))
    );
  }, []);

  const onLock = useCallback(
    async (id) => {
      try {
        setMsg("");
        optimisticSetLocked(id, true);
        await lockUser(id);
      } catch (e) {
        optimisticSetLocked(id, false);
        setMsg(e?.response?.data?.message || e.message);
      }
    },
    [optimisticSetLocked]
  );

  const onUnlock = useCallback(
    async (id) => {
      try {
        setMsg("");
        optimisticSetLocked(id, false);
        await unlockUser(id);
      } catch (e) {
        optimisticSetLocked(id, true);
        setMsg(e?.response?.data?.message || e.message);
      }
    },
    [optimisticSetLocked]
  );

  return (
    <AdminLayout>
      <div className="section py-6">
        <UsersHeader />
        <ErrorMessage msg={msg} />

        <UsersFilters
          q={q}
          role={role}
          onChangeQ={setQ}
          onChangeRole={(v) => {
            setRole(v);
            setPage(1);
          }}
          onSubmit={onSearch}
        />

        <div className="card">
          <UsersTable
            rows={rows}
            loading={loading}
            onLock={onLock}
            onUnlock={onUnlock}
          />

          <UsersPagination
            page={page}
            limit={limit}
            total={total}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => p + 1)}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
