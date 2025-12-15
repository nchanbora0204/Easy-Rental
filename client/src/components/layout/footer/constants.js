import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export const POLICY_LINKS = [
  { to: "/terms", label: "Điều khoản dịch vụ" },
  { to: "/privacy", label: "Chính sách bảo mật" },
  { to: "/cancellation", label: "Chính sách hủy chuyến" },
  { to: "/insurance", label: "Chính sách bảo hiểm" },
  { to: "/payment", label: "Phương thức thanh toán" },
];

export const SUPPORT_LINKS = [
  { to: "/about", label: "Về chúng tôi" },
  { to: "/blog", label: "Blog" },
  { to: "/faq", label: "Câu hỏi thường gặp" },
  { to: "/guide", label: "Hướng dẫn thuê xe" },
  { to: "/contact", label: "Liên hệ" },
];

export const SOCIALS = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
];
