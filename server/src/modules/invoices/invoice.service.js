import PDFDocument from "pdfkit";
import dayjs from "dayjs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FONTS_DIR = path.join(__dirname, "../../assets/fonts");

function formatCurrency(n, cur = "VND") {
  try {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: cur })
      .format(Number(n || 0));
  } catch {
    return `${Number(n || 0).toLocaleString("vi-VN")} ${cur}`;
  }
}

// Tạo pdf
export async function buildInvoicePdfBuffer({ booking, user, car }) {
  return await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks = [];
    doc.on("data", (d) => chunks.push(d));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.registerFont("Regular", path.join(FONTS_DIR, "NotoSans-Regular.ttf"));
    doc.registerFont("Bold",    path.join(FONTS_DIR, "NotoSans-Bold.ttf"));

    const pageWidth = doc.page.width;
    const left = 50;
    const right = pageWidth - 50;
    const contentW = right - left;

    doc
      .font("Bold").fontSize(22).fillColor("#2563eb")
      .text("HÓA ĐƠN THUÊ XE", left, 48, { width: contentW, align: "center" });

    doc
      .strokeColor("#2563eb").lineWidth(1.8)
      .moveTo(left, 82).lineTo(right, 82).stroke();

    // company + meta
    let y = 98;
    doc.font("Regular").fontSize(10).fillColor("#555");
    doc.text("CarRental Service", left, y);
    doc.text("Hotline: 1900-xxxx", left, y + 15);
    doc.text("Email: support@carrental.com", left, y + 30);

    doc.fillColor("#111").fontSize(10);
    doc.text(`Mã đơn: ${booking?._id}`, right - 220, y,     { width: 220, align: "right" });
    doc.fillColor("#666");
    doc.text(`Ngày lập: ${dayjs().format("DD/MM/YYYY HH:mm")}`, right - 220, y + 15, { width: 220, align: "right" });

    y = 170;

  
    doc.save().lineWidth(1).fillAndStroke("#f3f4f6", "#e5e7eb");
    doc.roundedRect(left, y, contentW / 2 - 10, 90, 8).fillAndStroke();
    doc.restore();

    doc.font("Bold").fillColor("#1f2937").fontSize(12)
      .text("Thông tin khách hàng", left + 14, y + 12);
    doc.font("Regular").fillColor("#000").fontSize(10);
    doc.text(`Họ tên: ${user?.name || "-"}`, left + 14, y + 34);
    doc.text(`Email: ${user?.email || "-"}`, left + 14, y + 50);
    if (user?.phone) doc.text(`SĐT: ${user?.phone}`, left + 14, y + 66);

    // Box xe
    const boxR = left + contentW / 2 + 10;
    doc.save().fillAndStroke("#f3f4f6", "#e5e7eb");
    doc.roundedRect(boxR, y, contentW / 2 - 10, 90, 8).fillAndStroke();
    doc.restore();

    doc.font("Bold").fillColor("#1f2937").fontSize(12)
      .text("Thông tin xe", boxR + 14, y + 12);
    doc.font("Regular").fillColor("#000").fontSize(10);
    doc.text(`Xe: ${car?.brand ?? ""} ${car?.model ?? ""} ${car?.year ?? ""}`, boxR + 14, y + 34, {
      width: contentW / 2 - 40,
    });
    doc.text(`Số chỗ: ${car?.seatingCapacity ?? "-"}`, boxR + 14, y + 50);
    doc.text(`Hộp số: ${car?.transmission ?? "-"}`, boxR + 160, y + 50);
    doc.text(`Đơn giá/ngày: ${formatCurrency(car?.pricePerDay, booking?.currency)}`, boxR + 14, y + 66);

  
    y = 290;
    doc.font("Bold").fillColor("#2563eb").fontSize(14).text("Chi tiết đơn thuê", left, y);
    y += 22;

  
    const thH = 26;
    doc.save().fill("#2563eb");
    doc.rect(left, y, contentW, thH).fill();
    doc.restore();

    doc.fillColor("#fff").font("Bold").fontSize(10);
    doc.text("Nội dung", left + 10, y + 8, { width: contentW * 0.5 });
    doc.text("Số lượng", left + contentW * 0.5, y + 8, { width: contentW * 0.2, align: "center" });
    doc.text("Thành tiền", left + contentW * 0.7, y + 8, { width: contentW * 0.3 - 10, align: "right" });

    const rowH = 24;
    y += thH;

  
    doc.strokeColor("#e5e7eb").rect(left, y, contentW, rowH).stroke();
    doc.font("Regular").fillColor("#000").fontSize(10);
    doc.text(`Ngày nhận xe: ${dayjs(booking.pickupDate).format("DD/MM/YYYY HH:mm")}`, left + 10, y + 6, {
      width: contentW * 0.5,
    });
    y += rowH;


    doc.rect(left, y, contentW, rowH).stroke();
    doc.text(`Ngày trả xe: ${dayjs(booking.returnDate).format("DD/MM/YYYY HH:mm")}`, left + 10, y + 6, {
      width: contentW * 0.5,
    });
    y += rowH;

 
    doc.rect(left, y, contentW, rowH).stroke();
    doc.text("Đơn giá thuê xe/ngày", left + 10, y + 6, { width: contentW * 0.5 });
    doc.text(`1 ngày`, left + contentW * 0.5, y + 6, { width: contentW * 0.2, align: "center" });
    doc.text(formatCurrency(car?.pricePerDay, booking?.currency), left + contentW * 0.7, y + 6, {
      width: contentW * 0.3 - 10, align: "right",
    });
    y += rowH;

    const days = booking?.days ?? "";
    doc.rect(left, y, contentW, rowH).stroke();
    doc.text("Tổng số ngày thuê", left + 10, y + 6, { width: contentW * 0.5 });
    doc.text(`${days} ngày`, left + contentW * 0.5, y + 6, { width: contentW * 0.2, align: "center" });
    doc.text(formatCurrency(booking.total, booking.currency), left + contentW * 0.7, y + 6, {
      width: contentW * 0.3 - 10, align: "right",
    });
    y += rowH + 8;

    doc
      .save()
      .fillColor("#2563eb")
      .roundedRect(left, y, contentW, 40, 8)
      .fill();
    doc.restore();

    doc.fillColor("#fff").font("Bold").fontSize(13)
      .text("TỔNG TIỀN THANH TOÁN", left + 12, y + 12, { width: contentW * 0.6 });
    doc.fontSize(16).text(
      formatCurrency(booking.total, booking.currency),
      left + contentW * 0.6, y + 10,
      { width: contentW * 0.4 - 14, align: "right" }
    );

    y += 56;
    doc.fillColor("#6b7280").font("Regular").fontSize(9)
      .text("Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!", left, y, { width: contentW, align: "center" });
    y += 14;
    doc.fontSize(8).text(
      "Vui lòng giữ hóa đơn này làm chứng từ khi nhận và trả xe.",
      left, y, { width: contentW, align: "center" }
    );

    doc.end();
  });
}
