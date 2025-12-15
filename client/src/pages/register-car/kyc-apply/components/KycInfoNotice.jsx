import { Info } from "lucide-react";
import { KYC_NOTICE } from "../kycApplyConstants";

export const KycInfoNotice = () => {
  return (
    <div className="card mb-6 bg-primary/5 border-primary/20">
      <div className="card-body flex items-start gap-3">
        <Info size={20} className="text-primary flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium mb-1">Lưu ý quan trọng:</p>
          <ul className="space-y-1 text-[var(--color-muted)]">
            {KYC_NOTICE.map((t, i) => (
              <li key={i}>• {t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default KycInfoNotice;
