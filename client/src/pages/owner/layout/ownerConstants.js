import {
  LayoutDashboard,
  Calendar,
  Car,
  ClipboardList,
  BarChart3,
} from "lucide-react";

export const OWNER_MENU = [
  { label: "Tổng quan", path: "/owner/dashboard", icon: LayoutDashboard },
  { label: "Lịch xe", path: "/owner/calendar", icon: Calendar },
  { label: "Quản lý xe", path: "/owner/cars", icon: Car },
  { label: "Đơn hàng", path: "/owner/bookings", icon: ClipboardList },
  { label: "Báo cáo", path: "/owner/reports", icon: BarChart3 },
];
 