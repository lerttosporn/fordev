// ─── Enums / Union Types ──────────────────────────────────────────────────────

import { PaymentMethod, PaymentStatus } from "./Payment.ts";

export type BookingStatus =
  | 'draft'
  | 'confirmed'
  | 'checked-in'
  | 'checked-out'
  | 'cancelled'
  | 'no-pay'
  | 'no-show';

export type BookingType = 'individual' | 'group' | 'monthly';

// ─── Guest ────────────────────────────────────────────────────────────────────

export interface Guest {
  id?: string;
  title?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  idNumber?: string;
  nationality?: string;
  isKuMember?: boolean;
  kuIdImageUrl?: string;
}

// ─── Billing ──────────────────────────────────────────────────────────────────

export interface BillingEntity {
  id: string;
  name: string;
  address?: string;
  taxId?: string;
  amount: number;
}

// ─── Department Transfer ──────────────────────────────────────────────────────

export interface DepartmentInfo {
  deptName: string;
  erpCode: string;
  contactPerson: string;
  staffId: string;
}

// ─── Room Assignment (group/monthly) ─────────────────────────────────────────

export interface RoomAssignment {
  roomTypeId: string;
  count: number;
  extraBeds: number;
  includeBreakfast: boolean;
}

// ─── Additional Charges ───────────────────────────────────────────────────────

export interface AdditionalCharge {
  label: string;
  amount: number;
  note?: string;
}

// ─── Booking ──────────────────────────────────────────────────────────────────

export interface Booking {
  id: string;
  confirmationNumber?: string;

  // Room
  roomId?: string;
  roomNumber?: string;
  roomType?: string;
  roomAssignments?: RoomAssignment[];  // group/monthly

  // Type & Status
  bookingType: BookingType;
  status: BookingStatus;

  // Dates
  checkIn: string;   // ISO date string
  checkOut: string;  // ISO date string
  nights?: number;

  // Guests
  guests: Guest[];

  // Add-ons
  includeBreakfast?: boolean;
  extraBeds?: number;
  discountCode?: string;

  // Payment
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  paymentProofUrl?: string;
  totalAmount?: number;
  isPaid?: boolean;
  billingEntities?: BillingEntity[];
  departmentInfo?: DepartmentInfo;
  additionalCharges?: AdditionalCharge[];  // early/late check-in/out

  // Meta
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;  // staff id ที่จองให้
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface CreateBookingPayload {
  roomId?: string;
  roomAssignments?: RoomAssignment[];
  bookingType: BookingType;
  checkIn: string;
  checkOut: string;
  guests: Guest[];
  paymentMethod: PaymentMethod;
  includeBreakfast?: boolean;
  extraBeds?: number;
  discountCode?: string;
  notes?: string;
  departmentInfo?: DepartmentInfo;
}

export interface CheckInPayload {
  earlyCheckInFee?: number;
  roomChange?: string;  // roomId ใหม่ถ้าเปลี่ยนห้อง
  notes?: string;
}

export interface CheckOutPayload {
  lateCheckOutFee?: number;
  additionalCharges?: AdditionalCharge[];
  notes?: string;
}

// ─── Response ─────────────────────────────────────────────────────────────────

export interface BookingListResponse {
  bookings: Booking[];
  total?: number;
  page?: number;
  perPage?: number;
}