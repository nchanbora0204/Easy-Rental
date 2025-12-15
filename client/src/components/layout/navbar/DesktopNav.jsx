import { NavLink } from "react-router-dom";
import LocationDropdown from "./LocationDropdown";
import { BASE_LINKS } from "./utils/constants";

const DesktopNav = ({
  locationOpen,
  onToggleLocation,
  onCloseLocation,
  locRef,
}) => {
  return (
    <div className="hidden md:flex items-center gap-8">
      {BASE_LINKS.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          className="text-[var(--color-fg)] hover:text-accent font-medium transition-colors"
        >
          {l.label}
        </NavLink>
      ))}

      <LocationDropdown
        open={locationOpen}
        onToggle={onToggleLocation}
        onClose={onCloseLocation}
        anchorRef={locRef}
      />
    </div>
  );
};

export default DesktopNav;
