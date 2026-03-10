import { Navbar } from "./components/Navbar.tsx";
import { Footer } from "./components/Footer.tsx";
import { Outlet } from "react-router-dom";
import { Toaster } from "./components/ui/sonner.tsx";

export function Layout() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-[#006b54] selection:text-white flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}