import { FadeSection } from "../../../components/common/FadeSection";

const faqs = [
  "Tại sao nên lựa chọn thuê xe tự lái Bonboncar?",
  "Phí thuê xe có bao gồm bảo hiểm xe không?",
  "Điều kiện và thủ tục thuê xe bao gồm gì?",
  "Xe có đầy đủ giấy tờ không?",
  "Tôi cần phải đặt cọc khi thuê xe?",
  "Tôi có thể hủy hoặc thay đổi đơn hàng không?",
  "Trường hợp xe bị hư hỏng cần xử lý thế nào?",
];

export const FaqSection = () => {
  return (
    <FadeSection className="section py-12 bg-[var(--color-surface)]">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="text-2xl font-bold mb-3 text-white">
            Câu hỏi thường gặp
          </h2>
          <p className="text-[var(--color-muted)]">
            Một số thắc mắc phổ biến khi thuê xe tự lái. Nếu bạn vẫn cần hỗ
            trợ, hãy liên hệ chúng tôi qua chat hoặc hotline bên dưới.
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map((q, idx) => (
            <div
              key={idx}
              className="card hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="card-body flex gap-3 items-start">
                <div className="mt-1 text-primary font-semibold">
                  {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </div>
                <p className="font-medium">{q}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FadeSection>
  );
};
