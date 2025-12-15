export const StatCard = ({ title, icon, iconWrapClassName, children, footer }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">{title}</p>
        <div className={iconWrapClassName}>{icon}</div>
      </div>

      {children}

      {footer ? <div className="mt-2 text-xs text-gray-500">{footer}</div> : null}
    </div>
  );
};
