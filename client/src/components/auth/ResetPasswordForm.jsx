import { useCallback, useState } from "react";
import api from "../../lib/axios";

const getErrMsg = (e) =>
  e?.response?.data?.message || e?.message || "Đặt lại mật khẩu thất bại";

export default function ResetPasswordForm({ token, onSuccess, onBack }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); 
  const [loading, setLoading] = useState(false);

  const submit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;
      if (!token) {
        setMsg("Thiếu token đặt lại mật khẩu. Vui lòng thử lại từ email.");
        setMsgType("error");
        return;
      }
      if (password.trim().length < 6) {
        setMsg("Mật khẩu phải tối thiểu 6 ký tự.");
        setMsgType("error");
        return;
      }
      if (password !== confirm) {
        setMsg("Xác nhận mật khẩu không khớp.");
        setMsgType("error");
        return;
      }

      setMsg("");
      setMsgType("");
      setLoading(true);

      try {
        const { data } = await api.post("/auth/reset-password", {
          token,
          password: password.trim(),
        });
        setMsg(data?.message || "Đặt lại mật khẩu thành công. Đăng nhập nhé.");
        setMsgType("success");
        onSuccess?.();
      } catch (e) {
        setMsg(getErrMsg(e));
        setMsgType("error");
      } finally {
        setLoading(false);
      }
    },
    [token, password, confirm, loading, onSuccess]
  );

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">
          Đặt lại mật khẩu
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Nhập mật khẩu mới cho tài khoản của bạn.
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
          Mật khẩu mới
        </label>
        <input
          type="password"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Xác nhận mật khẩu
        </label>
        <input
          type="password"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="******"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
      </button>

      <div className="text-sm text-center text-gray-600">
        <button
          type="button"
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Quay lại
        </button>
      </div>
    </form>
  );
}
