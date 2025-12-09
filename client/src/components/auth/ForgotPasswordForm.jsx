import { useState } from "react";
import api from "../../lib/axios";

export default function ForgotPasswordForm({ onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setMsg(data?.message || "Nếu email tồn tại, hệ thống đã gửi hướng dẫn đặt lại mật khẩu.");
      if (data?.link) {
        setMsg((data?.message || "Vui lòng kiểm tra hộp thư.") + `\n(DEV link: ${data.link})`);
      }
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">Quên mật khẩu</h3>
        <p className="text-sm text-gray-600 mt-1">
          Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu.
        </p>
      </div>

      {msg && (
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 px-4 py-3 rounded">
          <p className="text-sm whitespace-pre-line">{msg}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email
        </label>
        <input
          type="email"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <button
        onClick={submit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Đang gửi..." : "Gửi yêu cầu"}
      </button>

      <div className="text-sm text-center text-gray-600">
        Nhớ mật khẩu rồi?{" "}
        <button
          onClick={onBackToLogin}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Quay lại đăng nhập
        </button>
      </div>
    </div>
  );
}