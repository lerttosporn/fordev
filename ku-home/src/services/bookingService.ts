import { localUrl, projectId } from '../../utils/supabase/info.tsx';
import { BookingStatus, BookingType, CreateBookingPayload } from "../models/index.ts";

export interface Booking {
    id: string;
    roomId: string;
    guestId: string;
    checkIn: string;
    checkOut: string;
    earlyCheckInFee?: number;
    lateCheckOutFee?: number;
    additionalCharges?: number;
    notes?: string;
}

export interface CheckInPayload {
  earlyCheckInFee?: number;
  notes?: string;
}

export interface CheckOutPayload {
  lateCheckOutFee?: number;
  additionalCharges?: number;
  notes?: string;
}

export interface BookingListResponse {
  bookings: Booking[];
  total?: number;
}

// ─── Base URL helper ──────────────────────────────────────────────────────────

const BASE = `${localUrl}/make-server-fb9ae70e`;

function authHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || `Request failed: ${res.status}`);
  }
  return data as T;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const bookingService = {
  /**
   * ดึงรายการจองทั้งหมดของ user ที่ login อยู่
   */
  getMyBookings: async (token: string): Promise<BookingListResponse> => {
    const res = await fetch(`${BASE}/bookings`, {
      headers: authHeaders(token),
    });
    return handleResponse<BookingListResponse>(res);
  },

  /**
   * ดึงรายการจองทั้งหมด (admin/staff)
   */
  getAllBookings: async (
    token: string,
    params?: { status?: BookingStatus; type?: BookingType; date?: string }
  ): Promise<BookingListResponse> => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.type) query.append('type', params.type);
    if (params?.date) query.append('date', params.date);

    const res = await fetch(`${BASE}/admin/bookings?${query.toString()}`, {
      headers: authHeaders(token),
    });
    return handleResponse<BookingListResponse>(res);
  },

  /**
   * ค้นหาการจอง (admin)
   */
  searchBookings: async (
    token: string,
    query: string
  ): Promise<BookingListResponse> => {
    const res = await fetch(
      `${BASE}/admin/bookings/search?q=${encodeURIComponent(query)}`,
      { headers: authHeaders(token) }
    );
    return handleResponse<BookingListResponse>(res);
  },

  /**
   * ดึงข้อมูลการจองตาม id
   */
  getById: async (token: string, bookingId: string): Promise<Booking> => {
    const res = await fetch(`${BASE}/bookings/${bookingId}`, {
      headers: authHeaders(token),
    });
    return handleResponse<Booking>(res);
  },

  /**
   * สร้างการจองใหม่
   */
  create: async (
    token: string,
    payload: CreateBookingPayload
  ): Promise<Booking> => {
    const res = await fetch(`${BASE}/bookings`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    });
    return handleResponse<Booking>(res);
  },

  /**
   * ยกเลิกการจอง
   */
  cancel: async (token: string, bookingId: string): Promise<void> => {
    const res = await fetch(`${BASE}/bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers: authHeaders(token),
    });
    return handleResponse<void>(res);
  },

  /**
   * Check-in (admin/staff)
   */
  checkIn: async (
    token: string,
    bookingId: string,
    payload?: CheckInPayload
  ): Promise<Booking> => {
    const res = await fetch(`${BASE}/admin/bookings/${bookingId}/checkin`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(payload ?? {}),
    });
    return handleResponse<Booking>(res);
  },

  /**
   * Check-out (admin/staff)
   */
  checkOut: async (
    token: string,
    bookingId: string,
    payload?: CheckOutPayload
  ): Promise<Booking> => {
    const res = await fetch(`${BASE}/admin/bookings/${bookingId}/checkout`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(payload ?? {}),
    });
    return handleResponse<Booking>(res);
  },

  /**
   * อัพเดตข้อมูลการจอง (เช่น เลื่อนวัน เปลี่ยนห้อง)
   */
  update: async (
    token: string,
    bookingId: string,
    payload: Partial<CreateBookingPayload>
  ): Promise<Booking> => {
    const res = await fetch(`${BASE}/bookings/${bookingId}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    });
    return handleResponse<Booking>(res);
  },
};