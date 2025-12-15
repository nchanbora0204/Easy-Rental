export const BlogCategoryTabs = ({ categories, activeId, onChange }) => {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {categories.map((c) => {
        const active = c.id === activeId;
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs md:text-sm border transition-colors ${
              active
                ? "bg-primary text-white border-primary"
                : "bg-[var(--color-surface)]/70 text-[var(--color-muted)] border-[var(--color-border)] hover:text-[var(--color-fg)]"
            }`}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
};

export default BlogCategoryTabs;
