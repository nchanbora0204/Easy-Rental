import { Link } from "react-router-dom";
import { FadeSection } from "../../../components/common/FadeSection";

export const CtaSection = () => {
  return (
    <FadeSection className="section py-12">
      <div className="card bg-gradient-to-br from-accent/10 to-primary/5">
        <div className="card-body text-center py-16">
          <h2 className="text-3xl font-bold mb-3">1000+ xe và hơn thế nữa</h2>
          <p className="text-xl text-primary font-semibold mb-2">
            Hãy trải nghiệm hôm nay!
          </p>
          <p className="text-[var(--color-muted)] mb-6 max-w-2xl mx-auto">
            Với hơn 1000 xe đa dạng từ phổ thông đến cao cấp, chúng tôi cam kết
            mang đến trải nghiệm thuê xe tốt nhất cho bạn.
          </p>
          <Link to="/search" className="btn btn-primary">
            Tìm xe
          </Link>
        </div>
      </div>
    </FadeSection>
  );
};
