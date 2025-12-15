import { Link } from "react-router-dom";
import { ArrowRight, Car } from "lucide-react";
import { SUPPORT_PHONE } from "../../blogConstants";

export const BlogDetailCTA = () => {
  return (
    <div className="mt-8 card bg-gradient-to-r from-primary/10 to-accent/10">
      <div className="card-body flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/70 text-[10px] font-medium text-primary mb-2">
            <Car size={12} /> Gắn trải nghiệm vào chuyến đi thật
          </div>
          <h2 className="font-semibold text-lg mb-1">
            Sẵn sàng áp dụng những gì bạn vừa đọc?
          </h2>
          <p className="text-sm text-[var(--color-muted)] max-w-xl">
            Chọn chiếc xe phù hợp và bắt đầu hành trình của bạn với Bonboncar.
            Đặt xe nhanh, bảo hiểm đầy đủ, hỗ trợ 24/7.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <Link to="/search" className="btn btn-primary text-sm">
            Tìm xe ngay <ArrowRight size={16} />
          </Link>
          <button
            type="button"
            className="btn btn-ghost text-sm"
            onClick={() => (window.location.href = `tel:${SUPPORT_PHONE}`)}
          >
            Gọi tư vấn {SUPPORT_PHONE}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailCTA;
