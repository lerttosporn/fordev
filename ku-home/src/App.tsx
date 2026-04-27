import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { RoomDetailPage } from "./features/rooms/pages/RoomDetailPage";
import { SearchResultsPage } from "./pages/SearchResultsPage";
import { GuestInfoPage } from "./features/booking/pages/GuestInfoPage";
import { PaymentPage } from "./features/booking/pages/PaymentPage";
import { SuccessPage } from "./features/booking/pages/SuccessPage";
import { UserProfile } from "./pages/UserProfile";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { AuthProvider } from "./features/auth/AuthContext";

import { ServicesPage } from "./pages/ServicesPage";
import { FacilitiesPage } from "./pages/FacilitiesPage";
import { ContactPage } from "./pages/ContactPage";

// Admin pages
import { AdminDashboard } from "./features/admin/AdminDashboard";
import { HousekeepingModule } from "./features/admin/HousekeepingModule";
import { ReportsAnalytics } from "./features/admin/ReportsAnalytics";
import { AdminInstructions } from "./pages/AdminInstructions";
import { AdminBookingPage } from "./features/admin/AdminBookingPage";
import { UserManagement } from "./features/admin/UserManagement";
import { DiscountCodePage } from "./features/admin/DiscountCodePage";
import { BookingAssignmentPage } from "./features/admin/BookingAssignmentPage";
import { AdminBillingPage } from "./features/admin/AdminBillingPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="rooms" element={<SearchResultsPage />} />
            <Route path="room/:id" element={<RoomDetailPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="facilities" element={<FacilitiesPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="booking/guest" element={<GuestInfoPage />} />
            <Route path="booking/payment" element={<PaymentPage />} />
            <Route path="booking/success" element={<SuccessPage />} />
            <Route path="profile" element={<UserProfile />} />

            {/* Admin Routes */}
            <Route path="admin" element={<AdminInstructions />} />
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="admin/housekeeping" element={<HousekeepingModule />} />
            <Route
              path="admin/housekeeping/:roomId"
              element={<HousekeepingModule />}
            />
            <Route path="admin/reports" element={<ReportsAnalytics />} />
            <Route path="admin/booking" element={<AdminBookingPage />} />
            <Route path="admin/users" element={<UserManagement />} />
            <Route path="admin/discounts" element={<DiscountCodePage />} />
            <Route path="admin/booking-assignment" element={<BookingAssignmentPage />} />
            <Route path="admin/billing" element={<AdminBillingPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
