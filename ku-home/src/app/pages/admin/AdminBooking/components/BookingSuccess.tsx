import { CheckCircle2 } from "lucide-react";

interface BookingSuccessProps {
  mode: string;
  facilityPax: number;
  totalRooms: number;
  totalAmount: number;
  paymentMethod: string;
  onReset: () => void;
}

export function BookingSuccess({
  mode, facilityPax, totalRooms, totalAmount, paymentMethod, onReset
}: BookingSuccessProps) {
  return (
    <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
      <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full overflow-hidden">
        <div className="bg-[#006b54] p-12 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle2 className="w-10 h-10 text-[#006b54] stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Booking Created!</h1>
          <p className="text-green-100 text-sm">
            {mode.charAt(0).toUpperCase() + mode.slice(1)} booking has been saved.
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
              <p className="text-gray-500 text-xs mb-0.5">
                {mode === "meeting" || mode === "restaurant" ? "Pax / People" : "Rooms"}
              </p>
              <p className="font-bold">
                {mode === "meeting" || mode === "restaurant" ? `${facilityPax} pax` : `${totalRooms} rooms`}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Total</p>
              <p className="font-bold text-[#006b54]">
                ฿{totalAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Payment</p>
              <p className="font-bold capitalize">{paymentMethod}</p>
            </div>
          </div>
          <button
            onClick={onReset}
            className="w-full bg-[#006b54] hover:bg-[#005a46] text-white py-3 rounded-xl font-bold transition-colors"
          >
            Create Another Booking
          </button>
        </div>
      </div>
    </div>
  );
}
