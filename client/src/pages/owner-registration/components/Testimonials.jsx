import { Star } from "lucide-react";
import { TESTIMONIALS } from "../constants";

export const Testimonials = () => {
  return (
    <section className="section py-16">
      <h2 className="text-3xl font-bold text-center mb-12">
        Chủ xe nói gì về EasyRental
      </h2>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {TESTIMONIALS.map((r, idx) => (
          <div key={idx} className="card hover:shadow-lg transition-shadow">
            <div className="card-body">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={16} className="text-warning" fill="currentColor" />
                ))}
              </div>

              <p className="text-[var(--color-muted)] mb-4 text-sm">{r.text}</p>

              <div className="flex items-center gap-3 pt-3 border-t border-[var(--color-border)]">
                <img src={r.avatar} alt={r.name} className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-sm text-[var(--color-muted)]">{r.car}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
