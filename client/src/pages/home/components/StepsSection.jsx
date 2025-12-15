import { FadeSection } from "../../../components/common/FadeSection";

const steps = [
  {
    icon: "01",
    title: "Chọn xe trên hệ thống",
    desc: "Duyệt và lựa chọn xe phù hợp",
  },
  {
    icon: "02",
    title: "Đặt xe qua hệ thống",
    desc: "Đặt xe nhanh chóng online",
  },
  {
    icon: "03",
    title: "Nhận xe và khởi hành",
    desc: "Tận hưởng chuyến đi",
  },
];

export const StepsSection = () => {
  return (
    <FadeSection className="relative py-16 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=400&fit=crop"
        alt="Steps background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 section">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          3 bước đặt xe dễ dàng
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, idx) => (
            <div key={idx} className="text-center text-white">
              <div className="text-6xl mb-4">{step.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-white/80">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </FadeSection>
  );
};
