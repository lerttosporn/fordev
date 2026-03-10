import { createBrowserRouter } from "react-router";
import { Layout } from "./Layout.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { SuiteDetailPage } from "./pages/SuiteDetailPage.tsx";
import { GuestInfoPage } from "./pages/booking/GuestInfoPage.tsx";
import { PaymentPage } from "./pages/booking/PaymentPage.tsx";
import { SuccessPage } from "./pages/booking/SuccessPage.tsx";
import { UserProfile } from "./pages/UserProfile.tsx";
import { ServicesPage } from "./pages/ServicesPage.tsx";
import { FacilitiesPage } from "./pages/FacilitiesPage.tsx";
import { ContactPage } from "./pages/ContactPage.tsx";
// Placeholders for new pages
import { AdminDashboard } from "./pages/admin/AdminDashboard.tsx";
// import { StaffDashboard } from "./pages/staff/StaffDashboard.tsx";
import { SearchResultsPage } from "./pages/SearchResultsPage.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "search", Component: SearchResultsPage },
      { path: "room/:id", Component: SuiteDetailPage },
      { path: "services", Component: ServicesPage },
      { path: "facilities", Component: FacilitiesPage },
      { path: "contact", Component: ContactPage },
      { path: "booking/guest", Component: GuestInfoPage },
      { path: "booking/payment", Component: PaymentPage },
      { path: "booking/success", Component: SuccessPage },
      { path: "profile", Component: UserProfile },
    ],
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "/staff",
    // Component: StaffDashboard,
  }
]);
