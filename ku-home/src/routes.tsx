// import { createBrowserRouter } from "react-router";
// import { Layout } from "./Layout.tsx";
// import { HomePage } from "./pages/HomePage.tsx";
// import { SuiteDetailPage } from "./pages/SuiteDetailPage.tsx";
// import { GuestInfoPage } from "./pages/booking/GuestInfoPage.tsx";
// import { PaymentPage } from "./pages/booking/PaymentPage.tsx";
// import { SuccessPage } from "./pages/booking/SuccessPage.tsx";
// import { UserProfile } from "./pages/UserProfile.tsx";
// import { ServicesPage } from "./pages/ServicesPage.tsx";
// import { FacilitiesPage } from "./pages/FacilitiesPage.tsx";
// import { ContactPage } from "./pages/ContactPage.tsx";
// // Placeholders for new pages
// import { AdminDashboard } from "./pages/admin/AdminDashboard.tsx";
// // import { StaffDashboard } from "./pages/staff/StaffDashboard.tsx";
// import { SearchResultsPage } from "./pages/SearchResultsPage.tsx";
// import { AdminInstructions } from "./pages/AdminInstructions.tsx";
// import { HousekeepingModule } from "./pages/admin/HousekeepingModule.tsx";
// import { ReportsAnalytics } from "./pages/admin/ReportsAnalytics.tsx";

// export const router = createBrowserRouter([
//   {
//     path: "/",
//     Component: Layout,
//     children: [
//       { index: true, Component: HomePage },
//       // Both 'rooms' and legacy 'search' path serve the same page
//       { path: "rooms", Component: SearchResultsPage },
//       { path: "search", Component: SearchResultsPage },
//       { path: "room/:id", Component: SuiteDetailPage },
//       { path: "services", Component: ServicesPage },
//       { path: "facilities", Component: FacilitiesPage },
//       { path: "contact", Component: ContactPage },
//       { path: "booking/guest", Component: GuestInfoPage },zz
//       { path: "booking/payment", Component: PaymentPage },
//       { path: "booking/success", Component: SuccessPage },
//       { path: "profile", Component: UserProfile },
//     ],
//   },
//   { path: "admin", Component: AdminInstructions },
//   { path: "admin/dashboard", Component: AdminDashboard },
//   { path: "admin/housekeeping", Component: HousekeepingModule },
//   { path: "admin/housekeeping/:roomId", Component: HousekeepingModule },
//   { path: "admin/reports", Component: ReportsAnalytics },
//   {
//     path: "/staff",
//     // Component: StaffDashboard,
//   },
// ]);
