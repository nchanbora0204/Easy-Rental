import { Link } from "react-router-dom";

export const TermsAgreement = ({ agreeTerms, setAgreeTerms }) => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-1"
            required
          />
          <div className="text-sm">
            <p>
              Tôi đã đọc và đồng ý với{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Điều khoản sử dụng
              </Link>
              ,{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Chính sách bảo mật
              </Link>{" "}
              và{" "}
              <Link to="/cancellation" className="text-primary hover:underline">
                Chính sách hủy chuyến
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
