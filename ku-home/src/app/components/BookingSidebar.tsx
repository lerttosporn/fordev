import { Link } from "react-router-dom";
import { BedDouble, Coffee } from "lucide-react";
import { BREAKFAST_PRICE } from "../../../utils/bookingUtils.ts";
import { RoomType } from "../../models/index.ts";
import { useEffect } from "react";

interface BookingSidebarProps {
  room: RoomType;
  checkIn: string;
  checkOut: string;
  guests: number;
  extraBeds: number;
  includeBreakfast: boolean;
  nights: number;
  priceSummary: { generalTotal: number; personnelTotal: number };
  todayStr: string;
  minCheckOut: string;
  isReadyToBook: boolean;
  onCheckInChange: (val: string) => void;
  onCheckOutChange: (val: string) => void;
  onGuestsChange: (delta: number) => void;
  onExtraBedsChange: (delta: number) => void;
  onIncludeBreakfastChange: (val: boolean) => void;
  bookingLinkTo?: string;
  bookingLinkState?: object;
}

function Counter({
  value,
  onDecrement,
  onIncrement,
  disableDecrement,
  disableIncrement,
}: {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  disableDecrement?: boolean;
  disableIncrement?: boolean;
}) {
  return (
    <div className="flex items-center bg-white rounded-lg border border-gray-300 overflow-hidden">
      <button
        onClick={onDecrement}
        disabled={disableDecrement}
        className={`px-3 py-1 text-gray-600 hover:bg-gray-100 ${disableDecrement ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        -
      </button>
      <span className="px-2 font-medium text-gray-900 w-6 text-center">
        {value}
      </span>
      <button
        onClick={onIncrement}
        disabled={disableIncrement}
        className={`px-3 py-1 text-gray-600 hover:bg-gray-100 ${disableIncrement ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        +
      </button>
    </div>
  );
}

export function BookingSidebar({
  room,
  checkIn,
  checkOut,
  guests,
  extraBeds,
  includeBreakfast,
  nights,
  priceSummary,
  todayStr,
  minCheckOut,
  isReadyToBook,
  onCheckInChange,
  onCheckOutChange,
  onGuestsChange,
  onExtraBedsChange,
  onIncludeBreakfastChange,
  bookingLinkTo = "/booking/guest",
  bookingLinkState,
}: BookingSidebarProps) {
  return (
    <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-[#006b54] p-4 text-white text-center">
        <span className="text-sm font-medium opacity-90">
          Best Price Guarantee
        </span>
      </div>

      <div className="p-6">
        {/* Price display */}
        <div className="flex justify-between items-center mb-6">     
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
              Public Rate
            </p>
            <div className="text-2xl font-bold text-gray-900">
              {priceSummary.generalTotal.toLocaleString()} THB
            </div>
          </div>
          <div className="text-right">
            <p className="text-[#006b54] text-xs uppercase tracking-wide font-bold mb-1">
              KU Personnel
            </p>
            <div className="text-2xl font-bold text-[#006b54]">
              {priceSummary.personnelTotal.toLocaleString()} THB
            </div>
          </div>
        </div>

        <hr className="border-gray-100 mb-6" />

        <div className="space-y-4 mb-6">
          {/* Check-in */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
              Check-in
            </label>
            <input
              type="date"
              min={todayStr}
              value={checkIn}
              onChange={(e) => onCheckInChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#006b54] focus:border-[#006b54] outline-none"
            />
          </div>

          {/* Check-out */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
              Check-out
            </label>
            <input
              type="date"
              min={minCheckOut}
              value={checkOut}
              onChange={(e) => onCheckOutChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#006b54] focus:border-[#006b54] outline-none"
            />
          </div>

          {/* Guests */}
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-700 uppercase">
              Guests
            </span>
            <Counter
              value={guests}
              onDecrement={() => onGuestsChange(guests - 1)}
              onIncrement={() => onGuestsChange(guests + 1)}
              disableDecrement={guests <= 1}
              disableIncrement={guests >= room.maxGuests}
            />
          </div>

          {/* Breakfast */}
          <label
            className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
              includeBreakfast
                ? "border-[#006b54] bg-[#006b54]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              checked={includeBreakfast}
              onChange={(e) => onIncludeBreakfastChange(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#006b54] cursor-pointer flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <Coffee className="w-4 h-4 text-[#006b54]" />
                <span className="text-sm font-semibold text-gray-900">
                  Breakfast
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                ฿{BREAKFAST_PRICE}/person/night · {guests} guests ×{" "}
                {Math.max(nights, 1)} nights
              </p>
            </div>
            <span
              className={`text-sm font-bold flex-shrink-0 ${includeBreakfast ? "text-[#006b54]" : "text-gray-400"}`}
            >
              +฿
              {(
                BREAKFAST_PRICE *
                guests *
                Math.max(nights, 1)
              ).toLocaleString()}
            </span>
          </label>

          {/* Extra Bed */}
          {room.maxExtraBeds > 0 && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-700 uppercase flex items-center">
                  <BedDouble className="w-4 h-4 mr-1 text-[#006b54]" />
                  Extra Bed
                </label>
                <span className="text-xs text-[#006b54] font-bold">
                  +{room.extraBedPrice} THB/night
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Need extra bed?</span>
                <Counter
                  value={extraBeds}
                  onDecrement={() => onExtraBedsChange(extraBeds - 1)}
                  onIncrement={() => onExtraBedsChange(extraBeds + 1)}
                  disableDecrement={extraBeds === 0}
                  disableIncrement={extraBeds >= room.maxExtraBeds}
                />
              </div>
              {extraBeds > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Max {room.maxExtraBeds} extra bed(s) allowed.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Book Now button */}
        <Link
          to={bookingLinkTo}
          state={bookingLinkState}
          onClick={(e) => {
            if (!isReadyToBook) {
              e.preventDefault();
              alert("Please select Check-in and Check-out dates first.");
            }
          }}
          className={`block w-full text-center py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
            isReadyToBook
              ? "bg-[#006b54] hover:bg-[#005a46] text-white hover:shadow-xl"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Book Now
        </Link>

        <p className="text-xs text-center text-gray-400 mt-4">
          No credit card required for reservation.
        </p>
      </div>
    </div>
  );
}
