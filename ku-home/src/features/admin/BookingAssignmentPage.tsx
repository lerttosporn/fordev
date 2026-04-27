import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  BedDouble,
  Calendar,
  Users,
  CheckCircle2,
  X,
  Search,
  Filter,
  Clock,
  AlertCircle,
  Check,
  Pencil,
} from "lucide-react";
import { Input } from "../../components/ui/input.tsx";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type BookingStatus = "pending_assignment" | "assigned" | "confirmed" | "checked-in";
type RoomTypeName = "Superior" | "Deluxe" | "Suite";

interface PendingBooking {
  id: string;
  confirmationNumber: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  roomType: RoomTypeName;
  checkIn: string;
  checkOut: string;
  guests: number;
  extraBeds: number;
  includeBreakfast: boolean;
  totalAmount: number;
  status: BookingStatus;
  assignedRoom?: string;
  bookingType: "individual" | "group" | "monthly";
  createdAt: string;
  notes?: string;
}

interface AvailableRoom {
  id: string;
  roomNumber: string;
  roomType: RoomTypeName;
  floor: number;
  status: "available";
}

// ─── Mock data ────────────────────────────────────────────────────────────────
function getBookingDates() {
  const checkInDate = new Date();

  // สร้างตัวแปรสำหรับ Check-out และบวกเพิ่มไป 3 วัน
  const checkOutDate = new Date(checkInDate);
  checkOutDate.setDate(checkInDate.getDate() + 3);

  // ฟังก์ชันย่อยสำหรับจัดฟอร์แมตเป็น YYYY-MM-DD
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มจาก 0 เลยต้อง +1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return {
    checkIn: formatDate(checkInDate),
    checkOut: formatDate(checkOutDate)
  };
}
const MOCK_BOOKINGS: PendingBooking[] = [
  {
    id: "b001",
    confirmationNumber: "KU-8291-AB",
    guestName: "สมชาย ใจดี",
    guestEmail: "somchai@gmail.com",
    guestPhone: "081-234-5678",
    roomType: "Superior",
    checkIn: getBookingDates().checkIn,
    checkOut: getBookingDates().checkOut,
    guests: 2,
    extraBeds: 0,
    includeBreakfast: true,
    totalAmount: 2600,
    status: "pending_assignment",
    bookingType: "individual",
    createdAt: "2025-03-18T09:21:00",
  },
  {
    id: "b002",
    confirmationNumber: "KU-5512-CD",
    guestName: "Dr. Sarah Johnson",
    guestEmail: "sarah.j@university.edu",
    guestPhone: "082-345-6789",
    roomType: "Suite",
    checkIn: getBookingDates().checkIn,
    checkOut: getBookingDates().checkOut,
    guests: 3,
    extraBeds: 1,
    includeBreakfast: false,
    totalAmount: 4100,
    status: "pending_assignment",
    bookingType: "individual",
    createdAt: "2025-03-18T11:05:00",
    // notes: "Late check-in requested (after 8PM)",
  },
  {
    id: "b003",
    confirmationNumber: "KU-3847-EF",
    guestName: "นิดา พรอำไพ",
    guestEmail: "nida.p@ku.ac.th",
    guestPhone: "083-456-7890",
    roomType: "Deluxe",
    checkIn: getBookingDates().checkIn,
    checkOut: getBookingDates().checkOut,
    guests: 2,
    extraBeds: 0,
    includeBreakfast: true,
    totalAmount: 2700,
    status: "assigned",
    assignedRoom: "D201",
    bookingType: "individual",
    createdAt: new Date().toISOString(),
  },
  {
    id: "b004",
    confirmationNumber: "KU-7723-GH",
    guestName: "Prof. Wiroj Tanaka",
    guestEmail: "wiroj@engr.ku.ac.th",
    roomType: "Superior",
    checkIn: getBookingDates().checkIn,
    checkOut: getBookingDates().checkOut,
    guests: 1,
    extraBeds: 0,
    includeBreakfast: false,
    totalAmount: 2000,
    status: "pending_assignment",
    bookingType: "individual",
    createdAt: "2025-03-19T08:15:00",
  },
  {
    id: "b005",
    confirmationNumber: "KU-4491-IJ",
    guestName: "วันเพ็ญ กิตติ",
    guestEmail: "wanpen.k@gmail.com",
    guestPhone: "085-678-9012",
    roomType: "Deluxe",
    checkIn: getBookingDates().checkIn,
    checkOut: getBookingDates().checkOut,
    guests: 2,
    extraBeds: 1,
    includeBreakfast: true,
    totalAmount: 5550,
    status: "pending_assignment",
    bookingType: "individual",
    createdAt: "2025-03-19T10:44:00",
    // notes: "Honeymoon couple — flowers in room requested",
  },
  {
    id: "b006",
    confirmationNumber: "KU-6612-KL",
    guestName: "John Smith",
    guestEmail: "john.s@corp.com",
    guestPhone: "086-789-0123",
    roomType: "Suite",
    checkIn: getBookingDates().checkIn,
    checkOut: getBookingDates().checkOut,
    guests: 4,
    extraBeds: 2,
    includeBreakfast: true,
    totalAmount: 8400,
    status: "assigned",
    assignedRoom: "T301",
    bookingType: "individual",
    createdAt: "2025-03-16T16:20:00",
  },
];

