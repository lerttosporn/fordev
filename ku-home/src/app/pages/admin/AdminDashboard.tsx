import { useState, useEffect, useMemo } from 'react';
import { useAuth } from "../../contexts/AuthContext.tsx";
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  BedDouble,
  CheckCircle2,
  Wrench,
  Users,
  Calendar,
  ChevronLeft,
  LogIn,
  LogOut,
  Sparkles,
  Lock,
  X,
  ChevronDown,
  Pencil,
} from 'lucide-react';
import { Input } from "../../components/ui/input.tsx";
import { toast } from 'sonner';
import { RoomStatus } from "../../../models/index.ts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RoomRecord {
  id: string;
  roomNumber: string;
  roomType: string;
  floor: number;
  status: RoomStatus;
  guestName?: string;
  checkIn?: string;
  checkOut?: string;
  confirmationNumber?: string;
  totalAmount?: number;
  notes?: string;
}

interface PendingBooking {
  id: string;
  guestName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  confirmationNumber: string;
  totalAmount: number;
}

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  RoomStatus,
  { label: string; color: string; bg: string; dot: string; icon: React.ReactNode }
> = {
  available: {
    label: 'ว่าง',
    color: 'text-green-700',
    bg: 'bg-green-50 border-green-300',
    dot: 'bg-green-500',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  booked: {
    label: 'จองแล้ว',
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-300',
    dot: 'bg-blue-500',
    icon: <Calendar className="w-3.5 h-3.5" />,
  },
  checked_in: {
    label: 'มีผู้เข้าพัก',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50 border-indigo-300',
    dot: 'bg-indigo-500',
    icon: <LogIn className="w-3.5 h-3.5" />,
  },
  checked_out: {
    label: 'Make up room',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-300',
    dot: 'bg-amber-500',
    icon: <Sparkles className="w-3.5 h-3.5" />,
  },
  repair: {
    label: 'ปิดซ่อม',
    color: 'text-orange-700',
    bg: 'bg-orange-50 border-orange-300',
    dot: 'bg-orange-500',
    icon: <Wrench className="w-3.5 h-3.5" />,
  },
  unavailable: {
    label: 'ปิดสำรอง',
    color: 'text-gray-600',
    bg: 'bg-gray-100 border-gray-300',
    dot: 'bg-gray-400',
    icon: <Lock className="w-3.5 h-3.5" />,
  },
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_STATUSES: RoomStatus[] = [
  'available', 'available', 'available', 'available',
  'booked', 'booked',
  'checked_in', 'checked_in',
  'checked_out',
  'repair', 'unavailable',
];

function generateRooms(): RoomRecord[] {
  const rooms: RoomRecord[] = [];
  const types = [
    { type: 'Superior', prefix: 'S', start: 101, count: 40 },
    { type: 'Deluxe',   prefix: 'D', start: 201, count: 35 },
    { type: 'Suite',    prefix: 'T', start: 301, count: 25 },
  ];
  const guests = ['สมชาย ใจดี', 'นิดา พรอำไพ', 'John Smith', 'วันเพ็ญ กิตติ'];
  let idx = 0;
  for (const t of types) {
    for (let i = 0; i < t.count; i++) {
      const num = t.start + i;
      const floor = Math.floor((num % 100) / 10) + 1;
      const status = MOCK_STATUSES[idx % MOCK_STATUSES.length];
      const room: RoomRecord = {
        id: `${t.prefix}${num}`,
        roomNumber: `${t.prefix}${num}`,
        roomType: t.type,
        floor,
        status,
      };
      if (status === 'booked' || status === 'checked_in' || status === 'checked_out') {
        room.guestName = guests[i % 4];
        room.checkIn = '2025-04-01';
        room.checkOut = '2025-04-05';
        room.confirmationNumber = `KU-${1000 + idx}`;
        room.totalAmount = 3600 + idx * 100;
      }
      rooms.push(room);
      idx++;
    }
  }
  return rooms;
}

const INITIAL_PENDING_BOOKINGS: PendingBooking[] = [
  { id: 'pb1', guestName: 'Amanda White', roomType: 'Superior', checkIn: '2025-04-10', checkOut: '2025-04-12', confirmationNumber: 'KU-P001', totalAmount: 2400 },
  { id: 'pb2', guestName: 'David Lee', roomType: 'Superior', checkIn: '2025-04-15', checkOut: '2025-04-18', confirmationNumber: 'KU-P002', totalAmount: 4000 },
  { id: 'pb3', guestName: 'Maria Garcia', roomType: 'Deluxe', checkIn: '2025-04-08', checkOut: '2025-04-09', confirmationNumber: 'KU-P003', totalAmount: 1800 },
  { id: 'pb4', guestName: 'Somsak Pol', roomType: 'Suite', checkIn: '2025-04-20', checkOut: '2025-04-22', confirmationNumber: 'KU-P004', totalAmount: 7000 },
];

// ─── Room Detail Modal ────────────────────────────────────────────────────────
function RoomDetailModal({
  room,
  pendingBookings,
  onClose,
  onUpdateRoom,
  onAssignBooking,
  onCancelAssignment,
}: {
  room: RoomRecord;
  pendingBookings: PendingBooking[];
  onClose: () => void;
  onUpdateRoom: (id: string, updates: Partial<RoomRecord>) => void;
  onAssignBooking: (roomId: string, booking: PendingBooking) => void;
  onCancelAssignment: (room: RoomRecord) => void;
}) {
  const cfg = STATUS_CONFIG[room.status];
  const [notes, setNotes] = useState(room.notes ?? '');

  // Edit dates state
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [ciDate, setCiDate] = useState(room.checkIn ?? '');
  const [coDate, setCoDate] = useState(room.checkOut ?? '');

  // Available room type match bookings
  const matchingBookings = pendingBookings.filter(b => b.roomType === room.roomType);

  const actions: {
    label: string;
    status: RoomStatus;
    style: string;
    icon: React.ReactNode;
  }[] = [];

  if (room.status === 'booked') {
    actions.push({
      label: 'Check-in ผู้เข้าพัก',
      status: 'checked_in',
      style: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      icon: <LogIn className="w-4 h-4" />,
    });
  }
  if (room.status === 'checked_in') {
    actions.push({
      label: 'Check-out ผู้เข้าพัก',
      status: 'checked_out',
      style: 'bg-amber-500 hover:bg-amber-600 text-white',
      icon: <LogOut className="w-4 h-4" />,
    });
  }
  if (room.status === 'checked_out') {
    actions.push({
      label: 'ทำความสะอาดเสร็จ → ว่าง',
      status: 'available',
      style: 'bg-green-600 hover:bg-green-700 text-white',
      icon: <CheckCircle2 className="w-4 h-4" />,
    });
  }
  if (room.status === 'available') {
    actions.push({
      label: 'ปิดซ่อมชั่วคราว',
      status: 'repair',
      style: 'bg-orange-500 hover:bg-orange-600 text-white',
      icon: <Wrench className="w-4 h-4" />,
    });
    actions.push({
      label: 'ปิดสำรอง',
      status: 'unavailable',
      style: 'bg-gray-500 hover:bg-gray-600 text-white',
      icon: <Lock className="w-4 h-4" />,
    });
  }
  if (room.status === 'repair' || room.status === 'unavailable') {
    actions.push({
      label: 'เปิดห้อง (ว่าง)',
      status: 'available',
      style: 'bg-green-600 hover:bg-green-700 text-white',
      icon: <CheckCircle2 className="w-4 h-4" />,
    });
  }

  const handleSaveDates = () => {
    onUpdateRoom(room.id, { checkIn: ciDate, checkOut: coDate });
    setIsEditingDates(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${cfg.bg} ${cfg.color}`}>
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">ห้อง {room.roomNumber}</h2>
              <p className="text-xs text-gray-500">{room.roomType} · ชั้น {room.floor}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Current status badge */}
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 ${cfg.bg}`}>
            <span className={cfg.color}>{cfg.icon}</span>
            <span className={`font-bold text-sm ${cfg.color}`}>
              สถานะปัจจุบัน: {cfg.label}
            </span>
          </div>

          {/* Pending Bookings Listing (Available Room) */}
          {room.status === 'available' && (
            <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-4 space-y-3">
              <p className="font-bold text-blue-800 flex items-center gap-1.5 text-sm">
                <Calendar className="w-4 h-4" /> รายการรอ Assign (ตรงประเภทห้อง)
              </p>
              {matchingBookings.length === 0 ? (
                <p className="text-xs text-blue-600 italic">ไม่มีรายการสำหรับห้องประเภทนี้</p>
              ) : (
                <div className="space-y-2">
                  {matchingBookings.map((b) => (
                    <div key={b.id} className="bg-white rounded-lg p-3 border border-blue-100 flex items-center justify-between gap-2 shadow-sm">
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-gray-900 truncate">{b.guestName}</p>
                        <p className="text-xs text-gray-500 truncate">{b.checkIn} → {b.checkOut}</p>
                      </div>
                      <button
                        onClick={() => {
                          onAssignBooking(room.id, b);
                          onClose();
                        }}
                        className="bg-[#006b54] hover:bg-[#005a46] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0 transition-colors"
                      >
                        Assign
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Guest info (Booked/Checked-in) */}
          {(room.status === 'booked' || room.status === 'checked_in' || room.status === 'checked_out') && (
            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-gray-700 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#006b54]" /> ข้อมูลผู้เข้าพัก
                </p>
                {(room.status === 'booked' || room.status === 'checked_in') && !isEditingDates && (
                  <button 
                    onClick={() => setIsEditingDates(true)}
                    className="text-[#006b54] text-xs hover:underline flex items-center gap-1 font-medium"
                  >
                    <Pencil className="w-3 h-3" /> แก้ไขวันที่
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-gray-600">
                <div>
                  <p className="text-xs text-gray-400">ชื่อผู้เข้าพัก</p>
                  <p className="font-semibold">{room.guestName ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">หมายเลขจอง</p>
                  <p className="font-mono font-semibold">{room.confirmationNumber ?? '—'}</p>
                </div>

                {!isEditingDates ? (
                  <>
                    <div>
                      <p className="text-xs text-gray-400">Check-in</p>
                      <p className="font-semibold">{room.checkIn ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Check-out</p>
                      <p className="font-semibold">{room.checkOut ?? '—'}</p>
                    </div>
                  </>
                ) : (
                  <div className="col-span-2 grid grid-cols-2 gap-2 bg-white p-3 rounded-lg border border-gray-200">
                    <div>
                      <label className="text-xs text-gray-500 font-bold mb-1 block">Check-in</label>
                      <Input type="date" value={ciDate} onChange={(e) => setCiDate(e.target.value)} className="h-8 text-xs" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-bold mb-1 block">Check-out</label>
                      <Input type="date" value={coDate} onChange={(e) => setCoDate(e.target.value)} className="h-8 text-xs" />
                    </div>
                    <div className="col-span-2 flex gap-2 mt-1">
                      <button onClick={handleSaveDates} className="flex-1 bg-[#006b54] text-white text-xs font-bold py-1.5 rounded-md">บันทึก</button>
                      <button onClick={() => { setIsEditingDates(false); setCiDate(room.checkIn ?? ''); setCoDate(room.checkOut ?? ''); }} className="flex-1 bg-gray-100 text-gray-600 text-xs font-bold py-1.5 rounded-md border border-gray-200">ยกเลิก</button>
                    </div>
                  </div>
                )}
                
                {room.totalAmount && (
                  <div className="col-span-2 pt-1 border-t border-gray-100 mt-1">
                    <p className="text-xs text-gray-400">ยอดรวม</p>
                    <p className="font-bold text-[#006b54] text-base">
                      ฿{room.totalAmount.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Make up room callout */}
          {room.status === 'checked_out' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="font-bold text-amber-800 text-sm flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4" /> Make up room — รอ Housekeeping
              </p>
              <p className="text-xs text-amber-700 leading-relaxed mb-3">
                Housekeeping ต้องตรวจสอบห้อง ถ่ายรูปความเสียหาย และเติมอุปกรณ์ก่อนเปิดห้องรับแขก
              </p>
              <Link
                to={`/admin/housekeeping/${room.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
                onClick={onClose}
              >
                <Sparkles className="w-3.5 h-3.5" /> ไปหน้า Housekeeping →
              </Link>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
              หมายเหตุ / บันทึกเพิ่มเติม
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="เช่น ซ่อมแอร์, รอช่างประปา..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#006b54] outline-none resize-none"
            />
          </div>

          {/* Action buttons */}
          {actions.length > 0 && (
            <div className="space-y-2 pt-1">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                เปลี่ยนสถานะ {room.status === 'booked' && '/ การจัดการ'}
              </p>
              {actions.map((a) => (
                <button
                  key={a.status}
                  onClick={() => {
                    onUpdateRoom(room.id, { status: a.status, notes });
                    onClose();
                  }}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${a.style}`}
                >
                  {a.icon} {a.label}
                </button>
              ))}
              {room.status === 'booked' && (
                <button
                  onClick={() => {
                    onCancelAssignment(room);
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 mt-2"
                >
                  <X className="w-4 h-4" /> ยกเลิกการ Assign ห้อง
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Filter pill ──────────────────────────────────────────────────────────────
function FilterPill({
  label,
  count,
  dot,
  active,
  onClick,
}: {
  label: string;
  count: number;
  dot?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${
        active
          ? 'bg-[#006b54] text-white border-[#006b54]'
          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
      }`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
      {label}
      <span className={`ml-0.5 ${active ? 'text-white/70' : 'text-gray-400'}`}>{count}</span>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function AdminDashboard() {
  const { user, accessToken, loading } = useAuth();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<RoomRecord[]>(generateRooms);
  const [pendingBookings, setPendingBookings] = useState<PendingBooking[]>(INITIAL_PENDING_BOOKINGS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RoomStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedRoom, setSelectedRoom] = useState<RoomRecord | null>(null);

  useEffect(() => {
    if (!loading && (!user || !['admin', 'staff'].includes((user as any).role))) {
      toast.error('Access denied: Admin privileges required');
      navigate('/');
    }
  }, [user, loading, navigate]);

  // ── Stats ──
  const stats = useMemo(() => {
    const s: Record<string, number> = { total: rooms.length };
    for (const r of rooms) s[r.status] = (s[r.status] ?? 0) + 1;
    return s;
  }, [rooms]);

  // ── Filtered ──
  const filtered = useMemo(() => {
    return rooms.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.roomNumber.toLowerCase().includes(q) ||
        (r.guestName ?? '').toLowerCase().includes(q) ||
        (r.confirmationNumber ?? '').toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchType = typeFilter === 'all' || r.roomType === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [rooms, search, statusFilter, typeFilter]);

  // ── Group by floor ──
  const byFloor = useMemo(() => {
    const map = new Map<number, RoomRecord[]>();
    for (const r of filtered) {
      if (!map.has(r.floor)) map.set(r.floor, []);
      map.get(r.floor)!.push(r);
    }
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [filtered]);

  // ── Handlers ──
  const handleUpdateRoom = (id: string, updates: Partial<RoomRecord>) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    setSelectedRoom(prev => prev?.id === id ? { ...prev, ...updates } : prev);
    
    if (updates.checkIn || updates.checkOut) {
      toast.success('อัปเดตวันที่เข้าพักสำเร็จ');
    } else if (updates.status) {
      toast.success(`ห้อง ${id} → ${STATUS_CONFIG[updates.status].label}`);
    } else {
      toast.success('อัปเดตข้อมูลสำเร็จ');
    }
  };

  const handleAssignBooking = (roomId: string, booking: PendingBooking) => {
    setPendingBookings(prev => prev.filter(b => b.id !== booking.id));
    handleUpdateRoom(roomId, {
      status: 'booked',
      guestName: booking.guestName,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      confirmationNumber: booking.confirmationNumber,
      totalAmount: booking.totalAmount
    });
    toast.success(`Assign ห้อง ${roomId} สำเร็จ`);
  };

  const handleCancelAssignment = (room: RoomRecord) => {
    if (room.guestName && room.checkIn && room.checkOut && room.confirmationNumber) {
      const restoredBooking: PendingBooking = {
        id: `pb_${Date.now()}`,
        guestName: room.guestName,
        roomType: room.roomType,
        checkIn: room.checkIn,
        checkOut: room.checkOut,
        confirmationNumber: room.confirmationNumber,
        totalAmount: room.totalAmount || 0,
      };
      setPendingBookings((prev) => [...prev, restoredBooking]);
    }
    
    handleUpdateRoom(room.id, {
      status: 'available',
      guestName: undefined,
      checkIn: undefined,
      checkOut: undefined,
      confirmationNumber: undefined,
      totalAmount: undefined,
      notes: undefined
    });
    toast.success(`ยกเลิกการ Assign ห้อง ${room.roomNumber} เรียบร้อยแล้ว`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#006b54] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Sticky Header ── */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="container mx-auto px-4 py-4">
          {/* Back */}
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#006b54] font-medium mb-3 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Admin Portal
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Front Desk Dashboard</h1>
              <p className="text-sm text-gray-500">
                จัดการห้องพักทั้งหมด {rooms.length} ห้อง · มีรายการรอ Assign {pendingBookings.length} รายการ
              </p>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="ค้นหาห้อง / ชื่อผู้เข้าพัก / เลขจอง"
                className="pl-9 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* ── Stat strip ── */}
          <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
            {/* Total */}
            <button
              onClick={() => setStatusFilter('all')}
              className={`rounded-xl px-3 py-2 text-center border transition-all ${
                statusFilter === 'all'
                  ? 'bg-[#006b54] text-white border-[#006b54]'
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className={`text-xs font-semibold uppercase ${statusFilter === 'all' ? 'text-white/80' : 'text-gray-500'}`}>
                ทั้งหมด
              </p>
              <p className={`text-xl font-bold ${statusFilter === 'all' ? 'text-white' : 'text-gray-800'}`}>
                {stats.total}
              </p>
            </button>

            {(Object.keys(STATUS_CONFIG) as RoomStatus[]).map((s) => {
              const c = STATUS_CONFIG[s];
              const active = statusFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(active ? 'all' : s)}
                  className={`rounded-xl px-3 py-2 text-center border-2 transition-all ${
                    active ? c.bg : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className={`text-xs font-semibold uppercase ${active ? c.color : 'text-gray-400'}`}>
                    {c.label}
                  </p>
                  <p className={`text-xl font-bold ${active ? c.color : 'text-gray-800'}`}>
                    {stats[s] ?? 0}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container mx-auto px-4 py-5">
        {/* Filters row */}
        <div className="flex items-center gap-2 flex-wrap mb-5">
          {/* Room type filter */}
          {['all', 'Superior', 'Deluxe', 'Suite'].map((t) => (
            <FilterPill
              key={t}
              label={t === 'all' ? 'ทุกประเภท' : t}
              count={t === 'all' ? filtered.length : filtered.filter((r) => r.roomType === t).length}
              active={typeFilter === t}
              onClick={() => setTypeFilter(t)}
            />
          ))}

          <div className="w-px h-5 bg-gray-200 mx-1 hidden sm:block" />

          {/* Status filter pills */}
          {(Object.keys(STATUS_CONFIG) as RoomStatus[]).map((s) => (
            <FilterPill
              key={s}
              label={STATUS_CONFIG[s].label}
              count={filtered.filter((r) => r.status === s).length}
              dot={STATUS_CONFIG[s].dot}
              active={statusFilter === s}
              onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
            />
          ))}

          {(search || statusFilter !== 'all' || typeFilter !== 'all') && (
            <button
              onClick={() => { setSearch(''); setStatusFilter('all'); setTypeFilter('all'); }}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 ml-auto transition-colors"
            >
              <X className="w-3.5 h-3.5" /> ล้างตัวกรอง
            </button>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 flex-wrap mb-4 text-xs text-gray-400">
          {(Object.keys(STATUS_CONFIG) as RoomStatus[]).map((s) => (
            <span key={s} className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[s].dot}`} />
              {STATUS_CONFIG[s].label}
            </span>
          ))}
        </div>

        {/* Room grid grouped by floor */}
        {byFloor.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <BedDouble className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">ไม่พบห้องที่ตรงกับเงื่อนไข</p>
          </div>
        ) : (
          <div className="space-y-4">
            {byFloor.map(([floor, floorRooms]) => (
              <div key={floor} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Floor header */}
                <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-bold text-gray-700">ชั้น {floor}</span>
                  <span className="text-xs text-gray-400">{floorRooms.length} ห้อง</span>
                  {/* Per-floor mini stats */}
                  <div className="ml-auto flex items-center gap-1.5 flex-wrap">
                    {(Object.keys(STATUS_CONFIG) as RoomStatus[]).map((s) => {
                      const cnt = floorRooms.filter((r) => r.status === s).length;
                      if (!cnt) return null;
                      return (
                        <span
                          key={s}
                          className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].color}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[s].dot}`} />
                          {cnt}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Room cells */}
                <div className="p-3 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-14 gap-2">
                  {floorRooms.map((room) => {
                    const cfg = STATUS_CONFIG[room.status];
                    return (
                      <button
                        key={room.id}
                        onClick={() => setSelectedRoom(room)}
                        className={`relative rounded-lg border-2 p-2 flex flex-col items-center gap-0.5 transition-all hover:scale-105 hover:shadow-md active:scale-95 cursor-pointer ${cfg.bg}`}
                        title={`${room.roomNumber} — ${cfg.label}${room.guestName ? ` (${room.guestName})` : ''}`}
                      >
                        <span className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        <span className={`text-[11px] font-bold leading-tight ${cfg.color}`}>
                          {room.roomNumber}
                        </span>
                        <span className={`opacity-70 ${cfg.color}`}>{cfg.icon}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">
          แสดง {filtered.length} จาก {rooms.length} ห้อง · คลิกที่ห้องเพื่อดูรายละเอียดและเปลี่ยนสถานะ
        </p>
      </div>

      {/* ── Room Detail Modal ── */}
      {selectedRoom && (
        <RoomDetailModal
          room={rooms.find((r) => r.id === selectedRoom.id) ?? selectedRoom}
          pendingBookings={pendingBookings}
          onClose={() => setSelectedRoom(null)}
          onUpdateRoom={handleUpdateRoom}
          onAssignBooking={handleAssignBooking}
          onCancelAssignment={handleCancelAssignment}
        />
      )}
    </div>
  );
}