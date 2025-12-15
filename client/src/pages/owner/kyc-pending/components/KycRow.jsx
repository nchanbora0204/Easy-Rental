export const KycRow = ({ label, value }) => {
  return (
    <div className="flex justify-between py-2 border-b border-[var(--color-border)] last:border-0">
      <div className="text-[var(--color-muted)]">{label}</div>
      <div className="font-medium text-right">{value || "—"}</div>
    </div>
  );
};
