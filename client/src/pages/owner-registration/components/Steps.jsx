import { STEPS } from "../constants";

export const Steps = () => {
  return (
    <section className="section py-16">
      <h2 className="text-3xl font-bold text-center mb-12">
        Cho thuê 3 bước siêu dễ – chỉ 10 phút
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {STEPS.map((s) => (
          <div key={s.step} className="text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
              {s.step}
            </div>
            <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
            <p className="text-sm text-[var(--color-muted)]">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
