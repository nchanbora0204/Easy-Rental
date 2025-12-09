import { Check } from "lucide-react";

export default function CarFeatures({ features }) {
  const list = features?.length
    ? features
    : [
        "Bluetooth",
        "Camera 360°",
        "Cảm biến lùi",
        "Màn hình DVD",
        "Định vị GPS",
        "Khe cắm USB",
        "Cửa sổ trời",
        "Bản đồ offline",
      ];

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="font-semibold text-lg mb-4">Tiện nghi & Tính năng</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {list.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-[var(--color-bg)] rounded-[var(--radius-md)]"
            >
              <Check size={18} className="text-success" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
