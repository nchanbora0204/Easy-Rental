import { DollarSign, ShieldCheck, Car, Users } from "lucide-react";
import { fmtVND } from "../utils";

export const StatsCards = ({ stats }) => {
  const totals = stats?.totals || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Doanh thu</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {fmtVND(stats?.paidRevenue || 0)}
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <DollarSign className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Chờ duyệt KYC</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {totals.pendingKycCount || 0}
            </p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-lg">
            <ShieldCheck className="text-yellow-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Tổng xe</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {totals.carsCount || 0}
            </p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Car className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Người dùng</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {totals.usersCount || 0}
            </p>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg">
            <Users className="text-purple-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};
