import { ChevronRight, Camera } from "lucide-react";
import { useState } from "react";

export default function CarGallery({ name, images }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const safeImages = images?.length ? images : [];

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/9] rounded-[var(--radius-xl)] overflow-hidden bg-black group">
        <img
          src={
            safeImages[selectedImage] ||
            "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1200"
          }
          className="w-full h-full object-cover"
          alt={name}
        />
        <div className="absolute top-4 left-4">
          <span className="badge bg-black/60 text-white backdrop-blur-sm">
            <Camera size={14} />
            {safeImages.length
              ? `${selectedImage + 1} / ${safeImages.length}`
              : "1 / 1"}
          </span>
        </div>
        {safeImages.length > 1 && (
          <>
            <button
              onClick={() =>
                setSelectedImage((prev) =>
                  prev === 0 ? safeImages.length - 1 : prev - 1
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={20} className="rotate-180" />
            </button>
            <button
              onClick={() =>
                setSelectedImage((prev) =>
                  prev === safeImages.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {safeImages.slice(0, 5).map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`relative aspect-video rounded-[var(--radius-md)] overflow-hidden border-2 transition-all ${
                selectedImage === i
                  ? "border-primary"
                  : "border-transparent hover:border-[var(--color-border)]"
              }`}
            >
              <img src={img} className="w-full h-full object-cover" alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
