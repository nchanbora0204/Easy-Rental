import { RefreshCcw } from "lucide-react";

export const StatusLoading = () => {
  return (
    <div className="card mb-4">
      <div className="card-body flex items-center gap-3">
        <RefreshCcw className="animate-spin" size={20} />
        <div>Đang tải trạng thái…</div>
      </div>
    </div>
  );
};
