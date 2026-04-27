import { Link } from "react-router-dom";
import { Users, Repeat, Building2, Coffee, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { BookingType } from "../../../../models/index";

interface Step1ModeProps {
  mode: BookingType;
  setMode: (mode: BookingType) => void;
  onNext: () => void;
}

export function Step1Mode({ mode, setMode, onNext }: Step1ModeProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Select Booking Type</h2>
        <p className="text-gray-500 mt-1">Choose how this reservation will be processed</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Group */}
        <button
          onClick={() => setMode("group")}
          className={`group text-left p-8 rounded-2xl border-2 transition-all duration-200 ${
            mode === "group"
              ? "border-[#006b54] bg-[#006b54]/5 shadow-lg"
              : "border-gray-200 bg-white hover:border-[#006b54]/40 hover:shadow-md"
          }`}
        >
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors ${
              mode === "group" ? "bg-[#006b54] text-white" : "bg-gray-100 text-gray-500"
            }`}
          >
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Group Booking</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            For groups of <strong>5 rooms or more</strong>. Eligible for group discount rates. Requires check-in / check-out dates.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded-full">Min 5 rooms</span>
            <span className="text-xs bg-green-50 text-green-700 font-semibold px-2.5 py-1 rounded-full">Group discount</span>
            <span className="text-xs bg-purple-50 text-purple-700 font-semibold px-2.5 py-1 rounded-full">Split billing</span>
          </div>
          {mode === "group" && (
            <div className="mt-4 flex items-center text-[#006b54] text-sm font-bold">
              <CheckCircle2 className="w-4 h-4 mr-1" /> Selected
            </div>
          )}
        </button>

        {/* Monthly */}
        <button
          onClick={() => setMode("monthly")}
          className={`group text-left p-8 rounded-2xl border-2 transition-all duration-200 ${
            mode === "monthly"
              ? "border-[#006b54] bg-[#006b54]/5 shadow-lg"
              : "border-gray-200 bg-white hover:border-[#006b54]/40 hover:shadow-md"
          }`}
        >
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors ${
              mode === "monthly" ? "bg-[#006b54] text-white" : "bg-gray-100 text-gray-500"
            }`}
          >
            <Repeat className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Monthly Booking</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Long-stay reservation billed <strong>per month</strong>. Ideal for university personnel or long-term guests.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="text-xs bg-orange-50 text-orange-700 font-semibold px-2.5 py-1 rounded-full">Monthly rate</span>
            <span className="text-xs bg-green-50 text-green-700 font-semibold px-2.5 py-1 rounded-full">Long-stay discount</span>
            <span className="text-xs bg-gray-100 text-gray-700 font-semibold px-2.5 py-1 rounded-full">Flexible duration</span>
          </div>
          {mode === "monthly" && (
            <div className="mt-4 flex items-center text-[#006b54] text-sm font-bold">
              <CheckCircle2 className="w-4 h-4 mr-1" /> Selected
            </div>
          )}
        </button>

        {/* Meeting Room */}
        <button
          onClick={() => setMode("meeting")}
          className={`group text-left p-8 rounded-2xl border-2 transition-all duration-200 ${
            mode === "meeting"
              ? "border-[#006b54] bg-[#006b54]/5 shadow-lg"
              : "border-gray-200 bg-white hover:border-[#006b54]/40 hover:shadow-md"
          }`}
        >
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors ${
              mode === "meeting" ? "bg-[#006b54] text-white" : "bg-gray-100 text-gray-500"
            }`}
          >
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Meeting Room</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            For conferences, seminars, and meetings. Choose from our various fully-equipped rooms.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded-full">Hourly / Daily</span>
            <span className="text-xs bg-purple-50 text-purple-700 font-semibold px-2.5 py-1 rounded-full">Catering available</span>
          </div>
          {mode === "meeting" && (
            <div className="mt-4 flex items-center text-[#006b54] text-sm font-bold">
              <CheckCircle2 className="w-4 h-4 mr-1" /> Selected
            </div>
          )}
        </button>

        {/* Restaurant */}
        <button
          onClick={() => setMode("restaurant")}
          className={`group text-left p-8 rounded-2xl border-2 transition-all duration-200 ${
            mode === "restaurant"
              ? "border-[#006b54] bg-[#006b54]/5 shadow-lg"
              : "border-gray-200 bg-white hover:border-[#006b54]/40 hover:shadow-md"
          }`}
        >
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors ${
              mode === "restaurant" ? "bg-[#006b54] text-white" : "bg-gray-100 text-gray-500"
            }`}
          >
            <Coffee className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Restaurant</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Reserve a table or a private dining room for your special occasions or group meals.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="text-xs bg-orange-50 text-orange-700 font-semibold px-2.5 py-1 rounded-full">Table reservation</span>
            <span className="text-xs bg-green-50 text-green-700 font-semibold px-2.5 py-1 rounded-full">Private room</span>
          </div>
          {mode === "restaurant" && (
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
          onClick={onNext}
          className="bg-[#006b54] hover:bg-[#005a46] text-white px-8 py-3 rounded-xl font-bold shadow-md transition-all flex items-center gap-2"
        >
          Continue <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
