import { Car } from "lucide-react";

export const CarCreateHeader = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
          <Car className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Thêm xe mới</h1>
          <p className="text-blue-100 text-sm mt-0.5">
            Điền thông tin chi tiết về xe của bạn
          </p>
        </div>
      </div>
    </div>
  );
};
