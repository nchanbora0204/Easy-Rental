import { FileText } from "lucide-react";

export const KycNotesSection = ({ value, onChange }) => {
  return (
    <div>
      <label className="label flex items-center gap-2 mb-2">
        <FileText size={16} />
        Ghi chú (tùy chọn)
      </label>
      <textarea
        className="textarea w-full"
        rows={4}
        placeholder="Thêm ghi chú nếu cần..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default KycNotesSection;