const AVAILABLE_ROOMS: AvailableRoom[] = [
  { id: "s101", roomNumber: "S101", roomType: "Superior", floor: 1, status: "available" },
  { id: "s102", roomNumber: "S102", roomType: "Superior", floor: 1, status: "available" },
  { id: "s103", roomNumber: "S103", roomType: "Superior", floor: 1, status: "available" },
  { id: "s201", roomNumber: "S201", roomType: "Superior", floor: 2, status: "available" },
  { id: "s202", roomNumber: "S202", roomType: "Superior", floor: 2, status: "available" },
  { id: "d201", roomNumber: "D201", roomType: "Deluxe", floor: 2, status: "available" },
  { id: "d202", roomNumber: "D202", roomType: "Deluxe", floor: 2, status: "available" },
  { id: "d203", roomNumber: "D203", roomType: "Deluxe", floor: 2, status: "available" },
  { id: "d301", roomNumber: "D301", roomType: "Deluxe", floor: 3, status: "available" },
  { id: "d302", roomNumber: "D302", roomType: "Deluxe", floor: 3, status: "available" },
  { id: "t301", roomNumber: "T301", roomType: "Suite", floor: 3, status: "available" },
  { id: "t302", roomNumber: "T302", roomType: "Suite", floor: 3, status: "available" },
  { id: "t401", roomNumber: "T401", roomType: "Suite", floor: 4, status: "available" },
  { id: "t402", roomNumber: "T402", roomType: "Suite", floor: 4, status: "available" },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const ROOM_TYPE_COLOR: Record<RoomTypeName, { bg: string; text: string; dot: string }> = {
  Superior: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
  Deluxe: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400" },
  Suite: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
};

const STATUS_LABEL: Record<BookingStatus, { label: string; color: string }> = {
  pending_assignment: { label: "รอ Assign ห้อง", color: "bg-orange-100 text-orange-700" },
  assigned: { label: "Assign แล้ว", color: "bg-green-100 text-green-700" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700" },
  "checked-in": { label: "Check-in แล้ว", color: "bg-indigo-100 text-indigo-700" },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();

  // แปลงเป็น "นาที" ก่อน (1 นาที = 60,000 มิลลิวินาที)
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "เพิ่งจอง";
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ชม. ที่แล้ว`;

  const days = Math.floor(hours / 24);
  return `${days} วันที่แล้ว`;
}


// ─── Assign Modal ─────────────────────────────────────────────────────────────

function AssignModal({
  booking,
  usedRooms,
  onClose,
  onAssign,
}: {
  booking: PendingBooking;
  usedRooms: Set<string>;
  onClose: () => void;
  onAssign: (bookingId: string, roomNumber: string) => void;
}) {
  const [selected, setSelected] = useState<string>(booking.assignedRoom || "");
  const compatible = AVAILABLE_ROOMS.filter((r) => r.roomType === booking.roomType);
  const byFloor = compatible.reduce(
    (acc, r) => {
      if (!acc[r.floor]) acc[r.floor] = [];
      acc[r.floor].push(r);
      return acc;
    },
    {} as Record<number, AvailableRoom[]>
  );
  const col = ROOM_TYPE_COLOR[booking.roomType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#006b54] px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Assign ห้องพัก</h2>
            <p className="text-green-100 text-sm mt-0.5">
              {booking.confirmationNumber} · {booking.guestName}
            </p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Booking summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-5 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-0.5">ประเภทห้อง</p>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${col.bg} ${col.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
                {booking.roomType}
              </span>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">ผู้เข้าพัก</p>
              <p className="font-semibold text-gray-800">
                {booking.guests} คน{booking.extraBeds > 0 ? ` + เสริม ${booking.extraBeds} เตียง` : ""}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Check-in</p>
              <p className="font-semibold text-gray-800">{formatDate(booking.checkIn)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Check-out</p>
              <p className="font-semibold text-gray-800">{formatDate(booking.checkOut)}</p>
            </div>
          </div>

          {/* Room selector */}
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
            เลือกห้อง {booking.roomType} ที่ว่าง
          </p>

          {Object.entries(byFloor)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([floor, rooms]) => (
              <div key={floor} className="mb-4">
                <p className="text-xs text-gray-400 font-semibold mb-2">ชั้น {floor}</p>
                <div className="grid grid-cols-4 gap-2">
                  {rooms.map((room) => {
                    const occupied = usedRooms.has(room.roomNumber) && room.roomNumber !== booking.assignedRoom;
                    const isSelected = selected === room.roomNumber;
                    return (
                      <button
                        key={room.id}
                        onClick={() => !occupied && setSelected(room.roomNumber)}
                        disabled={occupied}
                        className={`relative py-3 rounded-xl border-2 text-sm font-bold transition-all ${occupied
                          ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                          : isSelected
                            ? "border-[#006b54] bg-[#006b54]/8 text-[#006b54] shadow-sm"
                            : "border-gray-200 bg-white text-gray-700 hover:border-[#006b54]/40 hover:shadow-sm"
                          }`}
                      >
                        {isSelected && (
                          <span className="absolute top-1 right-1">
                            <Check className="w-3 h-3 text-[#006b54]" />
                          </span>
                        )}
                        {room.roomNumber}
                        {occupied && (
                          <span className="block text-[9px] font-normal text-gray-300 mt-0.5">จองแล้ว</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

          {/* {booking.notes && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 text-sm text-amber-700 mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{booking.notes}</span>
            </div>
          )} */}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={() => {
              if (!selected) return;
              onAssign(booking.id, selected);
            }}
            disabled={!selected}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${selected
              ? "bg-[#006b54] hover:bg-[#005a46] text-white shadow-md"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Assign ห้อง {selected || "..."}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Dates Modal ─────────────────────────────────────────────────────────

function EditDatesModal({
  booking,
  onClose,
  onSave,
}: {
  booking: PendingBooking;
  onClose: () => void;
  onSave: (bookingId: string, newCheckIn: string, newCheckOut: string) => void;
}) {
  const [ci, setCi] = useState(booking.checkIn);
  const [co, setCo] = useState(booking.checkOut);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-[#006b54] px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">แก้ไขวันที่เข้าพัก</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Check-in</label>
            <Input type="date" value={ci} onChange={(e) => setCi(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Check-out</label>
            <Input type="date" value={co} onChange={(e) => setCo(e.target.value)} />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            ยกเลิก
          </button>
          <button
            onClick={() => onSave(booking.id, ci, co)}
            disabled={!ci || !co || ci >= co}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#006b54] hover:bg-[#005a46] text-white text-sm font-bold shadow-md disabled:bg-gray-200 disabled:text-gray-400"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Booking Card ─────────────────────────────────────────────────────────────

function BookingCard({
  booking,
  onAssign,
  onEditDates,
}: {
  booking: PendingBooking;
  onAssign: () => void;
  onEditDates: () => void;
}) {
  const col = ROOM_TYPE_COLOR[booking.roomType];
  const st = STATUS_LABEL[booking.status];
  const isPending = booking.status === "pending_assignment";

  return (
    <div
      // 1. เพิ่ม h-full flex flex-col ที่กล่องนอกสุด
      className={`h-full flex flex-col bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${isPending ? "border-orange-200 shadow-sm hover:shadow-md" : "border-gray-100 hover:shadow-sm"
        }`}
    >
      {/* 2. เพิ่ม flex flex-col flex-1 ที่กล่องเนื้อหา */}
      <div className="p-5 flex flex-col flex-1">

        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-mono text-sm font-bold text-gray-900 tracking-wider">
                {booking.confirmationNumber}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${st.color}`}>
                {st.label}
              </span>
            </div>
            <p className="font-semibold text-gray-900 truncate">{booking.guestName}</p>
            <p className="text-xs text-gray-400 truncate">{booking.guestEmail}</p>
          </div>
          <span
            className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${col.bg} ${col.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
            {booking.roomType}
          </span>
        </div>

        {/* Dates row */}
        <div className="flex items-center justify-between gap-3 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span>{formatDate(booking.checkIn)}</span>
            <span className="text-gray-300">→</span>
            <span>{formatDate(booking.checkOut)}</span>
          </div>
          {booking.assignedRoom && (
            <button onClick={onEditDates} className="flex items-center gap-1 text-[#006b54] font-medium text-xs hover:underline flex-shrink-0">
              <Pencil className="w-3 h-3" /> แก้ไขวันที่
            </button>
          )}
        </div>

        {/* Info chips */}
        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
            <Users className="w-3 h-3" />
            {booking.guests} คน
            {booking.extraBeds > 0 && ` + เสริม ${booking.extraBeds}`}
          </span>
          {booking.includeBreakfast && (
            <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">🍳 มีอาหารเช้า</span>
          )}
          <span className="bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium ml-auto">
            {timeAgo(booking.createdAt)}
          </span>
        </div>

        {/* Notes
        {booking.notes && (
          <div className="flex items-start gap-2 bg-amber-50 rounded-lg px-3 py-2 text-xs text-amber-700 mb-4">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            {booking.notes}
          </div>
        )} */}

        {/* Bottom: room + action */}
        {/* 3. เพิ่ม mt-auto เพื่อดันกล่องนี้ลงไปติดขอบล่างเสมอ */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <BedDouble className="w-4 h-4 text-gray-400" />
            {booking.assignedRoom ? (
              <span className="text-sm font-bold text-[#006b54]">ห้อง {booking.assignedRoom}</span>
            ) : (
              <span className="text-sm text-gray-400 italic">ยังไม่ได้ assign</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-800">
              ฿{booking.totalAmount.toLocaleString()}
            </span>
            <button
              onClick={onAssign}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${isPending
                ? "bg-[#006b54] hover:bg-[#005a46] text-white shadow-sm hover:shadow-md"
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
            >
              <BedDouble className="w-3.5 h-3.5" />
              {booking.assignedRoom ? "เปลี่ยนห้อง" : "Assign ห้อง"}
            </button>

            {!booking.assignedRoom && (
              <button
                onClick={() => alert("ฟีเจอร์นี้ยังไม่พร้อมใช้งาน")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${isPending
                  ? "bg-[#d03122] hover:bg-[#ff3700] text-white shadow-sm hover:shadow-md"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  }`}
              >
                <BedDouble className="w-3.5 h-3.5" />
                ยกเลิกการจอง
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function BookingAssignmentPage() {
  const [bookings, setBookings] = useState<PendingBooking[]>(MOCK_BOOKINGS);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<RoomTypeName | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"pending" | "assigned" | "all">("all");
  const [filterDate, setFilterDate] = useState("");
  const [modalBooking, setModalBooking] = useState<PendingBooking | null>(null);
  const [editModalBooking, setEditModalBooking] = useState<PendingBooking | null>(null);

  // rooms already used (by other assigned bookings)
  const usedRooms = useMemo(
    () => new Set(bookings.filter((b) => b.assignedRoom).map((b) => b.assignedRoom!)),
    [bookings]
  );

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        b.confirmationNumber.toLowerCase().includes(q) ||
        b.guestName.toLowerCase().includes(q) ||
        b.guestEmail.toLowerCase().includes(q) ||
        (b.assignedRoom ?? "").toLowerCase().includes(q);
      const matchType = filterType === "all" || b.roomType === filterType;
      const matchStatus =
        filterStatus === "all"
          ? true
          : filterStatus === "pending"
            ? b.status === "pending_assignment"
            : b.status === "assigned";
      const matchDate = !filterDate || b.checkIn === filterDate;
      return matchSearch && matchType && matchStatus && matchDate;
    });
  }, [bookings, search, filterType, filterStatus, filterDate]);

  const pendingCount = bookings.filter((b) => b.status === "pending_assignment").length;
  const assignedCount = bookings.filter((b) => b.status === "assigned").length;

  const handleAssign = (bookingId: string, roomNumber: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, assignedRoom: roomNumber, status: "assigned" } : b
      )
    );
    const booking = bookings.find((b) => b.id === bookingId);
    toast.success(`Assign ห้อง ${roomNumber} ให้ ${booking?.guestName} สำเร็จ`);
    setModalBooking(null);
  };

  const handleUpdateDates = (bookingId: string, checkIn: string, checkOut: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const ci = new Date(checkIn);
          const co = new Date(checkOut);
          const nights = Math.max(1, Math.ceil((co.getTime() - ci.getTime()) / 86400000));
          return { ...b, checkIn, checkOut, nights };
        }
        return b;
      })
    );
    toast.success("อัปเดตวันที่เข้าพักสำเร็จ");
    setEditModalBooking(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 sm:top-20 z-40">
        <div className="container mx-auto px-4 py-5">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#006b54] font-medium mb-3 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Booking Assignment</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Assign เลขห้องให้รายการจองที่เข้ามา
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="ค้นหา ชื่อ / หมายเลขจอง / ห้อง"
                  className="pl-9 text-sm bg-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="relative w-full sm:w-auto min-w-[140px]">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#006b54]" />
                <Input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="pl-9 text-sm text-gray-700 bg-white cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <button
              onClick={() => setFilterStatus("all")}
              className={`rounded-xl px-4 py-3 border-2 text-center transition-all ${filterStatus === "all"
                ? "border-[#006b54] bg-[#006b54]/5"
                : "border-gray-100 bg-gray-50 hover:border-gray-200"
                }`}
            >
              <p className="text-xs text-gray-500 uppercase font-semibold">ทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">{bookings.length}</p>
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`rounded-xl px-4 py-3 border-2 text-center transition-all ${filterStatus === "pending"
                ? "border-orange-400 bg-orange-50"
                : "border-orange-100 bg-orange-50/50 hover:border-orange-200"
                }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <Clock className="w-3 h-3 text-orange-500" />
                <p className="text-xs text-orange-600 uppercase font-semibold">รอ Assign</p>
              </div>
              <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
            </button>
            <button
              onClick={() => setFilterStatus("assigned")}
              className={`rounded-xl px-4 py-3 border-2 text-center transition-all ${filterStatus === "assigned"
                ? "border-green-400 bg-green-50"
                : "border-green-100 bg-green-50/50 hover:border-green-200"
                }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <p className="text-xs text-green-600 uppercase font-semibold">Assign แล้ว</p>
              </div>
              <p className="text-2xl font-bold text-green-600">{assignedCount}</p>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Room type filter pills */}
        <div className="flex gap-2 flex-wrap mb-5">
          <span className="text-xs text-gray-400 flex items-center gap-1 self-center mr-1">
            <Filter className="w-3.5 h-3.5" /> ประเภท:
          </span>
          {(["all", "Superior", "Deluxe", "Suite"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filterType === t
                ? "bg-[#006b54] text-white border-[#006b54]"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
            >
              {t === "all" ? "ทั้งหมด" : t}
              {t !== "all" && (
                <span className="ml-1 opacity-70">
                  ({filtered.filter((b) => b.roomType === t).length})
                </span>
              )}
            </button>
          ))}

          {(search || filterType !== "all" || filterStatus !== "all" || filterDate) && (
            <button
              onClick={() => {
                setSearch("");
                setFilterType("all");
                setFilterStatus("all");
                setFilterDate("");
              }}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 ml-auto transition-colors"
            >
              <X className="w-3.5 h-3.5" /> ล้างตัวกรอง
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <BedDouble className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">ไม่พบรายการจองที่ตรงกับเงื่อนไข</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {/* Pending cards first */}
            {filtered
              .sort((a, b) => {
                if (a.status === "pending_assignment" && b.status !== "pending_assignment") return -1;
                if (a.status !== "pending_assignment" && b.status === "pending_assignment") return 1;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              })
              .map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onAssign={() => setModalBooking(booking)}
                  onEditDates={() => setEditModalBooking(booking)}
                />
              ))}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">
          แสดง {filtered.length} จาก {bookings.length} รายการจอง
        </p>
      </div>

      {/* Assign Modal */}
      {modalBooking && (
        <AssignModal
          booking={modalBooking}
          usedRooms={usedRooms}
          onClose={() => setModalBooking(null)}
          onAssign={handleAssign}
        />
      )}

      {/* Edit Dates Modal */}
      {editModalBooking && (
        <EditDatesModal
          booking={editModalBooking}
          onClose={() => setEditModalBooking(null)}
          onSave={handleUpdateDates}
        />
      )}
    </div>
  );
}
