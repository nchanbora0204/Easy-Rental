import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail({ to, subject, html, attachments = [] }) {
  if (process.env.NODE_ENV === "production") {
    console.warn("sendMail skipped in production environment");
    return null;
  }

  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
    attachments,
  });
  console.log("email sent:", info.messageId);
  return info;
}
