export function verifyWebhookAuth(req, res, next) {
  const expected =
    process.env.SEPAY_WEBHOOK_API_KEY || process.env.SEPAY_WEBHOOK_SECRET;

  if (!expected) {
    return res
      .status(500)
      .json({ success: false, message: "SEPAY_WEBHOOK_API_KEY not set" });
  }

  const auth = req.headers.authorization || "";
  const ok = auth === `Apikey ${expected}`;

  if (!ok) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized webhook" });
  }

  return next();
}
