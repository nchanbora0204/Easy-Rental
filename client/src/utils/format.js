export const fmtVND = (n) =>
  new Intl.NumberFormat("vi-VN").format(Number(n || 0));
export const iso = (d) => (d ? new Date(d).toISOString() : "");
export const daysBetween = (s, e) => {
  if (!s || !e) return 0;
  const ds = new Date(s);
  const de = new Date(e);
  const ms = de - ds;
  if (ms <= 0) return 0;
  return Math.max(1, Math.ceil(ms / (24 * 60 * 60 * 1000)));
};
export const formatLocation = (car) => {
  const loc = car?.location ?? car?.city ?? car?.address;
  if (!loc) return "";
  if (typeof loc === "string") return loc;
  const { address, ward, district, city, province, state } = loc;
  return [address, ward, district, city || province || state]
    .filter(Boolean)
    .join(", ");
};
