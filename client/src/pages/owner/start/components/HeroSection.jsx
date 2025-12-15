import { ArrowRight } from "lucide-react";

export const HeroSection = ({ stats }) => {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&h=800&fit=crop"
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />

      <div className="relative z-10 section py-20">
        <div className="max-w-3xl">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-[var(--radius-pill)] text-sm font-semibold backdrop-blur-sm">
              Kiếm thu nhập thụ động
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ký gửi xe thật đơn giản cùng{" "}
            <span className="text-accent">EasyRental</span>
          </h1>

          <p className="text-xl text-white/90 mb-8">
            Chỉ 3 bước đơn giản để bắt đầu cho thuê xe và kiếm thu nhập
          </p>

          <div className="flex flex-wrap gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-3 text-white">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <stat.icon size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          <a
            href="#owner-form"
            className="btn bg-accent text-white hover:bg-accent/90 text-lg px-8 inline-flex items-center gap-2"
          >
            Bắt đầu ngay
            <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};
