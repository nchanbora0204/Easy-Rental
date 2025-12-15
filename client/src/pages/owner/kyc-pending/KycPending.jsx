import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useKycStatus from "../../../hooks/useKycStatus";

import { StatusLoading } from "./components/StatusLoading";
import { StatusError } from "./components/StatusError";
import { StateNone } from "./components/StateNone";
import { StatePending } from "./components/StatePending";
import { StateRejected } from "./components/StateRejected";
import { StateApproved } from "./components/StateApproved";

const KycPending = () => {
  const nav = useNavigate();
  const { role, kycStatus, ownerStatus, profile, loading, err, refresh } =
    useKycStatus(10000);

  useEffect(() => {
    if (kycStatus === "approved") {
      nav("/owner/cars/new", { replace: true });
    }
  }, [kycStatus, nav]);

  return (
    <div className="section max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">
        Trạng thái xác minh Owner (KYC)
      </h1>

      {loading && <StatusLoading />}

      {err && <StatusError err={err} onRetry={refresh} />}

      {!loading && !err && (
        <>
          {kycStatus === "none" && <StateNone />}

          {kycStatus === "pending" && (
            <StatePending profile={profile} onRefresh={refresh} />
          )}

          {kycStatus === "rejected" && (
            <StateRejected profile={profile} onRefresh={refresh} />
          )}

          {kycStatus === "approved" && <StateApproved />}
        </>
      )}

      <div className="text-sm text-[var(--color-muted)]">
        Vai trò hiện tại: <b>{role || "—"}</b> • Trạng thái KYC:{" "}
        <b>{kycStatus || "—"}</b> • Trạng thái chủ xe:{" "}
        <b>{ownerStatus || "—"}</b>
      </div>
    </div>
  );
};

export default KycPending;
