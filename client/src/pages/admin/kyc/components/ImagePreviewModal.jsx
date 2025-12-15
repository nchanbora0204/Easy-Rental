import { X } from "lucide-react";

export const ImagePreviewModal = ({ selectedImage, onClose }) => {
  if (!selectedImage) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="relative max-w-6xl w-full">
        <button
          onClick={onClose}
          className="absolute -top-14 right-0 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-all backdrop-blur-sm"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={selectedImage}
          alt="preview"
          className="w-full h-auto max-h-[90vh] object-contain rounded-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};
