import { useCallback, useEffect } from "react";

const Modal = ({ open, onClose, widthClass = "max-w-lg", children }) => {
  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose?.();
    },
    [onClose]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose?.();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;

    document.addEventListener("keydown", handleKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
      >
        <div className="absolute inset-0 p-4 flex items-center justify-center">
          <div
            className={`w-full ${widthClass} bg-white rounded-2xl shadow-xl overflow-hidden`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
