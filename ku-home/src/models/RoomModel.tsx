// // ─── Enums / Union Types ──────────────────────────────────────────────────────

// export type RoomStatus =
//   | 'available'
//   | 'booked'
//   | 'checked_in'
//   | 'checked_out'   // make up room — รอ housekeeping
//   | 'repair'        // ปิดซ่อมชั่วคราว
//   | 'unavailable';  // ปิดสำรอง

// export type RoomTypeName = 'Superior' | 'Deluxe' | 'Suite';

// // ─── Rates ────────────────────────────────────────────────────────────────────

// export interface RoomRates {
//   daily: {
//     personnel: number;  // ราคาบุคลากร KU
//     general: number;    // ราคาทั่วไป
//   };
//   group: {
//     min5Rooms: number;
//     min10Rooms: number;
//   };
//   monthly: number;
// }

// // ─── Inventory Item ───────────────────────────────────────────────────────────

// export interface InventoryItem {
//   name: string;
//   expected: number;
//   actual: number;
//   status: 'ok' | 'missing' | 'damaged';
// }

// // ─── Room ─────────────────────────────────────────────────────────────────────

// export interface Room {
//   id: string;
//   roomNumber: string;
//   roomType: RoomTypeName;
//   floor: number;
//   status: RoomStatus;
//   sizeSqM: number;
//   baseGuests: number;
//   maxGuests: number;
//   maxExtraBeds: number;
//   extraBedPrice: number;
//   rates: RoomRates;
//   amenities: string[];
//   images: string[];

//   // Current occupancy (populated when status is booked/checked_in/checked_out)
//   currentBookingId?: string;
//   guestName?: string;
//   checkIn?: string;
//   checkOut?: string;

//   notes?: string;
//   lastCleanedAt?: string;
//   lastCleanedBy?: string;  // housekeeping staff id
// }

// // ─── Room Type (master data) ──────────────────────────────────────────────────

// export interface RoomType {
//   id: string;
//   name: RoomTypeName;
//   description: string;
//   sizeSqM: number;
//   baseGuests: number;
//   maxGuests: number;
//   maxExtraBeds: number;
//   extraBedPrice: number;
//   rates: RoomRates;
//   amenities: string[];
//   images: string[];
// }

// // ─── Housekeeping Record ──────────────────────────────────────────────────────

// export interface HousekeepingRecord {
//   id: string;
//   roomId: string;
//   roomNumber: string;
//   staffId: string;
//   staffName?: string;
//   photos: string[];
//   inventory: InventoryItem[];
//   notes?: string;
//   completedAt: string;
// }

// // ─── Meeting Space ────────────────────────────────────────────────────────────

// export interface MeetingSpace {
//   id: string;
//   type: string;
//   maxGuests: number;
//   rates: {
//     hourly: number;
//     halfDay: number;
//     fullDay: number;
//   };
//   amenities?: string[];
// }

// // ─── Payloads ─────────────────────────────────────────────────────────────────

// export interface UpdateRoomStatusPayload {
//   status: RoomStatus;
//   notes?: string;
// }

// export interface SubmitHousekeepingPayload {
//   photos: string[];
//   inventory: InventoryItem[];
//   notes?: string;
// }

// // ─── Response ─────────────────────────────────────────────────────────────────

// export interface RoomListResponse {
//   rooms: Room[];
//   total?: number;
// }