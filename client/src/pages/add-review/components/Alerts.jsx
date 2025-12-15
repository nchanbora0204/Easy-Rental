import { AlertCircle, Check } from "lucide-react";

export const Alerts = ({ error, success, readOnlyHint }) => {
  return (
    <>
      {error ? (
        <div className="mb-4 flex items-start gap-2 text-[var(--color-danger)] text-sm">
          <AlertCircle size={18} className="mt-0.5" />
          <span>{error}</span>
        </div>
      ) : null}

      {success ? (
        <div className="mb-4 flex items-start gap-2 text-green-600 text-sm">
          <Check size={18} className="mt-0.5" />
          <span>{success}</span>
        </div>
      ) : null}

      {readOnlyHint ? (
        <div className="mb-4 text-sm text-[var(--color-muted)]">
          {readOnlyHint}
        </div>
      ) : null}
    </>
  );
};
