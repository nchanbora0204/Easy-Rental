import { ArrowLeft } from "lucide-react";

export const CarEditBackButton = ({ onClick }) => {
  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft size={16} /> Quay lại danh sách
      </button>
    </div>
  );
};
