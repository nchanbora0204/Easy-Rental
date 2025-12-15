import { Link } from "react-router-dom";

export const CarBreadcrumb = ({ name }) => {
  return (
    <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      <div className="section py-3">
        <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
          <Link to="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <span className="text-[var(--color-muted)]">›</span>
          <Link to="/search" className="hover:text-primary transition-colors">
            Tìm xe
          </Link>
          <span className="text-[var(--color-muted)]">›</span>
          <span className="text-[var(--color-fg)]">{name}</span>
        </div>
      </div>
    </div>
  );
};
