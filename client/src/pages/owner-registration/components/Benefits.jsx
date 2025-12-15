export const Benefits = ({ benefits }) => {
  return (
    <section className="section py-16 bg-[var(--color-surface)]">
      <h2 className="text-3xl font-bold text-center mb-4">
        An tâm tuyệt đối – EasyRental lo trọn gói
      </h2>
      <p className="text-center text-[var(--color-muted)] mb-12 max-w-3xl mx-auto">
        Hàng chục nghìn chủ xe cho thuê thành công mỗi ngày trên hệ thống.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((b, i) => (
          <div key={i} className="card hover:shadow-lg transition-shadow text-center">
            <div className="card-body">
              <div
                className={`w-16 h-16 ${b.bg} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <b.icon size={32} className={b.color} />
              </div>
              <h3 className="font-semibold mb-2">{b.title}</h3>
              <p className="text-sm text-[var(--color-muted)]">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
