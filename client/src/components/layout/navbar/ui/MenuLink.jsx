import { NavLink } from "react-router-dom";
import { cn } from "../utils/cn";

const MenuLink = ({ to, onClick, className, children }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={cn(
      "block px-4 py-3 rounded-[var(--radius-md)] font-medium hover:bg-gray-50 transition-colors",
      className
    )}
  >
    {children}
  </NavLink>
);

export default MenuLink;
