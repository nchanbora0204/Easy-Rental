export default function Modal({
  open,
  onClose,
  widthClass = "max-w-lg",
  children,
}) {
  if (!open) return null;

  const stop = (e) => e.stopPropagation();

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="absolute inset-0 p-4 flex items-center justify-center"
          onClick={onClose}
        >
          <div
            className={`w-full ${widthClass} bg-white rounded-2xl shadow-xl overflow-hidden`}
            onClick={stop}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
