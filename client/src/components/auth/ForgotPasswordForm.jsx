import { useCallback, useState } from "react";
import api from "../../lib/axios";

const getErrMsg = (e) =>
  e?.response?.data?.message || e?.message || "Gửi yêu cầu thất bại";

export default function ForgotPasswordForm({ onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // "success" | "error"
  const [loading, setLoading] = useState(false);

  const submit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;

      setMsg("");
      setMsgType("");
      setLoading(true);

      try {
        const cleanEmail = email.trim();
        const { data } = await api.post("/auth/forgot-password", {
          email: cleanEmail,
        });

        const base =
          data?.message ||
          "Nếu email tồn tại, hệ thống đã gửi hướng dẫn đặt lại mật khẩu.";

        // dev mode: backend trả link
        const fullMsg = data?.link ? `${base}\n(DEV link: ${data.link})` : base;

        setMsg(fullMsg);
        setMsgType("success");
      } catch (e) {
        setMsg(getErrMsg(e));
        setMsgType("error");
      } finally {
        setLoading(false);
      }
    },
    [email, loading]
  );

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">Quên mật khẩu</h3>
        <p className="text-sm text-gray-600 mt-1">
          Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu.
        </p>
      </div>

      {msg && (
        <div
          className={`border-l-4 px-4 py-3 rounded ${
            msgType === "error"
              ? "bg-red-50 border-red-500 text-red-700"
              : "bg-blue-50 border-blue-500 text-blue-700"
          }`}
        >
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
          autoComplete="email"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Đang gửi..." : "Gửi yêu cầu"}
      </button>

      <div className="text-sm text-center text-gray-600">
        Nhớ mật khẩu rồi?{" "}
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Quay lại đăng nhập
        </button>
      </div>
    </form>
  );
}
