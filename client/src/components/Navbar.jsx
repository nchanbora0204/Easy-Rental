import { NavLink, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Menu,
  X,
  User,
  LogOut,
  Car,
  LayoutDashboard,
  MapPin,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdown, setLocationDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [sp, setSp] = useSearchParams();
  const { pathname } = useLocation();

  // bất kỳ khi đổi route thì đóng các dropdown
  useEffect(() => {
    setMobileMenuOpen(false);
    setLocationDropdown(false);
    setUserDropdown(false);
  }, [pathname]);

  // mở Auth modal qua query (?auth=login|register)
  const openAuth = (tab /* 'login'|'register' */) => {
    const next = new URLSearchParams(sp);
    next.set("auth", tab);
    setSp(next, { replace: false });
    setMobileMenuOpen(false);
  };

  // mở Profile overlay (?profile=1)
  const openProfile = () => {
    const next = new URLSearchParams(sp);
    next.set("profile", "1");
    setSp(next, { replace: false });
    setUserDropdown(false);
    setMobileMenuOpen(false);
  };

  // click-outside for dropdowns
  const locRef = useRef(null);
  const userRef = useRef(null);
  useEffect(() => {
    const onClick = (e) => {
      if (locRef.current && !locRef.current.contains(e.target)) {
        setLocationDropdown(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const cities = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Nha Trang"];

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2 font-bold text-2xl text-accent hover:opacity-80 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <Car size={24} className="text-white" />
            </div>
            <span className="text-accent">EasyRental</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink
              to="/register-car"
              className="text-[var(--color-fg)] hover:text-accent font-medium transition-colors"
            >
              Ký gửi xe
            </NavLink>

            <NavLink
              to="/blog"
              className="text-[var(--color-fg)] hover:text-accent font-medium transition-colors"
            >
              Blog
            </NavLink>

            {/* Location */}
            <div className="relative" ref={locRef}>
              <button
                onClick={() => setLocationDropdown((v) => !v)}
                className="flex items-center gap-2 text-[var(--color-fg)] hover:text-accent font-medium transition-colors"
              >
                <MapPin size={18} />
                Hồ Chí Minh
                <ChevronDown size={16} />
              </button>

              {locationDropdown && (
                <div className="absolute top-full mt-2 right-0 w-56 bg-white rounded-[var(--radius-md)] shadow-lg border border-[var(--color-border)] overflow-hidden">
                  {cities.map((city) => (
                    <button
                      key={city}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-2"
                      onClick={() => setLocationDropdown(false)}
                    >
                      <MapPin size={16} />
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop: Auth / User */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <button
                  onClick={() => openAuth("login")}
                  className="px-4 py-2 rounded-[var(--radius-md)] font-medium text-[var(--color-fg)] hover:bg-gray-50 transition-colors"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => openAuth("register")}
                  className="px-4 py-2 rounded-[var(--radius-md)] font-medium bg-accent text-white hover:opacity-90 transition-opacity"
                >
                  Đăng ký
                </button>
              </>
            ) : (
              <>
                {/* Optional: quick links by role */}
                {user.role === "owner" && (
                  <NavLink
                    to="/owner/dashboard"
                    className={({ isActive }) =>
                      `hidden lg:flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] font-medium transition-colors ${
                        isActive
                          ? "bg-accent/10 text-accent"
                          : "hover:bg-gray-50"
                      }`
                    }
                  >
                    <LayoutDashboard size={18} />
                    Quản lý xe
                  </NavLink>
                )}
                {user.role === "admin" && (
                  <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) =>
                      `hidden lg:flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] font-medium transition-colors ${
                        isActive
                          ? "bg-accent/10 text-accent"
                          : "hover:bg-gray-50"
                      }`
                    }
                  >
                    <LayoutDashboard size={18} />
                    Tổng Quan
                  </NavLink>
                )}

                {/* User dropdown */}
                <div className="relative" ref={userRef}>
                  <button
                    onClick={() => setUserDropdown((v) => !v)}
                    className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] hover:bg-gray-50 transition-colors"
                    aria-haspopup="menu"
                    aria-expanded={userDropdown}
                  >
                    <div className="w-8 h-8 bg-accent/20 rounded-full overflow-hidden flex items-center justify-center">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={18} className="text-accent" />
                      )}
                    </div>
                    <span className="font-medium max-w-[160px] truncate">
                      {user.name || user.email}
                    </span>
                    <ChevronDown size={16} />
                  </button>

                  {userDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-[var(--radius-md)] shadow-lg border border-[var(--color-border)] overflow-hidden">
                      <button
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2"
                        onClick={openProfile}
                      >
                        <User size={16} />
                        Tài khoản
                      </button>

                      <NavLink
                        to="/register-car/pending"
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => setUserDropdown(false)}
                      >
                        <FileCheck size={16} />
                        Trạng thái KYC
                      </NavLink>

                      <NavLink
                        to="/bookings"
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => setUserDropdown(false)}
                      >
                        <ClipboardList size={16} />
                        Đơn thuê của tôi
                      </NavLink>

                      {(user.role === "owner" || user.role === "admin") && (
                        <div className="h-px bg-[var(--color-border)] my-1" />
                      )}

                      {user.role === "owner" && (
                        <NavLink
                          to="/owner/dashboard"
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2"
                          onClick={() => setUserDropdown(false)}
                        >
                          <LayoutDashboard size={16} />
                          Quản lý xe
                          <ChevronRight
                            size={14}
                            className="ml-auto opacity-60"
                          />
                        </NavLink>
                      )}
                      {user.role === "admin" && (
                        <NavLink
                          to="/admin/dashboard"
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2"
                          onClick={() => setUserDropdown(false)}
                        >
                          <LayoutDashboard size={16} />
                          Admin
                          <ChevronRight
                            size={14}
                            className="ml-auto opacity-60"
                          />
                        </NavLink>
                      )}

                      <div className="h-px bg-[var(--color-border)] my-1" />
                      <button
                        onClick={() => {
                          setUserDropdown(false);
                          logout();
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 text-danger flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden p-2 rounded-[var(--radius-md)] hover:bg-gray-50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-white">
          <div className="px-4 py-3 space-y-1">
            <NavLink
              to="/register-car"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-[var(--radius-md)] font-medium hover:bg-gray-50 transition-colors"
            >
              Ký gửi xe
            </NavLink>
            <NavLink
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-[var(--radius-md)] font-medium hover:bg-gray-50 transition-colors"
            >
              Blog
            </NavLink>

            <div className="px-4 py-3">
              <div className="flex items-center gap-2 text-[var(--color-muted)] text-sm mb-2">
                <MapPin size={16} />
                Địa điểm
              </div>
              <select
                className="select w-full text-sm"
                onChange={() => setMobileMenuOpen(false)}
              >
                {cities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="h-px bg-[var(--color-border)] my-3" />

            {!user ? (
              <div className="space-y-2">
                <button
                  onClick={() => openAuth("login")}
                  className="block w-full px-4 py-3 text-center rounded-[var(--radius-md)] font-medium bg-accent text-white"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => openAuth("register")}
                  className="block w-full px-4 py-3 text-center rounded-[var(--radius-md)] font-medium border border-accent text-accent"
                >
                  Đăng ký
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-full overflow-hidden flex items-center justify-center">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={20} className="text-accent" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{user.name || "User"}</p>
                    <p className="text-sm text-[var(--color-muted)]">
                      {user.email}
                    </p>
                  </div>
                </div>

                {user.role === "owner" && (
                  <NavLink
                    to="/owner/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-[var(--radius-md)] font-medium hover:bg-gray-50 transition-colors"
                  >
                    <LayoutDashboard size={18} />
                    Quản lý xe
                  </NavLink>
                )}
                {user.role === "admin" && (
                  <NavLink
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-[var(--radius-md)] font-medium hover:bg-gray-50 transition-colors"
                  >
                    <LayoutDashboard size={18} />
                    Admin Dashboard
                  </NavLink>
                )}

                <button
                  onClick={openProfile}
                  className="flex items-center gap-2 w-full px-4 py-3 rounded-[var(--radius-md)] font-medium hover:bg-gray-50 transition-colors"
                >
                  <User size={18} />
                  Tài khoản
                </button>

                <NavLink
                  to="/register-car/pending"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-[var(--radius-md)] font-medium hover:bg-gray-50 transition-colors"
                >
                  <FileCheck size={18} />
                  Trạng thái KYC
                </NavLink>

                <NavLink
                  to="/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-[var(--radius-md)] font-medium hover:bg-gray-50 transition-colors"
                >
                  <ClipboardList size={18} />
                  Đơn thuê của tôi
                </NavLink>

                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 rounded-[var(--radius-md)] font-medium text-danger hover:bg-red-50 transition-colors"
                >
                  <LogOut size={18} />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
