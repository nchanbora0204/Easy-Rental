import { ChevronRight } from "lucide-react";
import { HERO_STATS } from "../constants";

export const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&h=800&fit=crop"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

      <div className="relative z-10 section py-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Cho thuê <span className="whitespace-nowrap">nhẹ nhàng</span>,
            <br />
            thu nhập <span className="whitespace-nowrap">thảnh thơi</span> cùng
            <br />
            <span className="text-accent">EasyRental</span>
          </h1>

          <p className="text-xl text-gray-200 mb-8">
            Biến chiếc xe nhàn rỗi thành thu nhập thụ động
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {HERO_STATS.map(([n, t]) => (
              <div key={t} className="text-center">
                <div className="text-3xl font-bold text-accent mb-1">{n}</div>
                <div className="text-sm text-gray-200">{t}</div>
              </div>
            ))}
          </div>

          <a
            href="#register-form"
            className="btn bg-accent text-white hover:bg-accent/90 text-lg px-8 inline-flex items-center gap-2"
          >
            Đăng ký ngay <ChevronRight size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};
