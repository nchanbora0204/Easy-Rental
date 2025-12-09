import { Users, Gauge, Fuel, Shield, Info } from "lucide-react";

export default function CarSpecs({
  seatsLabel,
  transmissionLabel,
  fuelLabel,
  consumptionLabel,
}) {
  return (
    <div className="card">
      <div className="card-body">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Info size={20} className="text-primary" />
          Thông số kỹ thuật
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SpecItem
            icon={<Users size={20} className="text-primary" />}
            label="Số chỗ"
            value={seatsLabel}
          />
          <SpecItem
            icon={<Gauge size={20} className="text-accent" />}
            label="Truyền động"
            value={transmissionLabel}
          />
          <SpecItem
            icon={<Fuel size={20} className="text-warning" />}
            label="Nhiên liệu"
            value={fuelLabel}
          />
          <SpecItem
            icon={<Shield size={20} className="text-success" />}
            label="Tiêu hao"
            value={consumptionLabel}
          />
        </div>
      </div>
    </div>
  );
}

function SpecItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-[var(--color-bg)] rounded-[var(--radius-md)]">
      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="text-sm text-[var(--color-muted)]">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  );
}
