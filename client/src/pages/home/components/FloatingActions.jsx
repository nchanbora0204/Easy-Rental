import { Phone } from "lucide-react";
import { SUPPORT_PHONE, ZALO_LINK } from "../homeConstants";

export const FloatingActions = () => {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
      <a
        href={ZALO_LINK}
        target="_blank"
        rel="noreferrer"
        className="w-14 h-14 bg-accent rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-bounce"
      >
        <img src="/logo/zalo1.svg" className="w-7 h-7 object-contain" />
      </a>

      <a
        href={`tel:${SUPPORT_PHONE}`}
        className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-bounce"
      >
        <Phone size={24} className="text-white" />
      </a>
    </div>
  );
};
