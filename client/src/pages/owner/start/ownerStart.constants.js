import {
  DollarSign,
  Shield,
  Clock,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";

export const STEPS = [
  {
    num: 1,
    title: "Đăng ký chủ xe",
    desc: "Điền thông tin cơ bản",
    active: true,
  },
  { num: 2, title: "Xác minh KYC", desc: "Xác minh danh tính", active: false },
  {
    num: 3,
    title: "Đăng tin xe",
    desc: "Hoàn tất và bắt đầu cho thuê",
    active: false,
  },
];

export const BENEFITS = [
  {
    icon: DollarSign,
    title: "Thu nhập ổn định",
    desc: "10-15 triệu/tháng",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: Shield,
    title: "Bảo hiểm toàn diện",
    desc: "An tâm 100%",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Clock,
    title: "Hỗ trợ 24/7",
    desc: "Luôn sẵn sàng",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: TrendingUp,
    title: "Dễ dàng quản lý",
    desc: "Dashboard thông minh",
    color: "text-warning",
    bg: "bg-warning/10",
  },
];

export const STATS = [
  { icon: Users, value: "50K+", label: "Chủ xe" },
  { icon: Award, value: "100%", label: "Bảo hiểm" },
  { icon: TrendingUp, value: "15tr", label: "Thu nhập TB" },
];

export const DEFAULT_FORM = {
  name: "",
  phone: "",
  email: "",
  city: "",
  agree: false,
};
