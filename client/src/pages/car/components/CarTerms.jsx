import { Check } from "lucide-react";

const TERMS = [
  "Sử dụng xe đúng mục đích, không vi phạm pháp luật",
  "Không vận chuyển hàng cấm, chất nguy hiểm",
  "Trả xe đúng giờ, vượt hạn sẽ tính phụ phí",
  "Giữ vệ sinh xe, bồi thường nếu gây hư hỏng",
];

export const CarTerms = () => {
  return (
    <div className="card">
      <div className="card-body">
        <h3 className="font-semibold text-lg mb-4">Điều khoản sử dụng</h3>
        <div className="space-y-2">
          {TERMS.map((term, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 bg-[var(--color-bg)] rounded-[var(--radius-md)]"
            >
              <Check size={18} className="text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm text-[var(--color-muted)]">{term}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
