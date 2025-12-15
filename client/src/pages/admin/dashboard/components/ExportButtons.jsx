import exportCSV from "../../../../lib/exportCSV";

export const ExportButtons = ({ revenueChart, topCars, userDist }) => {
  return (
    <div className="flex gap-4 mt-6">
      <button
        className="btn btn-primary"
        onClick={() => exportCSV(revenueChart, "doanhthu.csv")}
      >
        Xuất báo cáo doanh thu
      </button>
      <button
        className="btn btn-secondary"
        onClick={() => exportCSV(topCars, "topxe.csv")}
      >
        Xuất top xe
      </button>
      <button
        className="btn btn-secondary"
        onClick={() => exportCSV(userDist, "nguoidung.csv")}
      >
        Xuất phân bổ người dùng
      </button>
    </div>
  );
};
