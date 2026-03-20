import { useState } from "react";
import { motion } from "motion/react";
import { CalendarIcon, Coffee, BedDouble } from "lucide-react";
import { RoomType as RoomModel } from "../../../models/Room.ts";
import { BREAKFAST_PRICE, getNextDay, calcNights, today } from "../../../../utils/bookingUtils.ts";

interface BookingSummaryPanelProps {
  room: RoomModel;
  checkIn: string;
  checkOut: string;
  guests: number;
  extraBeds: number;
  includeBreakfast: boolean;
  isKuMember: boolean;
  onCheckInChange: (val: string) => void;
  onCheckOutChange: (val: string) => void;
  onGuestsChange: (delta: number) => void;
  onExtraBedsChange: (delta: number) => void;
  onBreakfastChange: (val: boolean) => void;
}

export function BookingSummaryPanel({
  room,
  checkIn,
  checkOut,
  guests,
  extraBeds,
  includeBreakfast,
  isKuMember,
  onCheckInChange,
  onCheckOutChange,
  onGuestsChange,
  onExtraBedsChange,
  onBreakfastChange,
}: BookingSummaryPanelProps) {
  const todayStr = today();
  const nights = calcNights(checkIn, checkOut) || 1;
  const minCheckOut = checkIn ? getNextDay(checkIn) : getNextDay(todayStr);

  const roomRate = isKuMember ? room.rates.daily.personnel : room.rates.daily.general;
  const discount = isKuMember ? room.rates.daily.general - room.rates.daily.personnel : 0;
  const breakfastCost = includeBreakfast ? BREAKFAST_PRICE * guests * nights : 0;
  const extraBedCost = extraBeds * room.extraBedPrice * nights;
  const total = (roomRate - 0) * nights + breakfastCost + extraBedCost;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
      <h3 className="text-lg font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">
        Booking Summary
      </h3>

      {/* Room image */}
      <div className="flex items-start space-x-4 mb-4">
        <img
          src={room.images?.[0] || ""}
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          alt={room.name}
        />
        <div>
          <h4 className="font-bold text-gray-900">{room.name}</h4>
          <p className="text-sm text-gray-500">1 Bedroom, {room.sizeSqM} sq.m.</p>
        </div>
      </div>

      {/* Date pickers */}
      <div className="space-y-3 text-sm text-gray-600 mb-5">
        {[
          { label: "Check-in", value: checkIn, min: todayStr, onChange: onCheckInChange },
          { label: "Check-out", value: checkOut, min: minCheckOut, onChange: onCheckOutChange },
        ].map(({ label, value, min, onChange }) => (
          <div key={label} className="flex justify-between items-center">
            <span className="text-gray-600">{label}</span>
            <span className="font-medium text-gray-900">{value || "—"}</span>
            <div className="relative flex items-center gap-2 cursor-pointer group">
              <CalendarIcon className="w-5 h-5 text-gray-400 group-hover:text-[#006b54] transition-colors" />
              <input
                type="date"
                min={min}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        ))}

        <div className="flex justify-between">
          <span>Duration</span>
          <span className="font-medium text-gray-900">{nights} Nights</span>
        </div>

        <div className="flex justify-between items-center gap-2">
          <span>Guests</span>
          <div className="flex items-center bg-white rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => onGuestsChange(-1)}
              disabled={guests <= 1}
              className={`px-3 py-1 text-gray-600 hover:bg-gray-100 ${guests <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              -
            </button>
            <span className="px-2 font-medium text-gray-900 w-6 text-center">{guests}</span>
            <button
              onClick={() => onGuestsChange(1)}
              disabled={guests >= room.maxGuests}
              className={`px-3 py-1 text-gray-600 hover:bg-gray-100 ${guests >= room.maxGuests ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Breakfast */}
      <div className="mb-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Add-on Services</p>
        <label
          className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
            includeBreakfast ? "border-[#006b54] bg-[#006b54]/5" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <input
            type="checkbox"
            checked={includeBreakfast}
            onChange={(e) => onBreakfastChange(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#006b54] cursor-pointer flex-shrink-0"
          />
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <Coffee className="w-4 h-4 text-[#006b54]" />
              <span className="text-sm font-semibold text-gray-900">Breakfast</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              ฿{BREAKFAST_PRICE}/person/night · {guests} guests × {nights} nights
            </p>
          </div>
          <span className={`text-sm font-bold flex-shrink-0 ${includeBreakfast ? "text-[#006b54]" : "text-gray-400"}`}>
            +฿{(BREAKFAST_PRICE * guests * nights).toLocaleString()}
          </span>
        </label>
      </div>

      {/* Extra bed */}
      {room.maxExtraBeds > 0 && (
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-gray-700 uppercase flex items-center">
              <BedDouble className="w-4 h-4 mr-1 text-[#006b54]" /> Extra Bed
            </label>
            <span className="text-xs text-[#006b54] font-bold">+{room.extraBedPrice} THB/night</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Need extra bed?</span>
            <div className="flex items-center bg-white rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => onExtraBedsChange(-1)}
                disabled={extraBeds === 0}
                className={`px-3 py-1 text-gray-600 hover:bg-gray-100 ${extraBeds === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                -
              </button>
              <span className="px-2 font-medium text-gray-900 w-6 text-center">{extraBeds}</span>
              <button
                onClick={() => onExtraBedsChange(1)}
                disabled={extraBeds >= room.maxExtraBeds}
                className={`px-3 py-1 text-gray-600 hover:bg-gray-100 ${extraBeds >= room.maxExtraBeds ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      <hr className="border-gray-100 mb-4" />

      {/* Price breakdown */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex justify-between items-center mb-2 text-sm">
          <span className="text-gray-600">Room Rate</span>
          <span className="font-medium text-gray-900">฿{(roomRate * nights).toLocaleString()}</span>
        </div>
        {isKuMember && discount > 0 && (
          <div className="flex justify-between items-center mb-2 text-sm text-green-600">
            <span>KU Discount</span>
            <span>-฿{(discount * nights).toLocaleString()}</span>
          </div>
        )}
        {includeBreakfast && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-2 text-sm text-[#006b54]"
          >
            <span className="flex items-center gap-1">
              <Coffee className="w-3.5 h-3.5" /> Breakfast
            </span>
            <span>+฿{breakfastCost.toLocaleString()}</span>
          </motion.div>
        )}
        {extraBeds > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-2 text-sm text-[#006b54]"
          >
            <span className="flex items-center gap-1">
              <BedDouble className="w-3.5 h-3.5" /> Extra Bed
            </span>
            <span>+฿{extraBedCost.toLocaleString()}</span>
          </motion.div>
        )}
        <div className="border-t border-gray-200 pt-3 mt-2 flex justify-between items-center">
          <span className="font-bold text-gray-900">Total</span>
          <span className="font-bold text-xl text-[#006b54]">฿{total.toLocaleString()} THB</span>
        </div>
      </div>
    </div>
  );
}