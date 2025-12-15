import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Car,
  ClipboardList,
  FileText,
} from "lucide-react";

export const ADMIN_MENU_ITEMS = [
  { to: "/admin/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { to: "/admin/kyc", label: "Duyệt KYC", icon: ShieldCheck },
  { to: "/admin/users", label: "Người dùng", icon: Users },
  { to: "/admin/cars", label: "Xe", icon: Car },
  { to: "/admin/bookings", label: "Đơn hàng", icon: ClipboardList },
  { to: "/admin/blog", label: "Blog", icon: FileText },
];
