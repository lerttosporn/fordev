import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart3,
  DollarSign,
  Users,
  BedDouble,
  Calendar,
  TrendingUp,
  Download,
  Filter,
  PieChart as PieChartIcon,
  ChevronLeft,
} from "lucide-react";
import { Button } from "../../components/ui/button.tsx";
import { Card } from "../../components/ui/card.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.tsx";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { projectId } from "../../../../utils/supabase/info.tsx";
import { toast } from "sonner";

const COLORS = [
  "#006b54",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#10b981",
];

interface AnalyticsData {
  totalBookings: number;
  totalRevenue: number;
  byPaymentMethod: Record<string, number>;
  byRoomType: Record<string, number>;
  byGuestType: Record<string, number>;
  byStatus: Record<string, number>;
}

export function ReportsAnalytics() {
  const { user, accessToken, loading } = useAuth();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<"daily" | "monthly" | "yearly">(
    "monthly",
  );
  const [activeTab, setActiveTab] = useState<
    "financial" | "rooms" | "guests" | "status" | "supplies"
  >("financial");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  // Check admin access
  useEffect(() => {
    if (
      !loading &&
      (!user || !["admin", "staff"].includes((user as any).role))
    ) {
      toast.error("Access denied: Admin privileges required");
      navigate("/");
    }
  }, [user, loading, navigate]);

  // Load analytics data
  useEffect(() => {
    if (user && accessToken) {
      loadAnalytics();
    }
  }, [user, accessToken, period]);

  const loadAnalytics = async () => {
    setLoadingData(true);
    try {
      // Mock analytics data for demonstration
      const mockAnalytics: AnalyticsData = {
        totalBookings: 156,
        totalRevenue: 423500,
        byPaymentMethod: {
          qr: 89,
          cash: 45,
          department: 22,
        },
        byRoomType: {
          Suite: 65,
          Deluxe: 54,
          Superior: 37,
        },
        byGuestType: {
          individual: 98,
          group: 38,
          monthly: 20,
        },
        byStatus: {
          confirmed: 45,
          "checked-in": 32,
          "checked-out": 68,
          cancelled: 11,
        },
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error("Error loading analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoadingData(false);
    }
  };

  const formatChartData = (data: Record<string, number>) => {
    return Object.entries(data).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  };

  const dailyVolumeData = [
    { date: "Mon", bookings: 12 },
    { date: "Tue", bookings: 19 },
    { date: "Wed", bookings: 15 },
    { date: "Thu", bookings: 22 },
    { date: "Fri", bookings: 28 },
    { date: "Sat", bookings: 31 },
    { date: "Sun", bookings: 29 },
  ];

  const revenueByMonthData = [
    { month: "Jan", revenue: 125000 },
    { month: "Feb", revenue: 138000 },
    { month: "Mar", revenue: 160500 },
    { month: "Apr", revenue: 142000 },
    { month: "May", revenue: 155000 },
    { month: "Jun", revenue: 168000 },
  ];

  const suppliesUsageData = [
    { item: "Blankets", used: 89, available: 211 },
    { item: "Towels", used: 156, available: 244 },
    { item: "Shampoo", used: 234, available: 166 },
    { item: "Water", used: 312, available: 88 },
  ];

  const roomStatusData = [
    { status: "Available", count: 18 },
    { status: "Booked", count: 8 },
    { status: "Repair", count: 3 },
    { status: "Closed", count: 1 },
  ];

  const handleExport = () => {
    toast.success("Report exported successfully");
    // In a real app, generate and download CSV/PDF
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#006b54] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="container mx-auto px-4 py-6">
          {/* ── Back button top-left ── */}
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#006b54] font-medium mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Admin Portal
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Reports & Analytics
              </h1>
              <p className="text-gray-600 mt-1">
                Comprehensive business intelligence dashboard
              </p>
            </div>

            <div className="flex gap-3">
              <Select
                value={period}
                onValueChange={(value: any) => setPeriod(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleExport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ฿{analytics?.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12.5%
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Total Bookings
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {analytics?.totalBookings}
                  </p>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8.3%
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Occupancy Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">73%</p>
                  <p className="text-xs text-orange-600 mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +3.1%
                  </p>
                </div>
                <BedDouble className="w-8 h-8 text-purple-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Avg. Daily Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ฿2,715
                  </p>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +5.7%
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-[#006b54]" />
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <Card className="p-4 h-fit">
            <h2 className="font-bold text-gray-900 mb-4">Report Categories</h2>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("financial")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "financial"
                    ? "bg-[#006b54] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <DollarSign className="w-4 h-4" />
                Financial Reports
              </button>
              <button
                onClick={() => setActiveTab("rooms")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "rooms"
                    ? "bg-[#006b54] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <BedDouble className="w-4 h-4" />
                Room Analysis
              </button>
              <button
                onClick={() => setActiveTab("guests")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "guests"
                    ? "bg-[#006b54] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Users className="w-4 h-4" />
                Guest Demographics
              </button>
              <button
                onClick={() => setActiveTab("status")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "status"
                    ? "bg-[#006b54] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Booking Volume
              </button>
              <button
                onClick={() => setActiveTab("supplies")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "supplies"
                    ? "bg-[#006b54] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <PieChartIcon className="w-4 h-4" />
                Supplies Usage
              </button>
            </nav>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Financial Reports */}
            {activeTab === "financial" && (
              <>
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Revenue by Payment Channel
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={formatChartData(analytics?.byPaymentMethod || {})}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {formatChartData(analytics?.byPaymentMethod || {}).map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ),
                        )}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">QR Payment</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {analytics?.byPaymentMethod.qr || 0}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">bookings</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Cash</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {analytics?.byPaymentMethod.cash || 0}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">bookings</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">
                        Department Transfer
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {analytics?.byPaymentMethod.department || 0}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">bookings</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Monthly Revenue Trend
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueByMonthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#006b54"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </>
            )}

            {/* Room Analysis */}
            {activeTab === "rooms" && (
              <>
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Bookings by Room Type
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={formatChartData(analytics?.byRoomType || {})}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#006b54" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Room Status Distribution
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={roomStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ status, count }) => `${status}: ${count}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {roomStatusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </>
            )}

            {/* Guest Demographics */}
            {activeTab === "guests" && (
              <>
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Guest Type Distribution
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={formatChartData(analytics?.byGuestType || {})}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="p-6 text-center">
                    <Users className="w-12 h-12 text-[#006b54] mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      Walk-in / Individual
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analytics?.byGuestType.individual || 0}
                    </p>
                    <Badge className="mt-3 bg-green-100 text-green-800">
                      63%
                    </Badge>
                  </Card>
                  <Card className="p-6 text-center">
                    <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Group Bookings</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analytics?.byGuestType.group || 0}
                    </p>
                    <Badge className="mt-3 bg-blue-100 text-blue-800">
                      24%
                    </Badge>
                  </Card>
                  <Card className="p-6 text-center">
                    <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Monthly Guests</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analytics?.byGuestType.monthly || 0}
                    </p>
                    <Badge className="mt-3 bg-purple-100 text-purple-800">
                      13%
                    </Badge>
                  </Card>
                </div>
              </>
            )}

            {/* Booking Volume */}
            {activeTab === "status" && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Daily Booking Volume
                </h2>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={dailyVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="bookings" fill="#006b54" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Supplies Usage */}
            {activeTab === "supplies" && (
              <>
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Daily Supplies Usage
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={suppliesUsageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="item" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="used" fill="#f59e0b" name="Used" />
                      <Bar
                        dataKey="available"
                        fill="#10b981"
                        name="Available"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                  {suppliesUsageData.map((item, index) => (
                    <Card key={index} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">{item.item}</h3>
                        <Badge
                          className={
                            item.available > 100
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }
                        >
                          {item.available} left
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Used:</span>
                          <span className="font-medium text-gray-900">
                            {item.used}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Available:</span>
                          <span className="font-medium text-gray-900">
                            {item.available}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                          <div
                            className="bg-[#006b54] h-2 rounded-full"
                            style={{
                              width: `${(item.used / (item.used + item.available)) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
