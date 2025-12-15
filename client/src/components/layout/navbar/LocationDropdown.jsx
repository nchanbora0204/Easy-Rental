import { MapPin, ChevronDown } from "lucide-react";
import { CITIES } from "./utils/constants";

const LocationDropdown = ({
  open,
  onToggle,
  onClose,
  anchorRef,
  currentLabel = "Hồ Chí Minh",
}) => {
  return (
    <div className="relative" ref={anchorRef}>
      <button
        onClick={onToggle}
        className="flex items-center gap-2 text-[var(--color-fg)] hover:text-accent font-medium transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MapPin size={18} />
        {currentLabel}
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 w-56 bg-white rounded-[var(--radius-md)] shadow-lg border border-[var(--color-border)] overflow-hidden">
          {CITIES.map((city) => (
            <button
              key={city}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-2"
              onClick={onClose}
            >
              <MapPin size={16} />
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationDropdown;
