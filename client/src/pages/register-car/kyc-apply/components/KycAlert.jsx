import { AlertCircle, CheckCircle2 } from "lucide-react";

export const KycAlert = ({ msg, type }) => {
  if (!msg) return null;

  const success = type === "success";
  return (
    <div
      className={`card mb-6 ${
        success ? "bg-success/10 border-success/20" : "bg-red-50 border-red-200"
      }`}
    >
      <div className="card-body flex items-start gap-3">
        {success ? (
          <CheckCircle2 size={20} className="text-success flex-shrink-0 mt-0.5" />
        ) : (
          <AlertCircle size={20} className="text-danger flex-shrink-0 mt-0.5" />
        )}
        <div className="flex-1">
          <p className={`text-sm font-medium ${success ? "text-success" : "text-danger"}`}>
            {success ? "Thành công" : "Lỗi"}
          </p>
          <p className={`text-sm mt-1 ${success ? "text-success/80" : "text-danger/80"}`}>
            {msg}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KycAlert;
