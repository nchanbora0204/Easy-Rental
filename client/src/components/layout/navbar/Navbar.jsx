import { NavLink, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { Car, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import DesktopNav from "./DesktopNav";
import DesktopUserMenu from "./DesktopUserMenu";
import MobileMenu from "./MobileMenu";
import { useOutsideClick } from "./hooks/useOutsideClick";

const Navbar = () => {
  const { user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdown, setLocationDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const [sp, setSp] = useSearchParams();
  const { pathname } = useLocation();

  const locRef = useRef(null);
  const userRef = useRef(null);

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setLocationDropdown(false);
    setUserDropdown(false);
  }, [pathname]);

  // Click outside close
  useOutsideClick([locRef], () => setLocationDropdown(false));
  useOutsideClick([userRef], () => setUserDropdown(false));

  const updateQuery = useCallback(
    (key, value, options = { replace: false }) => {
      const next = new URLSearchParams(sp);
      next.set(key, value);
      setSp(next, options);
    },
    [sp, setSp]
  );

  const openAuth = useCallback(
    (tab) => {
      updateQuery("auth", tab);
      setMobileMenuOpen(false);
    },
    [updateQuery]
  );

  const openProfile = useCallback(() => {
    updateQuery("profile", "1");
    setUserDropdown(false);
    setMobileMenuOpen(false);
  }, [updateQuery]);

  const closeMobile = useCallback(() => setMobileMenuOpen(false), []);
  const toggleMobile = useCallback(() => setMobileMenuOpen((v) => !v), []);

  const handleLogout = useCallback(() => {
    setUserDropdown(false);
    setMobileMenuOpen(false);
    logout();
  }, [logout]);

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2 font-bold text-2xl text-accent hover:opacity-80 transition-opacity"
            onClick={closeMobile}
          >
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <Car size={24} className="text-white" />
            </div>
            <span className="text-accent">EasyRental</span>
          </NavLink>

          {/* Desktop Navigation */}
          <DesktopNav
            locationOpen={locationDropdown}
            onToggleLocation={() => setLocationDropdown((v) => !v)}
            onCloseLocation={() => setLocationDropdown(false)}
            locRef={locRef}
          />

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
              <DesktopUserMenu
                user={user}
                userDropdown={userDropdown}
                onToggleUserDropdown={() => setUserDropdown((v) => !v)}
                onCloseUserDropdown={() => setUserDropdown(false)}
                userRef={userRef}
                onOpenProfile={openProfile}
                onLogout={handleLogout}
              />
            )}
          </div>

          {/* Mobile button */}
          <button
            onClick={toggleMobile}
            className="md:hidden p-2 rounded-[var(--radius-md)] hover:bg-gray-50 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <MobileMenu
          user={user}
          onClose={closeMobile}
          onOpenAuth={openAuth}
          onOpenProfile={openProfile}
          onLogout={handleLogout}
        />
      )}
    </nav>
  );
};

export default Navbar;
