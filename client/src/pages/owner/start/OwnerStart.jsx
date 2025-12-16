import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

import { DEFAULT_FORM, STEPS, BENEFITS, STATS } from "./ownerStart.constants";
import { getKycMe, getMe, updateMyProfile } from "./ownerStart.service";

import { HeroSection } from "./components/HeroSection";
import { StepsSection } from "./components/StepsSection";
import { BenefitsSection } from "./components/BenefitsSection";
import { OwnerStartForm } from "./components/OwnerStartForm";
import { SecurityNote } from "./components/SecurityNote";
import { AlertMessage } from "./components/AlertMessage";

const OwnerStart = () => {
  const { user } = useAuth();
  const nav = useNavigate();
  const [sp, setSp] = useSearchParams();

  const [form, setForm] = useState(DEFAULT_FORM);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!user) return;
      try {
        const u = await getMe();
        setForm((s) => ({
          ...s,
          name: u.name || "",
          phone: u.phone || "",
          email: u.email || "",
          city: u.city || "",
        }));
      } catch {
        /* empty */
      }
    };
    run();
  }, [user]);

  useEffect(() => {
    const run = async () => {
      if (!user) return;
      try {
        const k = await getKycMe();
        const st = k?.kycStatus;
        if (st === "approved") nav("/owner/cars/new");
        if (st === "pending") nav("/register-car/pending");
      } catch {
        /* empty */
      }
    };
    run();
  }, [user, nav]);

  const openAuth = useCallback(
    (tab) => {
      const next = new URLSearchParams(sp);
      next.set("auth", tab);
      next.set("next", "/register-car/kyc");
      setSp(next, { replace: false });
    },
    [sp, setSp]
  );

  const submit = useCallback(
    async (e) => {
      e.preventDefault();
      setMsg("");
      setMsgType("");

      if (!form.agree) {
        setMsg("Vui lòng đồng ý với điều khoản và chính sách");
        setMsgType("error");
        return;
      }

      if (!user) return openAuth("register");

      try {
        setLoading(true);
        await updateMyProfile({
          name: form.name,
          phone: form.phone,
          city: form.city,
        });
        nav("/register-car/kyc");
      } catch (err) {
        setMsg(err?.response?.data?.message || err?.message || "Có lỗi xảy ra");
        setMsgType("error");
      } finally {
        setLoading(false);
      }
    },
    [form, user, nav, openAuth]
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <HeroSection stats={STATS} />
      <StepsSection steps={STEPS} />
      <BenefitsSection benefits={BENEFITS} />

      <div className="section py-16 bg-[var(--color-surface)]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Đăng ký chủ xe</h2>
            <p className="text-[var(--color-muted)]">
              Điền thông tin bên dưới để bắt đầu hành trình kiếm thu nhập
            </p>
          </div>

          <AlertMessage msg={msg} msgType={msgType} />

          <div className="card shadow-lg">
            <div className="card-body">
              <OwnerStartForm
                user={user}
                form={form}
                setForm={setForm}
                submit={submit}
                loading={loading}
                openAuth={openAuth}
              />
              
            </div>
          </div>

          <SecurityNote />
        </div>
      </div>
    </div>
  );
};

export default OwnerStart;
