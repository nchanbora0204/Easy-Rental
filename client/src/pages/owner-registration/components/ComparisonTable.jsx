import { CheckCircle2 } from "lucide-react";
import { COMPARE_ROWS } from "../constants";

export const ComparisonTable = () => {
  return (
    <section className="section py-16 bg-[var(--color-surface)]">
      <h2 className="text-3xl font-bold text-center mb-12">
        EasyRental – giải pháp vượt trội cho thuê xe tự lái
      </h2>

      <div className="max-w-4xl mx-auto overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left py-4 px-4">Tiêu chí</th>
              <th className="text-center py-4 px-4 bg-accent/5">
                <div className="font-bold text-accent">EasyRental</div>
              </th>
              <th className="text-center py-4 px-4">Tự cho thuê</th>
              <th className="text-center py-4 px-4">Nền tảng khác</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {COMPARE_ROWS.map((row, i) => (
              <tr key={i} className="border-b border-[var(--color-border)]">
                <td className="py-3 px-4">{row[0]}</td>
                {[1, 2, 3].map((idx) => (
                  <td
                    key={idx}
                    className={`text-center py-3 px-4 ${idx === 1 ? "bg-accent/5" : ""}`}
                  >
                    {row[idx] ? (
                      <CheckCircle2 size={20} className="text-success mx-auto" />
                    ) : (
                      <span className="text-[var(--color-muted)]">-</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
