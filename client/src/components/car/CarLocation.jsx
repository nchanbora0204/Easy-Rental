import { MapPin } from "lucide-react";

export default function CarLocation({ loc }) {
  if (!loc) return null;
  return (
    <div className="card">
      <div className="card-body">
        <h3 className="font-semibold text-lg mb-3">Vị trí xe</h3>
        <div className="flex items-start gap-3 mb-4">
          <MapPin size={20} className="text-primary mt-0.5" />
          <p className="text-[var(--color-muted)]">{loc}</p>
        </div>
        <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-accent/10 rounded-[var(--radius-lg)] flex items-center justify-center">
          <MapPin size={48} className="text-primary/30" />
        </div>
      </div>
    </div>
  );
}
