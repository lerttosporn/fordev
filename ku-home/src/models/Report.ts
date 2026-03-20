// ─── Enums / Union Types ──────────────────────────────────────────────────────

export type ReportPeriod = 'daily' | 'monthly' | 'yearly';

// ─── Financial ────────────────────────────────────────────────────────────────

export interface RevenueByPeriod {
  label: string;  // เช่น 'Jan', '2025-03-01'
  revenue: number;
  bookings: number;
}

export interface RevenueByPaymentMethod {
  qr: number;
  cash: number;
  department: number;
}

// ─── Room ─────────────────────────────────────────────────────────────────────

export interface OccupancyByRoomType {
  roomType: string;
  bookings: number;
  occupancyRate: number;  // 0–100
}

export interface RoomStatusSummary {
  available: number;
  booked: number;
  checked_in: number;
  checked_out: number;
  repair: number;
  unavailable: number;
  total: number;
}

// ─── Guest ────────────────────────────────────────────────────────────────────

export interface GuestTypeSummary {
  individual: number;
  group: number;
  monthly: number;
  department: number;
}

// ─── Supplies ─────────────────────────────────────────────────────────────────

export interface SupplyUsage {
  item: string;
  used: number;
  available: number;
  unit?: string;
}

// ─── Analytics (combined) ─────────────────────────────────────────────────────

export interface AnalyticsData {
  period: ReportPeriod;
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  avgDailyRate: number;
  revenueByPeriod: RevenueByPeriod[];
  revenueByPaymentMethod: RevenueByPaymentMethod;
  byRoomType: OccupancyByRoomType[];
  byGuestType: GuestTypeSummary;
  roomStatus: RoomStatusSummary;
  suppliesUsage: SupplyUsage[];
}