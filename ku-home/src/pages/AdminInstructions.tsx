import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Users,
  Calendar,
  Wrench,
  SquarePen,
  QrCode,
  Tag,
  Hotel,
  CalendarCheck,
  Receipt,
} from "lucide-react";
import { useAuth } from "../features/auth/AuthContext";

export function AdminInstructions() {
  const { user } = useAuth();

  const adminFeatures = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      description:
        "View room status grid, manage bookings with check-in/check-out functionality",
      link: "/admin/dashboard",
      color: "bg-blue-50 text-blue-800",
    },
    {
      title: "Housekeeping",
      icon: Wrench,
      description:
        "Mobile-first module with photo uploads, inventory tracking, and room cleaning status",
      link: "/admin/housekeeping",
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Reports & Analytics",
      icon: BarChart3,
      description:
        "Comprehensive reports with data visualization for occupancy, revenue, and performance metrics",
      link: "/admin/reports",
      color: "bg-purple-100 text-purple-800",
    },
    {
      title: "New Booking",
      icon: SquarePen,
      description: "Create group (5+ rooms) or monthly bookings for customers",
      link: "/admin/booking",
      color: "bg-green-50 text-green-800",
    },
    {
      title: "User Management",
      icon: Users,
      description: "Manage staff accounts, roles, and access permissions",
      link: "/admin/users",
      color: "bg-pink-50 text-pink-800",
    },
    {
      title: "Discount Codes",
      icon: Tag,
      description: "Create and manage promotional codes with expiry dates",
      link: "/admin/discounts",
      color: "bg-orange-50 text-orange-700",
    },
    {
      title: "Booking Assignment",
      icon: CalendarCheck,
      description: "Assign specific rooms to bookings and manage room allocations",
      link: "/admin/booking-assignment",
      color: "bg-indigo-50 text-indigo-700",
    },
    {
      title: "Room Management",
      icon: Hotel,
      description: "Manage room inventory, room types, pricing, and availability settings",
      link: "/admin/room-management",
      color: "bg-cyan-50 text-cyan-800",
    },
    {
      title: "Billing & Receipts",
      icon: Receipt,
      description: "Process check-outs, manage housekeeping fines, and generate printable receipts",
      link: "/admin/billing",
      color: "bg-emerald-50 text-emerald-800",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            KU Home Admin Portal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to the comprehensive hospitality management system. Access
            all admin features and manage your property efficiently.
          </p>
          {user && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-[#006b54] text-white rounded-lg">
              <Users className="w-5 h-5 mr-2" />
              <span>Logged in as: {user.name || user.email}</span>
              {user.role && (
                <span className="ml-2 px-2 py-1 bg-white/20 rounded text-sm">
                  ({user.role})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {adminFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                to={feature.link}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-200"
              >
                <div
                  className={`w-16 h-16 rounded-lg ${feature.color} flex items-center justify-center mb-6`}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Link>
            );
          })}
        </div>

        {/* System Info */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            System Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Authentication
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-[#006b54] mr-2">•</span>
                  <span>Dual authentication (KU All Login & Google Login)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#006b54] mr-2">•</span>
                  <span>Role-based access control</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#006b54] mr-2">•</span>
                  <span>Secure session management</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Booking Management
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-[#006b54] mr-2">•</span>
                  <span>
                    Multiple pricing tiers (Standard, Personnel, Group, Monthly)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#006b54] mr-2">•</span>
                  <span>Split billing for up to 4 people</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#006b54] mr-2">•</span>
                  <span>
                    Multiple payment methods (QR, Cash, Department Transfer)
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Housekeeping</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-[#006b54] mr-2">•</span>
                  <span>Mobile-first interface</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#006b54] mr-2">•</span>
                  <span>Photo upload capabilities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#006b54] mr-2">•</span>
                  <span>Inventory tracking and management</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Room & Inventory</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-[#006b54] mr-2">•</span>
                  <span>Dynamic room type configuration (Superior, Deluxe, Suite)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#006b54] mr-2">•</span>
                  <span>Flexible pricing management for different guest categories</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#006b54] mr-2">•</span>
                  <span>Amenity and facility tracking per room level</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Allocation & Logistics</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-[#006b54] mr-2">•</span>
                  <span>Automated and manual room assignment tools</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#006b54] mr-2">•</span>
                  <span>Floor-based organization and status monitoring</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#006b54] mr-2">•</span>
                  <span>Integrated check-in/check-out workflow with billing</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Analytics</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-[#006b54] mr-2">•</span>
                  <span>Real-time occupancy tracking and forecasting</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#006b54] mr-2">•</span>
                  <span>Revenue reports and financial insights</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#006b54] mr-2">•</span>
                  <span>Staff performance and housekeeping metrics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-[#006b54] hover:text-[#005544] font-semibold"
          >
            ← Back to Customer Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
