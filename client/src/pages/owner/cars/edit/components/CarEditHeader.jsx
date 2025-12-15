import { Car } from "lucide-react";

export const CarEditHeader = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
          <Car className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">
            Chỉnh sửa thông tin xe
          </h1>
          <p className="text-blue-100 text-sm mt-0.5">
            Cập nhật lại thông tin chi tiết xe của bạn
          </p>
        </div>
      </div>
    </div>
  );
};
