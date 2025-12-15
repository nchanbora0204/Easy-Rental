export const StepsSection = ({ steps }) => {
  return (
    <section className="section py-16 bg-[var(--color-surface)]">
      <h2 className="text-3xl font-bold text-center mb-12">
        Quy trình đăng ký đơn giản
      </h2>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={step.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-3 flex-1">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl transition-all ${
                    step.active
                      ? "bg-accent text-white ring-4 ring-accent/20"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step.num}
                </div>

                <div className="text-center">
                  <h3
                    className={`font-semibold mb-1 ${
                      step.active ? "text-accent" : "text-[var(--color-muted)]"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--color-muted)]">
                    {step.desc}
                  </p>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="h-0.5 flex-1 mx-4 bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
