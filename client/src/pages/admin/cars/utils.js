export const isCarRemoved = (c) =>
  c?.status === "removed" || Boolean(c?.deletedAt) || c?.removed === true;

export const fmtPriceVND = (n) => {
  if (n === null || n === undefined) return "";
  return typeof n?.toLocaleString === "function" ? n.toLocaleString() : String(n);
};
