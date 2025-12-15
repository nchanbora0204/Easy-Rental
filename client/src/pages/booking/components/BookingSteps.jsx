import { Check } from "lucide-react";

export const BookingSteps = ({ steps }) => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={step.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-2 flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step.done
                      ? "bg-success text-white"
                      : step.active
                      ? "bg-primary text-white ring-4 ring-primary/20"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step.done ? <Check size={20} /> : step.num}
                </div>
                <span
                  className={`text-sm font-medium text-center ${
                    step.active ? "text-primary" : "text-[var(--color-muted)]"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 ${
                    step.done ? "bg-success" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
