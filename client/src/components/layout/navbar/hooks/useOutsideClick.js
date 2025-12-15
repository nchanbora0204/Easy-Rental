import { useEffect } from "react";

export const useOutsideClick = (refs, onOutside) => {
  useEffect(() => {
    const handler = (e) => {
      const isInside = refs.some((r) => r.current && r.current.contains(e.target));
      if (!isInside) onOutside?.();
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [refs, onOutside]);
};
