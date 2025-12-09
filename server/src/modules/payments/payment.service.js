export function buildSePayQrUrl({ amount, description }) {
  const acc = process.env.SEPAY_ACC;
  const bank = process.env.SEPAY_BANK;
  const template = process.env.SEPAY_QR_TEMPLATE || "compact";

  if (!acc || !bank) throw new Error("SEPAY_ACC/SEPAY_BANK are required in .env");

  const params = new URLSearchParams();
  params.set("acc", acc);
  params.set("bank", bank);
  if (amount) params.set("amount", String(Math.round(amount)));
  if (description) params.set("des", description);
  if (template) params.set("template", template);

  return `https://qr.sepay.vn/img?${params.toString()}`;
}
