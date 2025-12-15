import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { DollarSign, Shield, Users, Zap } from "lucide-react";
import { INITIAL_FORM } from "./constants";
import { Hero } from "./components/Hero";
import { Steps } from "./components/Steps";
import { Benefits } from "./components/Benefits";
import { Testimonials } from "./components/Testimonials";
import { ComparisonTable } from "./components/ComparisonTable";
import { RegistrationForm } from "./components/RegistrationForm";

const OwnerRegistration = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState(INITIAL_FORM);

  useEffect(() => {
    if (!user) return;

    setFormData((prev) => ({
      ...prev,
      fullName: prev.fullName || user.name || "",
      phone: prev.phone || user.phone || "",
      email: prev.email || user.email || "",
      city: prev.city || user.city || "",
    }));
  }, [user]);

  const benefits = useMemo(
    () => [
      {
        icon: DollarSign,
        title: "Kiếm thu nhập thụ động dễ dàng",
        desc: "Cho thuê xe khi không sử dụng, thu nhập 10–15 triệu/tháng",
        color: "text-success",
        bg: "bg-success/10",
      },
      {
        icon: Shield,
        title: "An toàn tuyệt đối – EasyRental lo trọn gói",
        desc: "Bảo hiểm chuyến đi & hỗ trợ 24/7, đối soát minh bạch",
        color: "text-primary",
        bg: "bg-primary/10",
      },
      {
        icon: Users,
        title: "Cộng đồng lớn & tin cậy",
        desc: "Hàng chục nghìn chủ xe đang tin dùng",
        color: "text-accent",
        bg: "bg-accent/10",
      },
      {
        icon: Zap,
        title: "Nhanh chóng & tiện lợi",
        desc: "Đăng ký chỉ ~10 phút, duyệt trong 24h",
        color: "text-warning",
        bg: "bg-warning/10",
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Hero />
      <Steps />
      <Benefits benefits={benefits} />
      <Testimonials />
      <ComparisonTable />
      <RegistrationForm
        user={user}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default OwnerRegistration;
