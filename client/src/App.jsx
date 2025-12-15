import { Routes, Route, useLocation, useSearchParams } from "react-router-dom";
import Navbar from "./components/layout/navbar/Navbar";
import Footer from "./components/layout/footer/Footer";
import AuthModal from "./components/AuthModal";
import ProfileModal from "./components/modals/profile/ProfileModal";
import Home from "./pages/home/Home";
import KycApply from "./pages/register-car/kyc-apply/KycApply";
import OwnerDash from "./pages/owner/dashboard/Dashboard";
import CarsList from "./pages/owner/cars/CarsList";
import CarCreate from "./pages/owner/cars/create/CarCreate";
import CarEdit from "./pages/owner/cars/edit/CarEdit";
import OwnerBookings from "./pages/owner/bookings/OwnerBookings";
import AdminDash from "./pages/admin/dashboard/AdminDashboard";
import AdminKyc from "./pages/admin/kyc/AdminKyc";
import AdminUsers from "./pages/admin/users/AdminUsers";
import AdminCars from "./pages/admin/cars/AdminCars";
import AdminBookings from "./pages/admin/bookings/AdminBookings";
import SearchCars from "./pages/search/SearchCars";
import CarDetail from "./pages/car/CarDetail";
import BookCar from "./pages/booking/BookCar";
import PaymentPage from "./pages/payment/PaymentPage";
import MyBookings from "./pages/my-bookings/MyBookings";
import BookingDetail from "./pages/bookingDetail/BookingDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import OwnerStart from "./pages/owner/start/OwnerStart";
import KycPending from "./pages/owner/kyc-pending/KycPending";
import OwnerCalendar from "./pages/owner/calendar/OwnerCalendar";
import OwnerReports from "./pages/owner/reports/OwnerReports";
import AddReview from "./pages/add-review/AddReview";
import Blog from "./pages/blog/Blog";
import BlogDetail from "./pages/blog/BlogDetail";
import AdminBlogList from "./pages/admin/blog/AdminBlogList";
import AdminBlogForm from "./pages/admin/blog/AdminBlogForm";

export default function App() {
  const { pathname } = useLocation();
  const hideFooter =
    pathname.startsWith("/admin") || pathname.startsWith("/owner");

  const [sp, setSp] = useSearchParams();

  const authParam = sp.get("auth");
  const openAuth = authParam === "login" || authParam === "register";
  const closeAuth = () => {
    const q = new URLSearchParams(sp);
    q.delete("auth");
    setSp(q, { replace: true });
  };

  const openProfile = sp.get("profile") === "1";
  const closeProfile = () => {
    const q = new URLSearchParams(sp);
    q.delete("profile");
    setSp(q, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />

          <Route path="/register-car" element={<OwnerStart />} />
          <Route
            path="/register-car/kyc"
            element={
              <ProtectedRoute>
                <KycApply />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register-car/pending"
            element={
              <ProtectedRoute>
                <KycPending />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kyc/apply"
            element={
              <ProtectedRoute>
                <KycApply />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute roles={["owner"]}>
                <OwnerDash />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/calendar"
            element={
              <ProtectedRoute roles={["owner"]}>
                <OwnerCalendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/cars"
            element={
              <ProtectedRoute roles={["owner"]}>
                <CarsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/cars/new"
            element={
              <ProtectedRoute roles={["owner"]}>
                <CarCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/cars/:id/edit"
            element={
              <ProtectedRoute roles={["owner"]}>
                <CarEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/bookings"
            element={
              <ProtectedRoute roles={["owner"]}>
                <OwnerBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/reports"
            element={
              <ProtectedRoute roles={["owner"]}>
                <OwnerReports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDash />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/kyc"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminKyc />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/cars"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminCars />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminBookings />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/blog" element={<AdminBlogList />} />
          <Route path="/admin/blog/new" element={<AdminBlogForm />} />
          <Route path="/admin/blog/:id/edit" element={<AdminBlogForm />} />

          <Route path="/cars/:carId" element={<CarDetail />} />
          <Route path="/search" element={<SearchCars />} />

          <Route
            path="/book/:carId"
            element={
              <ProtectedRoute>
                <BookCar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pay/:bookingId"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route path="/my-booking/:bookingId/review" element={<AddReview />} />

          <Route
            path="/bookings/:bookingId"
            element={
              <ProtectedRoute>
                <BookingDetail />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {!hideFooter && <Footer />}

      <AuthModal
        open={openAuth}
        initialTab={authParam || "login"}
        onClose={closeAuth}
      />
      <ProfileModal open={openProfile} onClose={closeProfile} />
    </div>
  );
}
