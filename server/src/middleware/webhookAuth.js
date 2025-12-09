export function verifyWebhookAuth(req, res, next) {
  const mode = (process.env.SEPAY_WEBHOOK_MODE || "token").toLowerCase();
  const secret =
    process.env.SEPAY_WEBHOOK_SECRET || process.env.SEPAY_WEBHOOK_TOKEN;

  if (!secret) {
    return res
      .status(500)
      .json({ success: false, message: "Webhook secret/token not set" });
  }

  let ok = false;
  if (mode === "token") {
    const token = req.query.token || req.headers["x-webhook-token"];
    ok = token === secret;
  } else if (mode === "apikey") {
    const apiKey = req.headers["x-api-key"];
    ok = apiKey === secret;
  }

  if (!ok)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized webhook" });
  next();
}
