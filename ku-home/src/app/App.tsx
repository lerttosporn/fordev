import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./Layout.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { RoomDetailPage } from "./pages/RoomDetailPage.tsx";
import { SearchResultsPage } from "./pages/SearchResultsPage.tsx";
import { GuestInfoPage } from "./pages/booking/GuestInfoPage.tsx";
import { PaymentPage } from "./pages/booking/PaymentPage.tsx";
import { SuccessPage } from "./pages/booking/SuccessPage.tsx";
import { UserProfile } from "./pages/UserProfile.tsx";
import { ScrollToTop } from "./components/ScrollToTop.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";

import { ServicesPage } from "./pages/ServicesPage.tsx";
import { FacilitiesPage } from "./pages/FacilitiesPage.tsx";
import { ContactPage } from "./pages/ContactPage.tsx";

// Admin pages
import { AdminDashboard } from "./pages/admin/AdminDashboard.tsx";
import { HousekeepingModule } from "./pages/admin/HousekeepingModule.tsx";
import { ReportsAnalytics } from "./pages/admin/ReportsAnalytics.tsx";
import { AdminInstructions } from "./pages/AdminInstructions.tsx";
import { AdminBookingPage } from "./pages/admin/AdminBookingPage.tsx";
import { UserManagement } from "./pages/admin/UserManagement.tsx";
import { DiscountCodePage } from "./pages/admin/DiscountCodePage.tsx";
import { BookingAssignmentPage } from "./pages/admin/BookingAssignmentPage.tsx";
import { AdminBillingPage } from "./pages/admin/AdminBillingPage.tsx";

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
