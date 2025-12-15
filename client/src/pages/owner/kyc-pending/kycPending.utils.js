export const fmtDateTime = (d) => {
  try {
    const dt = new Date(d);
    if (Number.isNaN(+dt)) return "";
    return dt.toLocaleString();
  } catch {
    return "";
  }
};
