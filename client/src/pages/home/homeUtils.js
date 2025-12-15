import { CITY_META } from "./homeConstants";

export const fmtVND = (n) =>
  new Intl.NumberFormat("vi-VN").format(Number(n || 0));

export const formatLocation = (car) => {
  const loc = car?.location ?? car?.city ?? car?.address;
  if (!loc) return "";
  if (typeof loc === "string") return loc;
  const { address, district, ward, city, province, state } = loc;
  return [address, district || ward, city || province || state]
    .filter(Boolean)
    .join(", ");
};

export const normalizeCityName = (s = "") =>
  s
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

export const findCityMetaByName = (name = "") => {
  const norm = normalizeCityName(name);
  return (
    CITY_META.find((c) => {
      if (normalizeCityName(c.label) === norm) return true;
      if (c.aliases) {
        return c.aliases.some((a) => normalizeCityName(a) === norm);
      }
      return false;
    }) || null
  );
};

export const getSegmentBadge = (segment) => {
  switch (segment) {
    case "luxury":
      return {
        label: "Xe sang",
        className: "bg-purple-600 text-white",
      };
    case "premium":
      return {
        label: "Xe cao cấp",
        className: "bg-amber-500 text-white",
      };
    default:
      return {
        label: "Xe tiêu chuẩn",
        className: "bg-sky-600 text-white",
      };
  }
};
