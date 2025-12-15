import { AlertCircle } from "lucide-react";

export const AlertMessage = ({ msg, msgType }) => {
  if (!msg) return null;

  return (
    <div
      className={`card mb-6 ${
        msgType === "error"
          ? "bg-red-50 border-red-200"
          : "bg-success/10 border-success/20"
      }`}
    >
      <div className="card-body flex items-start gap-3">
        <AlertCircle
          size={20}
          className={`flex-shrink-0 mt-0.5 ${
            msgType === "error" ? "text-danger" : "text-success"
          }`}
        />
        <p
          className={`text-sm ${
            msgType === "error" ? "text-danger" : "text-success"
          }`}
        >
          {msg}
        </p>
      </div>
    </div>
  );
};
