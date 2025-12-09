import { useEffect, useState } from "react";
import api from "../lib/axios";
import { useNavigate } from "react-router-dom";
import KycApplyForm from "../components/KycApplyForm";

export default function RegisterCarGate() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [kyc, setKyc] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/kyc/me");
        setKyc(data?.data);
      } catch (e) {
        // chưa đăng nhập -> chuyển hướng
        nav("/?auth=login", { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [nav]);

  if (loading) return <div className="section py-16">Đang tải…</div>;

  const status = kyc?.kycStatus || "none";

  if (status === "approved") {
    return (
      <div className="section py-16 text-center space-y-4">
        <h1 className="text-2xl font-semibold">KYC đã duyệt ✅</h1>
        <p>Bạn có thể bắt đầu đăng xe ngay bây giờ.</p>
        <button
          className="btn btn-primary"
          onClick={() => nav("/owner/cars/new")}
        >
          Đăng xe ngay
        </button>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="section py-16 text-center space-y-4">
        <h1 className="text-2xl font-semibold">Hồ sơ đang chờ duyệt ⏳</h1>
        <p>Chúng tôi sẽ phản hồi trong vòng 24–48 giờ.</p>
      </div>
    );
  }

  // "none" hoặc "rejected" -> hiện form KYC
  return (
    <div className="section py-10 max-w-3xl mx-auto">
      {status === "rejected" && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700">
          Hồ sơ KYC bị từ chối. Vui lòng cập nhật & nộp lại.
        </div>
      )}
      <KycApplyForm
        initial={kyc?.kycProfile}
        onSubmitted={() => {
          // sau khi nộp -> về màn chờ duyệt
          nav("/register-car/start", { replace: true });
        }}
      />
    </div>
  );
}
