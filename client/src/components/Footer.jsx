import { Link } from "react-router-dom";
import { 
  Car, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Send,
  ChevronRight,
  Shield,
  Award
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-dark)] text-gray-300 mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <Car size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-white">EasyRental</span>
            </Link>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Nền tảng chia sẻ xe ô tô hàng đầu Việt Nam. Trải nghiệm thuê xe tự lái 
              với hơn 1000+ xe đa dạng, quy trình đơn giản và dịch vụ chuyên nghiệp.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Chính sách</h3>
            <ul className="space-y-3">
              {[
                { to: "/terms", label: "Điều khoản dịch vụ" },
                { to: "/privacy", label: "Chính sách bảo mật" },
                { to: "/cancellation", label: "Chính sách hủy chuyến" },
                { to: "/insurance", label: "Chính sách bảo hiểm" },
                { to: "/payment", label: "Phương thức thanh toán" },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-gray-400 hover:text-accent transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Hỗ trợ</h3>
            <ul className="space-y-3">
              {[
                { to: "/about", label: "Về chúng tôi" },
                { to: "/blog", label: "Blog" },
                { to: "/faq", label: "Câu hỏi thường gặp" },
                { to: "/guide", label: "Hướng dẫn thuê xe" },
                { to: "/contact", label: "Liên hệ" },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-gray-400 hover:text-accent transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Liên hệ</h3>
            <div className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-3">
                <a 
                  href="tel:1900636460" 
                  className="flex items-start gap-3 text-sm text-gray-400 hover:text-accent transition-colors group"
                >
                  <Phone size={18} className="mt-0.5 flex-shrink-0 group-hover:rotate-12 transition-transform" />
                  <div>
                    <div className="font-semibold text-white">1900 63 64 60</div>
                    <div className="text-xs">Tổng đài hỗ trợ 24/7</div>
                  </div>
                </a>
                
                <a 
                  href="mailto:contact@bonboncar.vn" 
                  className="flex items-start gap-3 text-sm text-gray-400 hover:text-accent transition-colors group"
                >
                  <Mail size={18} className="mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold text-white">contact@easyrental.vn</div>
                    <div className="text-xs">Email hỗ trợ</div>
                  </div>
                </a>

                <div className="flex items-start gap-3 text-sm text-gray-400">
                  <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Trụ sở chính</div>
                    <div className="text-xs">
                      162/7 Tân Thới Nhất, Quận 12<br />
                      TP. Hồ Chí Minh, Việt Nam
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-4 border-t border-gray-700">
                <p className="text-sm font-semibold text-white mb-3">Theo dõi chúng tôi</p>
                <div className="flex items-center gap-2">
                  {[
                    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
                    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
                    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-accent hover:text-white transition-all"
                      aria-label={social.label}
                    >
                      <social.icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="border-t border-b border-gray-700 py-8 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-white font-semibold text-xl mb-2">
              Đăng ký nhận tin khuyến mãi
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Nhận thông tin về các chương trình ưu đãi và tin tức mới nhất
            </p>
            <form className="flex gap-2 max-w-md mx-auto">
              <div className="flex-1 relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-[var(--radius-md)] text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <button 
                type="submit"
                className="px-6 py-3 bg-accent text-white rounded-[var(--radius-md)] font-medium hover:bg-accent/90 transition-colors flex items-center gap-2"
              >
                <Send size={18} />
                Đăng ký
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/terms" className="hover:text-accent transition-colors">
              Điều khoản
            </Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-accent transition-colors">
              Bảo mật
            </Link>
            <span>•</span>
            <Link to="/sitemap" className="hover:text-accent transition-colors">
              Sơ đồ trang
            </Link>
          </div>
          
          <div className="text-center md:text-right">
            <p>
              Copyright © {new Date().getFullYear()}{" "}
              <span className="text-accent font-semibold">EasyRental</span>. 
              All Rights Reserved.
            </p>
          </div>
        </div>

        {/* Certification Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-8 border-t border-gray-700 mt-8">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center">
              <Shield size={24} className="text-gray-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-400">Đã xác minh</div>
              <div>Bộ Công Thương</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center">
              <Award size={24} className="text-gray-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-400">Chứng nhận</div>
              <div>ISO 9001:2015</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

