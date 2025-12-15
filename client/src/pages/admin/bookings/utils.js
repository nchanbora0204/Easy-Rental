export const fmtVND = (n) => {
  if (n === null || n === undefined) return "";
  return typeof n?.toLocaleString === "function" ? n.toLocaleString() : String(n);
};

export const fmtDate = (v) => {
  try {
    return new Date(v).toLocaleDateString();
  } catch {
    return "-";
  }
};

export const fmtDateTime = (v) => {
  try {
    return new Date(v).toLocaleString();
  } catch {
    return "-";
  }
};

export const normalizeDetail = (payload) => {
  const booking = payload?.booking || null;
  const payment = Array.isArray(payload?.payments)
    ? payload.payments[0]
    : payload?.payment;

  return booking ? { ...booking, payment } : null;
};
