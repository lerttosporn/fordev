import { Link, useLocation } from "react-router-dom";
import { BookingSteps } from "../../components/BookingSteps.tsx";
import { BookingSummaryPanel } from "../../components/booking/BookingSummaryPanel.tsx";
import { Upload, User, Mail, Phone, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { today, getNextDay, calcNights } from "../../../../utils/bookingUtils.ts";
import { ROOMS } from "../../data/roomsDataType.ts";

const TITLES = ["Mr.", "Ms.", "Mrs.", "Dr."];

export function GuestInfoPage() {
  const location = useLocation();
  const todayStr = today();

  const {
    room = ROOMS[2],
    checkInPrev = todayStr,
    checkOutPrev = getNextDay(todayStr),
    extraBedsPrev = 0,
    includeBreakfastPrev = false,
    guestsPrev = 1,
  } = location.state || {};

  // Booking state
  const [checkIn, setCheckInRaw] = useState<string>(checkInPrev);
  const [checkOut, setCheckOut] = useState<string>(checkOutPrev);
  const [guests, setGuests] = useState<number>(guestsPrev);
  const [extraBeds, setExtraBeds] = useState<number>(extraBedsPrev);
  const [includeBreakfast, setIncludeBreakfast] = useState<boolean>(includeBreakfastPrev);
  const [isKuMember, setIsKuMember] = useState(false);

  const setCheckIn = (val: string) => {
    setCheckInRaw(val);
    if (checkOut && val >= checkOut) setCheckOut("");
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <BookingSteps currentStep={2} />

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-6">
            <GuestDetailsForm />

            <KuMemberSection isKuMember={isKuMember} onToggle={() => setIsKuMember(!isKuMember)} />

            <div className="flex justify-end pt-4">
              <Link
                to="/booking/payment"
                className="bg-[#006b54] hover:bg-[#005a46] text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center"
              >
                Proceed to Payment <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>

          {/* Summary sidebar */}
          <div className="lg:col-span-1">
            <BookingSummaryPanel
              room={room}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              extraBeds={extraBeds}
              includeBreakfast={includeBreakfast}
              isKuMember={isKuMember}
              onCheckInChange={setCheckIn}
              onCheckOutChange={setCheckOut}
              onGuestsChange={(delta) => setGuests((g) => Math.min(Math.max(1, g + delta), room.maxGuests))}
              onExtraBedsChange={(delta) => setExtraBeds((e) => Math.min(Math.max(0, e + delta), room.maxExtraBeds))}
              onBreakfastChange={setIncludeBreakfast}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function GuestDetailsForm() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <User className="w-6 h-6 mr-3 text-[#006b54]" />
        Guest Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField label="Title" options={TITLES} />
        <TextField label="Nationality" placeholder="Thai" />
        <TextField label="First Name" />
        <TextField label="Last Name" />
        <div className="md:col-span-2">
          <TextField label="ID Card / Passport Number" />
        </div>
        <TextField label="Email Address" icon={<Mail className="w-4 h-4 text-gray-400" />} type="email" />
        <TextField label="Phone Number" icon={<Phone className="w-4 h-4 text-gray-400" />} type="tel" />
      </div>
    </div>
  );
}

function KuMemberSection({ isKuMember, onToggle }: { isKuMember: boolean; onToggle: () => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <GraduationCapIcon className="w-6 h-6 mr-3 text-[#006b54]" />
        KU Member Discount
      </h2>

      <div className="flex items-center mb-4">
        <button
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isKuMember ? "bg-[#006b54]" : "bg-gray-200"
            }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isKuMember ? "translate-x-6" : "translate-x-1"
              }`}
          />
        </button>
        <span className="ml-3 text-sm font-medium text-gray-900">
          I am a KU Student or Staff Member{" "}
          <span className="text-[#006b54] font-bold">(Eligible for Special Rate)</span>
        </span>
      </div>

      {isKuMember && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="bg-gray-50 rounded-xl p-6 border border-dashed border-gray-300"
        >
          <label className="block text-sm font-bold text-gray-700 mb-3">Upload KU ID Card / Staff ID</label>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG or PDF (MAX. 5MB)</p>
            </div>
            <input type="file" className="hidden" />
          </label>
        </motion.div>
      )}
    </div>
  );
}

// ── Field helpers ──────────────────────────────────────────────────────────

function TextField({
  label,
  placeholder,
  type = "text",
  icon,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-3">{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#006b54] focus:border-transparent outline-none transition-all ${icon ? "pl-10" : ""}`}
        />
      </div>
    </div>
  );
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      <select className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#006b54] focus:border-transparent outline-none transition-all">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function GraduationCapIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}