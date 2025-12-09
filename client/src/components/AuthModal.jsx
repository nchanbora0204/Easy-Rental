import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import LoginForm from "./auth/Login";
import RegisterForm from "./auth/Register";
import ForgotPasswordForm from "./auth/ForgotPasswordForm";

export default function AuthModal() {
  const [sp, setSp] = useSearchParams();
  const tab = sp.get("auth");
  const open = ["login", "register", "forgot", "reset"].includes(tab);
  const token = sp.get("token") || sp.get("t") || "";

  const setTab = (nextTab) => {
    const next = new URLSearchParams(sp);
    next.set("auth", nextTab);
    if (nextTab !== "reset") next.delete("token");
    setSp(next, { replace: true });
  };

  const onClose = () => {
    const next = new URLSearchParams(sp);
    next.delete("auth");
    next.delete("token");
    setSp(next, { replace: true });
  };

  useEffect(() => {
    const h = (e) => e.key === "Escape" && open && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setTab("login")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                tab === "login"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => setTab("register")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                tab === "register"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Đăng ký
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {tab === "login" && (
            <>
              <LoginForm onSuccess={onClose} />
              <div className="mt-4 text-sm text-right">
                <button
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => setTab("forgot")}
                >
                  Quên mật khẩu?
                </button>
              </div>
            </>
          )}

          {tab === "register" && <RegisterForm onSuccess={onClose} />}

          {tab === "forgot" && (
            <ForgotPasswordForm onBackToLogin={() => setTab("login")} />
          )}
        </div>
      </div>
    </div>
  );
}