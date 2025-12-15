export const BlogDetailContent = ({ content }) => {
  if (!content) return null;

  const blocks = String(content)
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="card mt-6">
      <div className="card-body">
        {blocks.map((block, idx) => (
          <p
            key={idx}
            className="text-sm md:text-base text-[var(--color-fg)] leading-relaxed mb-3"
          >
            {block}
          </p>
        ))}
      </div>
    </div>
  );
};

export default BlogDetailContent;
