import { Link } from "react-router-dom";

export const BlogDetailError = ({ message }) => {
  return (
    <div className="card">
      <div className="card-body text-center">
        <p className="text-[var(--color-danger)] mb-3">{message}</p>
        <Link to="/blog" className="btn btn-primary text-sm">
          Quay lại danh sách blog
        </Link>
      </div>
    </div>
  );
};

export default BlogDetailError;
