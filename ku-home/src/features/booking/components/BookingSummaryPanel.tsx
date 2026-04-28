import { CalendarIcon, Coffee, BedDouble, Users, Baby, ChevronRight, Info, Hotel } from "lucide-react";
import { BREAKFAST_PRICE, getNextDay, calcNights, today } from "../../../utils/bookingUtils";
import { RoomType } from "../../../models/index";
import { useState } from "react";

interface BookingSummaryPanelProps {
  room: RoomType;
  checkIn: string;
  checkOut: string;
  guests: number;
  childrenCount: number;
  roomCount: number;
  extraBeds: number;
  includeBreakfast: boolean;
  isKuMember: boolean;
  onCheckInChange: (val: string) => void;
  onCheckOutChange: (val: string) => void;
  onGuestsChange: (delta: number) => void;
  onChildrenCountChange: (delta: number) => void;
  onRoomCountChange: (delta: number) => void;
  onBreakfastChange: (val: boolean) => void;
}

export function BookingSummaryPanel({
  room,
  checkIn,
  checkOut,
  guests,
  childrenCount,
  roomCount,
  extraBeds,
  includeBreakfast,
  isKuMember,
  onCheckInChange,
  onCheckOutChange,
  onGuestsChange,
  onChildrenCountChange,
  onRoomCountChange,
  onBreakfastChange,
}: BookingSummaryPanelProps) {
  const [showChildren, setShowChildren] = useState(childrenCount > 0);
  const todayStr = today();
  const nights = calcNights(checkIn, checkOut) || 1;
  const minCheckOut = checkIn ? getNextDay(checkIn) : getNextDay(todayStr);

  const roomRate = isKuMember ? room.rates.daily.personnel : room.rates.daily.general;
  const discount = isKuMember ? room.rates.daily.general - room.rates.daily.personnel : 0;

  const totalPeopleForBreakfast = includeBreakfast ? (guests + childrenCount) : 0;
  const breakfastCost = BREAKFAST_PRICE * totalPeopleForBreakfast * nights;

  const extraBedCost = extraBeds * room.extraBedPrice * nights;
  const subtotal = roomRate * nights * roomCount;
  const total = ((roomRate - discount) * nights * roomCount) + breakfastCost + extraBedCost;

  return (
    <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden sticky top-24">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-[#006b54] to-[#008a6e] p-6 text-white">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-xl font-bold tracking-tight">Booking Summary</h3>
          <Info className="w-5 h-5 opacity-60" />
        </div>
        <p className="text-white/70 text-sm font-medium">Review your reservation details</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Room Info Section */}
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <div className="relative">
            <img
              src={room.images?.[0] || ""}
              className="w-16 h-16 rounded-xl object-cover shadow-sm"
              alt={room.name}
            />
            <div className="absolute -top-2 -right-2 bg-white text-[#006b54] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-gray-100">
              {room.sizeSqM}m²
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 leading-tight">{room.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold bg-[#006b54]/10 text-[#006b54] px-2 py-0.5 rounded-md uppercase tracking-wider">
                1 Bedroom
              </span>
              <span className="text-[10px] font-bold bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-md uppercase tracking-wider">
                {room.maxGuests} Max Guests
              </span>
            </div>
          </div>
        </div>

        {/* Date Section */}
        <div className="relative grid grid-cols-2 gap-4">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="bg-white border border-gray-200 rounded-full p-1.5 shadow-sm">
              <ChevronRight className="w-3 h-3 text-gray-400" />
            </div>
          </div>
          {[
            { label: "Check-in", value: checkIn, min: todayStr, onChange: onCheckInChange },
            { label: "Check-out", value: checkOut, min: minCheckOut, onChange: onCheckOutChange },
          ].map(({ label, value, min, onChange }) => (
            <div key={label} className="relative group cursor-pointer">
              <div className="p-3 bg-white border border-gray-200 rounded-2xl group-hover:border-[#006b54] transition-all">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{label}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">{value || "Select"}</span>
                  <CalendarIcon className="w-4 h-4 text-gray-300 group-hover:text-[#006b54]" />
                </div>
              </div>
              <input
                type="date"
                min={min}
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                onClick={(e) => (e.target as any).showPicker?.()}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#006b54] bg-[#006b54]/5 py-2 rounded-full border border-[#006b54]/10">
          <CalendarIcon className="w-3 h-3" />
          <span>Stay Duration: {nights} {nights > 1 ? "Nights" : "Night"}</span>
        </div>

        {/* Rooms, Guests & Children Section */}
        <div className="space-y-4 pt-2">
          {/* Room Count Selection */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <Hotel className="w-4 h-4" />
              <span className="text-sm font-bold">Number of Rooms</span>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
              <button
                onClick={() => onRoomCountChange(-1)}
                disabled={roomCount <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm border border-gray-200 text-gray-600 hover:text-[#006b54] disabled:opacity-30"
              >
                -
              </button>
              <span className="text-sm font-bold text-gray-900 w-4 text-center">{roomCount}</span>
              <button
                onClick={() => onRoomCountChange(1)}
                disabled={roomCount >= 4}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm border border-gray-200 text-gray-600 hover:text-[#006b54] disabled:opacity-30"
              >
                +
              </button>
            </div>
          </div>

          {/* Guests Selection */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-gray-700">
                <Users className="w-4 h-4" />
                <span className="text-sm font-bold">Adults</span>
              </div>
              <span className="text-[10px] text-gray-400 ml-6 font-medium">age &gt;= 10</span>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
              <button
                onClick={() => onGuestsChange(-1)}
                disabled={guests <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm border border-gray-200 text-gray-600 hover:text-[#006b54] disabled:opacity-30"
              >
                -
              </button>
              <span className="text-sm font-bold text-gray-900 w-4 text-center">{guests}</span>
              <button
                onClick={() => onGuestsChange(1)}
                disabled={guests >= (room.maxGuests * roomCount)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm border border-gray-200 text-gray-600 hover:text-[#006b54] disabled:opacity-30"
              >
                +
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-50">
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${showChildren ? "bg-[#006b54] border-[#006b54]" : "border-gray-300 group-hover:border-gray-400"}`}>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={showChildren}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setShowChildren(checked);
                      onChildrenCountChange(checked ? 1 : -childrenCount);
                    }}
                  />
                  {showChildren && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Baby className="w-4 h-4" />
                  <span className="text-sm font-bold">Include Children</span>
                </div>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Ages 0-9</p>
            </label>
          </div>
        </div>

        {/* Add-ons Section */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enhanced Stay</p>

          <label className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all cursor-pointer ${includeBreakfast ? "border-[#006b54] bg-[#006b54]/5" : "border-gray-100 hover:border-gray-200"}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${includeBreakfast ? "bg-[#006b54] text-white" : "bg-gray-100 text-gray-400"}`}>
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Breakfast Buffet</p>
                <p className="text-[10px] text-gray-500">฿{BREAKFAST_PRICE}/person</p>
              </div>
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={includeBreakfast}
              onChange={(e) => onBreakfastChange(e.target.checked)}
            />
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${includeBreakfast ? "bg-[#006b54] border-[#006b54]" : "border-gray-200"}`}>
              {includeBreakfast && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
          </label>

          {room.maxExtraBeds > 0 && (
            <div className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                  <BedDouble className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Extra Bed</p>
                  <p className="text-[10px] text-gray-500">Requested: {extraBeds}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-900">฿{(extraBeds * room.extraBedPrice).toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">Total / Night</p>
              </div>
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">Room base rate ({roomCount} {roomCount > 1 ? "Rooms" : "Room"})</span>
            <span className="text-gray-900 font-bold">฿{subtotal.toLocaleString()}</span>
          </div>

          {isKuMember && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> KU Member Discount
              </span>
              <span className="text-emerald-600 font-bold">-฿{(discount * nights * roomCount).toLocaleString()}</span>
            </div>
          )}

          {includeBreakfast && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Breakfast ({totalPeopleForBreakfast} pax)</span>
              <span className="text-gray-900 font-bold">+฿{breakfastCost.toLocaleString()}</span>
            </div>
          )}

          {extraBeds > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Extra Bed ({extraBeds})</span>
              <span className="text-gray-900 font-bold">+฿{extraBedCost.toLocaleString()}</span>
            </div>
          )}

          <div className="bg-[#006b54] p-5 rounded-2xl text-white shadow-lg shadow-[#006b54]/20 mt-4 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <ReceiptIcon className="w-16 h-16 rotate-12" />
            </div>
            <div className="relative z-10 flex justify-between items-end">
              <div>
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Total Amount</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-medium">฿</span>
                  <span className="text-3xl font-black">{total.toLocaleString()}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-white/50 uppercase">Including VAT</p>
                <p className="text-xs font-bold text-white/80 uppercase tracking-tighter">THB Currency</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReceiptIcon({ className }: { className?: string }) {
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
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 17.5v-11" />
    </svg>
  );
}