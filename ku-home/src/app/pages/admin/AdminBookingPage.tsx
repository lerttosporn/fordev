import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  BedDouble,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  Trash2,
  Building2,
  CreditCard,
  QrCode,
  CheckCircle2,
  User,
  Mail,
  Phone,
  Tag,
  Coffee,
  AlertCircle,
  DollarSign,
  Repeat,
} from 'lucide-react';
import { ROOMS } from "../../data/roomsDataType.ts";

// ─── Types ───────────────────────────────────────────────────────────────────
type BookingMode = 'group' | 'monthly';
type Step = 1 | 2 | 3 | 4;
type PaymentMethod = 'qr' | 'cash' | 'department';

interface GuestRow {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  email: string;
  phone: string;
  isKuMember: boolean;
}

interface RoomAssignment {
  roomTypeId: string;
  count: number;
  extraBeds: number;
  includeBreakfast: boolean;
}

interface DepartmentInfo {
  deptName: string;
  erpCode: string;
  contactPerson: string;
  staffId: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 8);

const emptyGuest = (): GuestRow => ({
  id: uid(),
  title: 'Mr.',
  firstName: '',
  lastName: '',
  idNumber: '',
  email: '',
  phone: '',
  isKuMember: false,
});

const STEP_LABELS: Record<Step, string> = {
  1: 'Booking Type',
  2: 'Room & Dates',
  3: 'Guest Details',
  4: 'Payment',
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {([1, 2, 3, 4] as Step[]).map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                s < current
                  ? 'bg-[#006b54] border-[#006b54] text-white'
                  : s === current
                  ? 'border-[#006b54] text-[#006b54] bg-white ring-4 ring-[#006b54]/20'
                  : 'border-gray-200 text-gray-400 bg-white'
              }`}
            >
              {s < current ? <CheckCircle2 className="w-4 h-4" /> : s}
            </div>
            <span
              className={`text-[10px] mt-1 font-medium uppercase tracking-wide ${
                s === current ? 'text-[#006b54]' : 'text-gray-400'
              }`}
            >
              {STEP_LABELS[s]}
            </span>
          </div>
          {i < 3 && (
            <div
              className={`w-16 h-0.5 mb-4 mx-1 transition-all ${
                s < current ? 'bg-[#006b54]' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function SectionCard({
  icon,
  title,
  children,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div
        className={`px-6 py-4 flex items-center gap-3 border-b border-gray-100 ${
          accent || 'bg-gray-50'
        }`}
      >
        <span className="text-[#006b54]">{icon}</span>
        <h3 className="font-bold text-gray-900">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function AdminBookingPage() {
  // ── Wizard state ──
  const [step, setStep] = useState<Step>(1);
  const [mode, setMode] = useState<BookingMode>('group');

  // ── Step 2: Dates & Rooms ──
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [monthStart, setMonthStart] = useState('');
  const [monthCount, setMonthCount] = useState(1);
  const [discountCode, setDiscountCode] = useState('');
  const [roomAssignments, setRoomAssignments] = useState<RoomAssignment[]>([
    { roomTypeId: 'superior', count: 1, extraBeds: 0, includeBreakfast: false },
  ]);

  // ── Step 3: Guests ──
  const [guests, setGuests] = useState<GuestRow[]>([emptyGuest()]);
  const [notes, setNotes] = useState('');

  // ── Step 4: Payment ──
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qr');
  const [deptInfo, setDeptInfo] = useState<DepartmentInfo>({
    deptName: '',
    erpCode: '',
    contactPerson: '',
    staffId: '',
  });
  const [submitted, setSubmitted] = useState(false);

  // ── Calculations ──
  const today = new Date().toISOString().split('T')[0];
  const getNextDay = (d: string) => {
    const dt = d ? new Date(d) : new Date();
    dt.setDate(dt.getDate() + 1);
    return dt.toISOString().split('T')[0];
  };

  const nights = (() => {
    if (mode === 'monthly') return monthCount * 30;
    if (!checkIn || !checkOut) return 0;
    return Math.max(
      0,
      Math.ceil(
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
          86400000,
      ),
    );
  })();

  const totalAmount = roomAssignments.reduce((sum, ra) => {
    const room = ROOMS.find((r) => r.id === ra.roomTypeId);
    if (!room) return sum;
    const baseRate =
      mode === 'monthly'
        ? room.rates.monthly * monthCount
        : room.rates.daily.general * nights * ra.count;
    const extraBedCost =
      mode === 'monthly' ? 0 : ra.extraBeds * room.extraBedPrice * nights * ra.count;
    const breakfastCost = ra.includeBreakfast ? 150 * nights * ra.count : 0;
    return sum + baseRate + extraBedCost + breakfastCost;
  }, 0);

  const totalRooms = roomAssignments.reduce((s, ra) => s + ra.count, 0);

  // ── Room assignment helpers ──
  const addRoomType = () => {
    setRoomAssignments((prev) => [
      ...prev,
      { roomTypeId: 'superior', count: 1, extraBeds: 0, includeBreakfast: false },
    ]);
  };
  const removeRoomType = (i: number) =>
    setRoomAssignments((prev) => prev.filter((_, idx) => idx !== i));
  const updateRA = (i: number, patch: Partial<RoomAssignment>) =>
    setRoomAssignments((prev) =>
      prev.map((ra, idx) => (idx === i ? { ...ra, ...patch } : ra)),
    );

  // ── Guest helpers ──
  const addGuest = () => setGuests((g) => [...g, emptyGuest()]);
  const removeGuest = (id: string) =>
    setGuests((g) => g.filter((x) => x.id !== id));
  const updateGuest = (id: string, patch: Partial<GuestRow>) =>
    setGuests((g) => g.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  // ── Navigation ──
  const canProceed = () => {
    if (step === 2) {
      if (mode === 'group') return !!(checkIn && checkOut && totalRooms >= 5);
      return !!(monthStart && monthCount >= 1 && totalRooms >= 1);
    }
    if (step === 3) return guests.length > 0 && guests[0].firstName !== '';
    return true;
  };

  const handleSubmit = () => setSubmitted(true);

  // ── Submitted ──
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full overflow-hidden">
          <div className="bg-[#006b54] p-12 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle2 className="w-10 h-10 text-[#006b54] stroke-[2.5]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Booking Created!</h1>
            <p className="text-green-100 text-sm">
              {mode === 'group' ? 'Group' : 'Monthly'} booking has been saved.
            </p>
          </div>
          <div className="p-8 text-center">
            <p className="text-3xl font-mono font-bold text-gray-900 tracking-wider mb-1">
              KU-{Math.random().toString(36).slice(2, 8).toUpperCase()}
            </p>
            <p className="text-sm text-gray-500 mb-6">Confirmation Number</p>
            <div className="grid grid-cols-2 gap-4 text-sm text-left bg-gray-50 rounded-xl p-4 mb-6">
              <div>
                <p className="text-gray-500 text-xs mb-0.5">Mode</p>
                <p className="font-bold capitalize">{mode}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-0.5">Rooms</p>
                <p className="font-bold">{totalRooms} rooms</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-0.5">Total</p>
                <p className="font-bold text-[#006b54]">฿{totalAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-0.5">Payment</p>
                <p className="font-bold capitalize">{paymentMethod}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setStep(1);
                setGuests([emptyGuest()]);
                setRoomAssignments([
                  { roomTypeId: 'superior', count: 1, extraBeds: 0, includeBreakfast: false },
                ]);
              }}
              className="w-full bg-[#006b54] hover:bg-[#005a46] text-white py-3 rounded-xl font-bold transition-colors"
            >
              Create Another Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Booking</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Group & Monthly reservation management
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
            <span className="bg-[#006b54]/10 text-[#006b54] font-bold px-3 py-1 rounded-full">
              Step {step} of 4
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <StepIndicator current={step} />

        {/* ══════════════════════════════════════════════
            STEP 1 — Booking Mode
        ══════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Select Booking Type</h2>
              <p className="text-gray-500 mt-1">Choose how this reservation will be processed</p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Group */}
              <button
                onClick={() => setMode('group')}
                className={`group text-left p-8 rounded-2xl border-2 transition-all duration-200 ${
                  mode === 'group'
                    ? 'border-[#006b54] bg-[#006b54]/5 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-[#006b54]/40 hover:shadow-md'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors ${
                    mode === 'group' ? 'bg-[#006b54] text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Group Booking</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  For groups of <strong>5 rooms or more</strong>. Eligible for group
                  discount rates. Requires check-in / check-out dates.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded-full">
                    Min 5 rooms
                  </span>
                  <span className="text-xs bg-green-50 text-green-700 font-semibold px-2.5 py-1 rounded-full">
                    Group discount
                  </span>
                  <span className="text-xs bg-purple-50 text-purple-700 font-semibold px-2.5 py-1 rounded-full">
                    Split billing
                  </span>
                </div>
                {mode === 'group' && (
                  <div className="mt-4 flex items-center text-[#006b54] text-sm font-bold">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Selected
                  </div>
                )}
              </button>

              {/* Monthly */}
              <button
                onClick={() => setMode('monthly')}
                className={`group text-left p-8 rounded-2xl border-2 transition-all duration-200 ${
                  mode === 'monthly'
                    ? 'border-[#006b54] bg-[#006b54]/5 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-[#006b54]/40 hover:shadow-md'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors ${
                    mode === 'monthly' ? 'bg-[#006b54] text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <Repeat className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Monthly Booking</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Long-stay reservation billed <strong>per month</strong>. Ideal for
                  university personnel or long-term guests.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="text-xs bg-orange-50 text-orange-700 font-semibold px-2.5 py-1 rounded-full">
                    Monthly rate
                  </span>
                  <span className="text-xs bg-green-50 text-green-700 font-semibold px-2.5 py-1 rounded-full">
                    Long-stay discount
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-700 font-semibold px-2.5 py-1 rounded-full">
                    Flexible duration
                  </span>
                </div>
                {mode === 'monthly' && (
                  <div className="mt-4 flex items-center text-[#006b54] text-sm font-bold">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Selected
                  </div>
                )}
              </button>
            </div>

            <div className="flex justify-between pt-4">
              <Link
                to="/admin"
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-medium px-4 py-2 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Admin
              </Link>
              <button
                onClick={() => setStep(2)}
                className="bg-[#006b54] hover:bg-[#005a46] text-white px-8 py-3 rounded-xl font-bold shadow-md transition-all flex items-center gap-2"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            STEP 2 — Room & Dates
        ══════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Dates */}
            <SectionCard
              icon={<Calendar className="w-5 h-5" />}
              title={mode === 'group' ? 'Stay Dates' : 'Monthly Period'}
            >
              {mode === 'group' ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={checkIn}
                      onChange={(e) => {
                        setCheckIn(e.target.value);
                        if (checkOut && e.target.value >= checkOut) setCheckOut('');
                      }}
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#006b54] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      min={checkIn ? getNextDay(checkIn) : getNextDay(today)}
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#006b54] outline-none"
                    />
                  </div>
                  {nights > 0 && (
                    <div className="md:col-span-2 bg-[#006b54]/5 rounded-lg px-4 py-2 text-sm text-[#006b54] font-semibold">
                      📅 {nights} night{nights !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                      Start Month
                    </label>
                    <input
                      type="month"
                      value={monthStart}
                      onChange={(e) => setMonthStart(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#006b54] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                      Duration (months)
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setMonthCount((m) => Math.max(1, m - 1))}
                        className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="flex-1 text-center font-bold text-lg">{monthCount}</span>
                      <button
                        onClick={() => setMonthCount((m) => m + 1)}
                        className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </SectionCard>

            {/* Room Assignments */}
            <SectionCard icon={<BedDouble className="w-5 h-5" />} title="Room Selection">
              <div className="space-y-4">
                {roomAssignments.map((ra, i) => {
                  const room = ROOMS.find((r) => r.id === ra.roomTypeId);
                  return (
                    <div
                      key={i}
                      className="border border-gray-200 rounded-xl p-4 bg-gray-50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 grid md:grid-cols-3 gap-3">
                          {/* Room Type */}
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                              Room Type
                            </label>
                            <select
                              value={ra.roomTypeId}
                              onChange={(e) =>
                                updateRA(i, { roomTypeId: e.target.value })
                              }
                              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#006b54] outline-none bg-white"
                            >
                              {ROOMS.map((r) => (
                                <option key={r.id} value={r.id}>
                                  {r.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Count */}
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                              No. of Rooms
                            </label>
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                              <button
                                onClick={() =>
                                  updateRA(i, { count: Math.max(1, ra.count - 1) })
                                }
                                className="px-3 py-2.5 hover:bg-gray-50 text-gray-600"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="flex-1 text-center font-bold text-sm">
                                {ra.count}
                              </span>
                              <button
                                onClick={() => updateRA(i, { count: ra.count + 1 })}
                                className="px-3 py-2.5 hover:bg-gray-50 text-gray-600"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Extra Beds (group only) */}
                          {mode === 'group' && room && room.maxExtraBeds > 0 && (
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                Extra Beds
                              </label>
                              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                                <button
                                  onClick={() =>
                                    updateRA(i, {
                                      extraBeds: Math.max(0, ra.extraBeds - 1),
                                    })
                                  }
                                  className="px-3 py-2.5 hover:bg-gray-50 text-gray-600"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="flex-1 text-center font-bold text-sm">
                                  {ra.extraBeds}
                                </span>
                                <button
                                  onClick={() =>
                                    updateRA(i, {
                                      extraBeds: Math.min(
                                        room.maxExtraBeds,
                                        ra.extraBeds + 1,
                                      ),
                                    })
                                  }
                                  className="px-3 py-2.5 hover:bg-gray-50 text-gray-600"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {roomAssignments.length > 1 && (
                          <button
                            onClick={() => removeRoomType(i)}
                            className="text-red-400 hover:text-red-600 p-1 mt-5"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Breakfast toggle */}
                      <label className="flex items-center gap-2 mt-3 cursor-pointer w-fit">
                        <input
                          type="checkbox"
                          checked={ra.includeBreakfast}
                          onChange={(e) =>
                            updateRA(i, { includeBreakfast: e.target.checked })
                          }
                          className="accent-[#006b54] w-4 h-4"
                        />
                        <Coffee className="w-4 h-4 text-[#006b54]" />
                        <span className="text-sm text-gray-700 font-medium">
                          Include Breakfast (+฿150/person/night)
                        </span>
                      </label>

                      {/* Rate preview */}
                      {room && (
                        <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500 flex gap-4 flex-wrap">
                          {mode === 'group' ? (
                            <>
                              <span>
                                Group (≥5):{' '}
                                <strong className="text-gray-800">
                                  ฿{room.rates.group.min5Rooms.toLocaleString()}/night
                                </strong>
                              </span>
                              <span>
                                Group (≥10):{' '}
                                <strong className="text-gray-800">
                                  ฿{room.rates.group.min10Rooms.toLocaleString()}/night
                                </strong>
                              </span>
                            </>
                          ) : (
                            <span>
                              Monthly rate:{' '}
                              <strong className="text-gray-800">
                                ฿{room.rates.monthly.toLocaleString()}/month
                              </strong>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                <button
                  onClick={addRoomType}
                  className="w-full border-2 border-dashed border-gray-300 hover:border-[#006b54] text-gray-500 hover:text-[#006b54] rounded-xl py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Another Room Type
                </button>

                {/* Group warning */}
                {mode === 'group' && totalRooms < 5 && (
                  <div className="flex items-center gap-2 bg-amber-50 text-amber-700 rounded-lg px-4 py-3 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    Group booking requires at least 5 rooms. Currently{' '}
                    <strong>{totalRooms}</strong>.
                  </div>
                )}
              </div>
            </SectionCard>

            {/* Discount Code */}
            <SectionCard icon={<Tag className="w-5 h-5" />} title="Discount Code (Optional)">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  placeholder="Enter discount code…"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#006b54] outline-none font-mono"
                />
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-3 rounded-lg text-sm font-bold transition-colors">
                  Apply
                </button>
              </div>
            </SectionCard>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-medium px-4 py-2 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => canProceed() && setStep(3)}
                disabled={!canProceed()}
                className={`px-8 py-3 rounded-xl font-bold shadow-md transition-all flex items-center gap-2 ${
                  canProceed()
                    ? 'bg-[#006b54] hover:bg-[#005a46] text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            STEP 3 — Guest Details
        ══════════════════════════════════════════════ */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {guests.map((g, idx) => (
              <SectionCard
                key={g.id}
                icon={<User className="w-5 h-5" />}
                title={`Guest ${idx + 1}${idx === 0 ? ' (Primary Contact)' : ''}`}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                      Title
                    </label>
                    <select
                      value={g.title}
                      onChange={(e) => updateGuest(g.id, { title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#006b54] outline-none"
                    >
                      {['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.'].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer pb-2.5">
                      <input
                        type="checkbox"
                        checked={g.isKuMember}
                        onChange={(e) =>
                          updateGuest(g.id, { isKuMember: e.target.checked })
                        }
                        className="accent-[#006b54] w-4 h-4"
                      />
                      <span className="text-sm text-[#006b54] font-semibold">
                        KU Personnel (special rate)
                      </span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={g.firstName}
                      onChange={(e) => updateGuest(g.id, { firstName: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#006b54] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={g.lastName}
                      onChange={(e) => updateGuest(g.id, { lastName: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#006b54] outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                      ID Card / Passport
                    </label>
                    <input
                      type="text"
                      value={g.idNumber}
                      onChange={(e) => updateGuest(g.id, { idNumber: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#006b54] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                      <Mail className="w-3.5 h-3.5 inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={g.email}
                      onChange={(e) => updateGuest(g.id, { email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#006b54] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                      <Phone className="w-3.5 h-3.5 inline mr-1" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={g.phone}
                      onChange={(e) => updateGuest(g.id, { phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#006b54] outline-none"
                    />
                  </div>
                </div>
                {idx > 0 && (
                  <button
                    onClick={() => removeGuest(g.id)}
                    className="mt-4 text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Remove guest
                  </button>
                )}
              </SectionCard>
            ))}

            <button
              onClick={addGuest}
              className="w-full border-2 border-dashed border-gray-300 hover:border-[#006b54] text-gray-500 hover:text-[#006b54] rounded-xl py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Guest
            </button>

            {/* Notes */}
            <SectionCard icon={<AlertCircle className="w-5 h-5" />} title="Special Requests / Notes">
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests, dietary requirements, accessibility needs…"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#006b54] outline-none resize-none"
              />
            </SectionCard>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-medium px-4 py-2"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => canProceed() && setStep(4)}
                disabled={!canProceed()}
                className={`px-8 py-3 rounded-xl font-bold shadow-md transition-all flex items-center gap-2 ${
                  canProceed()
                    ? 'bg-[#006b54] hover:bg-[#005a46] text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            STEP 4 — Payment & Summary
        ══════════════════════════════════════════════ */}
        {step === 4 && (
          <div className="grid md:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Left: Payment method */}
            <div className="md:col-span-3 space-y-6">
              <SectionCard icon={<CreditCard className="w-5 h-5" />} title="Payment Method">
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {(
                    [
                      { value: 'qr', label: 'QR Payment', icon: <QrCode className="w-6 h-6" /> },
                      { value: 'cash', label: 'Cash', icon: <DollarSign className="w-6 h-6" /> },
                      {
                        value: 'department',
                        label: 'Dept. Transfer',
                        icon: <Building2 className="w-6 h-6" />,
                      },
                    ] as { value: PaymentMethod; label: string; icon: React.ReactNode }[]
                  ).map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setPaymentMethod(m.value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-xs font-bold transition-all ${
                        paymentMethod === m.value
                          ? 'border-[#006b54] bg-[#006b54]/5 text-[#006b54]'
                          : 'border-gray-200 text-gray-600 hover:border-[#006b54]/30'
                      }`}
                    >
                      {m.icon}
                      {m.label}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'qr' && (
                  <div className="flex flex-col items-center bg-gray-50 rounded-xl p-6">
                    <div className="w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
                      <QrCode className="w-16 h-16 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">KU Home — PromptPay</p>
                    <p className="font-bold text-gray-900 text-lg mt-1">
                      ฿{totalAmount.toLocaleString()}
                    </p>
                  </div>
                )}

                {paymentMethod === 'cash' && (
                  <div className="bg-yellow-50 rounded-xl p-4 text-sm text-yellow-800 font-medium text-center">
                    💵 Collect cash at front desk. Staff will mark as paid after receiving.
                  </div>
                )}

                {paymentMethod === 'department' && (
                  <div className="space-y-3">
                    {[
                      { key: 'deptName', label: 'Department / Faculty' },
                      { key: 'erpCode', label: 'ERP / Budget Code' },
                      { key: 'contactPerson', label: 'Contact Person' },
                      { key: 'staffId', label: 'Staff ID / Employee No.' },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                          {label}
                        </label>
                        <input
                          type="text"
                          value={deptInfo[key as keyof DepartmentInfo]}
                          onChange={(e) =>
                            setDeptInfo((d) => ({ ...d, [key]: e.target.value }))
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#006b54] outline-none"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-medium px-4 py-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-[#006b54] hover:bg-[#005a46] text-white px-10 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" /> Confirm Booking
                </button>
              </div>
            </div>

            {/* Right: Summary */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-24 overflow-hidden">
                <div className="bg-[#006b54] px-5 py-4 text-white">
                  <h3 className="font-bold">Booking Summary</h3>
                  <p className="text-xs text-green-100 mt-0.5 capitalize">
                    {mode} booking · {totalRooms} room{totalRooms !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="p-5 space-y-4">
                  {/* Dates */}
                  <div className="text-sm space-y-1">
                    {mode === 'group' ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Check-in</span>
                          <span className="font-medium">{checkIn || '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Check-out</span>
                          <span className="font-medium">{checkOut || '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Duration</span>
                          <span className="font-medium">{nights} nights</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Start</span>
                          <span className="font-medium">{monthStart || '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Duration</span>
                          <span className="font-medium">{monthCount} month{monthCount !== 1 ? 's' : ''}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <hr className="border-gray-100" />

                  {/* Room breakdown */}
                  <div className="space-y-2">
                    {roomAssignments.map((ra, i) => {
                      const room = ROOMS.find((r) => r.id === ra.roomTypeId);
                      if (!room) return null;
                      const rate =
                        mode === 'monthly'
                          ? room.rates.monthly * monthCount
                          : room.rates.daily.general * nights * ra.count;
                      return (
                        <div key={i} className="text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-700 font-medium">
                              {room.name} × {ra.count}
                            </span>
                            <span className="font-bold">฿{rate.toLocaleString()}</span>
                          </div>
                          {ra.extraBeds > 0 && mode === 'group' && (
                            <div className="flex justify-between text-xs text-gray-500 pl-3">
                              <span>+ {ra.extraBeds} extra bed</span>
                              <span>
                                ฿
                                {(
                                  ra.extraBeds * room.extraBedPrice * nights * ra.count
                                ).toLocaleString()}
                              </span>
                            </div>
                          )}
                          {ra.includeBreakfast && (
                            <div className="flex justify-between text-xs text-gray-500 pl-3">
                              <span>+ breakfast</span>
                              <span>
                                ฿{(150 * nights * ra.count).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <hr className="border-gray-100" />

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-[#006b54]">
                      ฿{totalAmount.toLocaleString()}
                    </span>
                  </div>

                  {/* Guests */}
                  {guests[0]?.firstName && (
                    <>
                      <hr className="border-gray-100" />
                      <div className="text-xs text-gray-500">
                        <p className="font-bold text-gray-700 mb-1">Primary Guest</p>
                        <p>
                          {guests[0].title} {guests[0].firstName} {guests[0].lastName}
                        </p>
                        {guests[0].email && <p>{guests[0].email}</p>}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}