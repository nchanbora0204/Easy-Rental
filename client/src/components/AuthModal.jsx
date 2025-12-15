import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import LoginForm from "./auth/Login";
import RegisterForm from "./auth/Register";
import ForgotPasswordForm from "./auth/ForgotPasswordForm";

const AUTH_TABS = new Set(["login", "register", "forgot", "reset"]);

const AuthModal = () => {
  const [sp, setSp] = useSearchParams();

  const tab = sp.get("auth") || "";
  const token = sp.get("token") || sp.get("t") || "";

  const open = useMemo(() => AUTH_TABS.has(tab), [tab]);

  const setTab = useCallback(
    (nextTab) => {
      const next = new URLSearchParams(sp);
      next.set("auth", nextTab);
      if (nextTab !== "reset") next.delete("token");
      setSp(next, { replace: true });
    },
    [sp, setSp]
  );

  const onClose = useCallback(() => {
    const next = new URLSearchParams(sp);
    next.delete("auth");
    next.delete("token");
    setSp(next, { replace: true });
  }, [sp, setSp]);

  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open) return null;

  const showTabs = tab === "login" || tab === "register";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          {showTabs ? (
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
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
                type="button"
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
          ) : (
            <div className="text-sm font-semibold text-gray-800">
              {tab === "forgot"
                ? "Quên mật khẩu"
                : tab === "reset"
                ? "Đặt lại mật khẩu"
                : "Tài khoản"}
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1"
            aria-label="Đóng"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
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
                  type="button"
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

          {tab === "reset" && (
            <div className="text-sm text-gray-600">
              Token reset: <span className="font-mono">{token || "—"}</span>
              {/* TODO: render ResetPasswordForm ở đây */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
