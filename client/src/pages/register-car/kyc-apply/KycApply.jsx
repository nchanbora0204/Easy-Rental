import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { buildInitialForm, buildPreviewReader } from "./kycApplyUtils";
import { getApiErrorMessage } from "./kycApplyUtils";
import { fetchMe, submitKycApply, uploadKycFiles } from "./kycApplyService";

import KycHeader from "./components/KycHeader";
import KycAlert from "./components/KycAlert";
import KycInfoNotice from "./components/KycInfoNotice";
import KycPersonalSection from "./components/KycPersonalSection";
import KycBankSection from "./components/KycBankSection";
import KycUploadSection from "./components/KycUploadSection";
import KycNotesSection from "./components/KycNotesSection";
import KycSubmitSection from "./components/KycSubmitSection";

export const KycApply = ({ initial = {}, onSubmitted }) => {
  const nav = useNavigate();

  const initialForm = useMemo(() => buildInitialForm(initial), [initial]);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const u = await fetchMe();
        if (!alive) return;
        if (u.kycStatus === "pending") nav("/register-car/pending", { replace: true });
        if (u.kycStatus === "approved") nav("/owner/cars/new", { replace: true });
      } catch {
        /* ignore */
      }
    })();
    return () => {
      alive = false;
    };
  }, [nav]);

  const [previews, setPreviews] = useState({
    front: null,
    back: null,
    selfie: null,
    vehicleRegistration: null,
    vehicleInsurance: null,
  });

  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [busy, setBusy] = useState(false);

  const onChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const onPickFile = (field, file, previewKey) => {
    if (!file) return;
    onChange(field, file);
    buildPreviewReader(file, (url) => {
      setPreviews((p) => ({ ...p, [previewKey]: url }));
    });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setMsg("");
    setMsgType("");
    setBusy(true);

    try {
      const upUrls = await uploadKycFiles(form);

      await submitKycApply({
        fullName: form.fullName,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth,
        idNumber: form.idNumber,
        idIssueDate: form.idIssueDate,
        idFrontUrl: upUrls.idFrontUrl,
        idBackUrl: upUrls.idBackUrl,
        selfieWithIdUrl: upUrls.selfieWithIdUrl,
        address: form.address,
        bankAccount: form.bankAccount,
        bankName: form.bankName,
        vehicleRegistrationUrl: upUrls.vehicleRegistrationUrl,
        vehicleInsuranceUrl: upUrls.vehicleInsuranceUrl,
        note: form.note,
      });

      setMsg("Đã nộp hồ sơ thành công! Chúng tôi sẽ xét duyệt trong vòng 24-48 giờ.");
      setMsgType("success");
      onSubmitted?.();
      nav("/register-car/pending", { replace: true });
    } catch (e2) {
      setMsg(getApiErrorMessage(e2, "Có lỗi xảy ra, vui lòng thử lại"));
      setMsgType("error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <KycHeader />
      <KycAlert msg={msg} type={msgType} />
      <KycInfoNotice />

      <div className="card">
        <div className="card-body space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <KycPersonalSection form={form} onChange={onChange} />
            <KycBankSection form={form} onChange={onChange} />
            <KycUploadSection
              previews={previews}
              onPick={onPickFile}
            />
            <KycNotesSection
              value={form.note}
              onChange={(v) => onChange("note", v)}
            />
            <KycSubmitSection busy={busy} onSubmit={handleSubmit} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default KycApply;
