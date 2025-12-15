import { Shield, CreditCard, Headphones } from "lucide-react";
import { FadeSection } from "../../../components/common/FadeSection";

const features = [
  {
    icon: Shield,
    title: "An toàn & bảo hiểm",
    desc: "Mỗi chuyến đi đều được bảo hiểm và hỗ trợ xử lý sự cố.",
  },
  {
    icon: CreditCard,
    title: "Giá minh bạch",
    desc: "Giá thuê rõ ràng theo ngày, không phí ẩn, thanh toán linh hoạt.",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ 24/7",
    desc: "Đội ngũ CSKH sẵn sàng hỗ trợ bạn trong suốt hành trình.",
  },
];

export const FeaturesSection = () => {
  return (
    <FadeSection className="section -mt-10 pb-4 relative z-20">
      <div className="grid md:grid-cols-3 gap-4">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="card bg-white shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="card-body flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-sm text-[var(--color-muted)]">
                    {f.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </FadeSection>
  );
};
