import { useState } from "react";
import { ROOMS } from "../../data/roomsDataType.ts";
import { calcNights, calcAdminBookingPrice } from "../../utils/bookingUtils.ts";
import { BookingType, DepartmentInfo, Guest, RoomAssignment } from "../../models/index.ts";


// Import new sub-components
import { Step, PaymentMethod, emptyGuest } from "./AdminBooking/types.ts";
import { StepIndicator } from "./AdminBooking/components/StepIndicator.tsx";
import { Step1Mode } from "./AdminBooking/components/Step1Mode.tsx";
import { Step2Details } from "./AdminBooking/components/Step2Details.tsx";
import { Step3Guests } from "./AdminBooking/components/Step3Guests.tsx";
import { Step4Payment } from "./AdminBooking/components/Step4Payment.tsx";
import { BookingSuccess } from "./AdminBooking/components/BookingSuccess.tsx";

export function AdminBookingPage() {
  // ── Wizard state ──
  const [step, setStep] = useState<Step>(1);
  const [mode, setMode] = useState<BookingType>("group");

  // ── Step 2: Dates & Rooms ──
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [monthStart, setMonthStart] = useState("");
  const [monthCount, setMonthCount] = useState(1);
  const [discountCode, setDiscountCode] = useState("");
  const [roomAssignments, setRoomAssignments] = useState<RoomAssignment[]>([
    { roomTypeId: "superior", count: 1, extraBeds: 0, includeBreakfast: false },
  ]);

  // ── Step 2: Meeting / Restaurant ──
  const [facilityDate, setFacilityDate] = useState("");
  const [facilityTime, setFacilityTime] = useState("");
  const [facilityType, setFacilityType] = useState("standard");
  const [facilityPax, setFacilityPax] = useState(1);

  // ── Step 3: Guests ──
  const [guests, setGuests] = useState<Guest[]>([emptyGuest()]);
  const [notes, setNotes] = useState("");

  // ── Step 4: Payment ──
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qr");
  const [deptInfo, setDeptInfo] = useState<DepartmentInfo>({
    deptName: "",
    erpCode: "",
    contactPerson: "",
    staffId: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // ── Calculations ──
  const nights = mode === "monthly" ? monthCount * 30 : calcNights(checkIn, checkOut);

  const totalAmount = calcAdminBookingPrice(
    mode,
    facilityType,
    roomAssignments,
    monthCount,
    nights,
    ROOMS
  );

  const totalRooms = roomAssignments.reduce((s, ra) => s + ra.count, 0);

  // ── Room assignment helpers ──
  const addRoomType = () => {
    setRoomAssignments((prev) => [
      ...prev,
      { roomTypeId: "superior", count: 1, extraBeds: 0, includeBreakfast: false },
    ]);
  };
  const removeRoomType = (i: number) => setRoomAssignments((prev) => prev.filter((_, idx) => idx !== i));
  const updateRA = (i: number, patch: Partial<RoomAssignment>) =>
    setRoomAssignments((prev) => prev.map((ra, idx) => (idx === i ? { ...ra, ...patch } : ra)));

  // ── Guest helpers ──
  const addGuest = () => setGuests((g) => [...g, emptyGuest()]);
  const removeGuest = (i: number) => setGuests((g) => g.filter((_, idx) => idx !== i));
  const updateGuest = (i: number, patch: Partial<Guest>) =>
    setGuests((g) => g.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));

  // ── Navigation ──
  const canProceed = () => {
    if (step === 2) {
      if (mode === "meeting" || mode === "restaurant") {
        return !!(facilityDate && facilityTime && facilityPax >= 1);
      }
      if (mode === "group") return !!(checkIn && checkOut && totalRooms >= 5);
      return !!(monthStart && monthCount >= 1 && totalRooms >= 1);
    }
    if (step === 3) return guests.length > 0 && guests[0].firstName !== "";
    return true;
  };

  const handleReset = () => {
    setSubmitted(false);
    setStep(1);
    setGuests([emptyGuest()]);
    setRoomAssignments([{ roomTypeId: "superior", count: 1, extraBeds: 0, includeBreakfast: false }]);
  };

  // ── Submitted ──
  if (submitted) {
    return (
      <BookingSuccess
        mode={mode}
        facilityPax={facilityPax}
        totalRooms={totalRooms}
        totalAmount={totalAmount}
        paymentMethod={paymentMethod}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Booking</h1>
            <p className="text-sm text-gray-500 mt-0.5">Group & Monthly reservation management</p>
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

        {step === 1 && (
          <Step1Mode
            mode={mode}
            setMode={setMode}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <Step2Details
            mode={mode}
            checkIn={checkIn} setCheckIn={setCheckIn}
            checkOut={checkOut} setCheckOut={setCheckOut}
            monthStart={monthStart} setMonthStart={setMonthStart}
            monthCount={monthCount} setMonthCount={setMonthCount}
            nights={nights}
            facilityDate={facilityDate} setFacilityDate={setFacilityDate}
            facilityTime={facilityTime} setFacilityTime={setFacilityTime}
            facilityType={facilityType} setFacilityType={setFacilityType}
            facilityPax={facilityPax} setFacilityPax={setFacilityPax}
            roomAssignments={roomAssignments}
            updateRA={updateRA}
            addRoomType={addRoomType}
            removeRoomType={removeRoomType}
            roomsList={ROOMS}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
            canProceed={canProceed()}
          />
        )}

        {step === 3 && (
          <Step3Guests
            guests={guests}
            addGuest={addGuest}
            removeGuest={removeGuest}
            updateGuest={updateGuest}
            notes={notes} setNotes={setNotes}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
            canProceed={canProceed()}
          />
        )}

        {step === 4 && (
          <Step4Payment
            paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
            deptInfo={deptInfo} setDeptInfo={setDeptInfo}
            discountCode={discountCode} setDiscountCode={setDiscountCode}
            totalAmount={totalAmount}
            totalRooms={totalRooms}
            mode={mode}
            facilityPax={facilityPax}
            onBack={() => setStep(3)}
            onSubmit={() => setSubmitted(true)}
          />
        )}
      </div>
    </div>
  );
}
