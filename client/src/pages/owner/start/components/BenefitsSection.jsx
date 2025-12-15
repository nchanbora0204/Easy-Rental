export const BenefitsSection = ({ benefits }) => {
  return (
    <section className="section py-16">
      <h2 className="text-3xl font-bold text-center mb-4">
        Lợi ích khi trở thành chủ xe
      </h2>
      <p className="text-center text-[var(--color-muted)] mb-12 max-w-2xl mx-auto">
        Tham gia cùng hơn 50,000 chủ xe đang kiếm thu nhập thụ động
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {benefits.map((benefit, idx) => (
          <div
            key={idx}
            className="card hover:shadow-xl transition-all text-center"
          >
            <div className="card-body">
              <div
                className={`w-16 h-16 ${benefit.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}
              >
                <benefit.icon size={32} className={benefit.color} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
              <p className="text-[var(--color-muted)]">{benefit.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
