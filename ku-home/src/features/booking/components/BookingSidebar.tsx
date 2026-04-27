import { Link } from "react-router-dom";

interface BookingSidebarProps {
  checkIn: string;
  checkOut: string;
  priceSummary: { generalTotal: number; personnelTotal: number };
  todayStr: string;
  minCheckOut: string;
  isReadyToBook: boolean;
  onCheckInChange: (val: string) => void;
  onCheckOutChange: (val: string) => void;
  bookingLinkTo?: string;
  bookingLinkState?: object;
}

export function BookingSidebar({
  checkIn,
  checkOut,
  priceSummary,
  todayStr,
  minCheckOut,
  isReadyToBook,
  onCheckInChange,
  onCheckOutChange,
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
          className={`block w-full text-center py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${isReadyToBook
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
