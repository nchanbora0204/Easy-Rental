export const CancellationPolicy = () => {
  return (
    <div className="card">
      <div className="card-body">
        <h3 className="font-semibold text-lg mb-4">Chính sách hủy chuyến</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left py-3 px-2 font-semibold">Thời gian hủy</th>
                <th className="text-left py-3 px-2 font-semibold">Hoàn tiền</th>
                <th className="text-left py-3 px-2 font-semibold">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="text-[var(--color-muted)]">
              <tr className="border-b border-[var(--color-border)]">
                <td className="py-3 px-2">≥ 10 ngày trước chuyến</td>
                <td className="py-3 px-2">
                  <span className="badge badge-success">100%</span>
                </td>
                <td className="py-3 px-2">Hoàn toàn bộ</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="py-3 px-2">6-9 ngày trước chuyến</td>
                <td className="py-3 px-2">
                  <span className="badge badge-warning">50%</span>
                </td>
                <td className="py-3 px-2">Hoàn một nửa</td>
              </tr>
              <tr>
                <td className="py-3 px-2">{"<"} 5 ngày trước chuyến</td>
                <td className="py-3 px-2">
                  <span className="badge badge-danger">0%</span>
                </td>
                <td className="py-3 px-2">Không hoàn</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
