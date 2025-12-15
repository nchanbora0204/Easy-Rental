import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const FooterLinkList = ({ title, links = [] }) => (
  <div>
    <h3 className="text-white font-semibold mb-4 text-lg">{title}</h3>
    <ul className="space-y-3">
      {links.map(({ to, label }) => (
        <li key={to}>
          <Link
            to={to}
            className="text-sm text-gray-400 hover:text-accent transition-colors flex items-center gap-2 group"
          >
            <ChevronRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default FooterLinkList;
