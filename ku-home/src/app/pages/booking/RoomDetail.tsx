import {
  Bath,
  BedDouble,
  CheckCircle2,
  ChevronLeft,
  Coffee,
  Maximize,
  Refrigerator,
  Star,
  Tv,
  Users,
  Utensils,
  Wifi,
  Wind,
} from "lucide-react";
import { Link, useParams } from "react-router";
import { useState } from "react";
import { ROOMS } from "../../data/RoomData.tsx";

export function RoomDetail() {
  const { name } = useParams();

  const room = ROOMS.find((r) => r.name.toLowerCase() === name?.toLowerCase()) || ROOMS[0];
  const [extraBeds, setExtraBeds] = useState(0);

  // FIX: totalPricePersonnel was incorrectly using .general rate — now uses .personnel
  const totalPriceGeneral =
    room.rates.daily.general + extraBeds * room.extraBedPrice;
  const totalPricePersonnel =
    room.rates.daily.personnel + extraBeds * room.extraBedPrice;

  const amenities = [
    { icon: <Maximize className="w-5 h-5" />, label: `${room.sizeSqM} sq.m. Space` },
    ...(room.amenities.includes("Private Balcony") ? [{ icon: <Coffee className="w-5 h-5" />, label: "Private Balcony" }] : []),
    ...(room.amenities.includes("Separate Living Area") ? [{ icon: <Coffee className="w-5 h-5" />, label: "Living Area" }] : []),
    ...(room.amenities.includes("Kitchenette") ? [{ icon: <Utensils className="w-5 h-5" />, label: "Kitchenette" }] : []),
    ...(room.amenities.includes("Bathtub") ? [{ icon: <Bath className="w-5 h-5" />, label: "Bathtub" }] : []),
    { icon: <Wifi className="w-5 h-5" />, label: "Free Wi-Fi" },
    { icon: <Tv className="w-5 h-5" />, label: "Smart TV" },
    { icon: <Refrigerator className="w-5 h-5" />, label: "Refrigerator" },
    { icon: <Wind className="w-5 h-5" />, label: "Air Conditioning" },
  ];

  if (!room) {
    return <div>Room not found</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Breadcrumb / Back */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            to="/rooms"
            className="flex items-center text-gray-500 hover:text-[#006b54] text-sm font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to All Rooms
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Room Images */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="col-span-2 rounded-2xl overflow-hidden h-72">
                <img
                  src={room.imageInSide?.[0] || room.image}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {(room.imageInSide || []).slice(1, 3).map((img, i) => (
                <div key={i} className="rounded-2xl overflow-hidden h-48">
                  <img src={img} alt={`${room.name} view ${i + 2}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {room.name} Room
            </h1>

            <div className="flex items-center gap-6 text-gray-500 text-sm mb-6">
              <span className="flex items-center gap-1">
                <Maximize className="w-4 h-4" /> {room.sizeSqM} sq.m.
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" /> Up to {room.maxGuests} guests
              </span>
              {room.maxExtraBeds > 0 && (
                <span className="flex items-center gap-1">
                  <BedDouble className="w-4 h-4" /> +{room.maxExtraBeds} extra bed
                </span>
              )}
              <span className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" /> 4.8
              </span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              {room.description}
            </p>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Room Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenities.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100">
                    <span className="text-[#006b54]">{item.icon}</span>
                    <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">House Rules</h2>
              <ul className="space-y-2">
                <li className="flex items-start text-gray-600 text-sm">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                  Check-in time: 2:00 PM
                </li>
                <li className="flex items-start text-gray-600 text-sm">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                  Check-out time: 12:00 PM
                </li>
                <li className="flex items-start text-gray-600 text-sm">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                  No smoking allowed in the room
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-[#006b54] p-4 text-white text-center">
                <span className="text-sm font-medium opacity-90">
                  Best Price Guarantee
                </span>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                      Public Rate
                    </p>
                    <div className="text-2xl font-bold text-gray-900">
                      {totalPriceGeneral.toLocaleString()} THB
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#006b54] text-xs uppercase tracking-wide font-bold mb-1">
                      KU Personnel
                    </p>
                    <div className="text-2xl font-bold text-[#006b54]">
                      {totalPricePersonnel.toLocaleString()} THB
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100 mb-6" />

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                      Check-in
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#006b54] focus:border-[#006b54] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                      Check-out
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#006b54] focus:border-[#006b54] outline-none"
                    />
                  </div>

                  {room.maxExtraBeds > 0 && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-gray-700 uppercase flex items-center">
                          <BedDouble className="w-4 h-4 mr-1 text-[#006b54]" />
                          Extra Bed
                        </label>
                        <span className="text-xs text-[#006b54] font-bold">+{room.extraBedPrice} THB/night</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Need extra bed?</span>
                        <div className="flex items-center bg-white rounded-lg border border-gray-300 overflow-hidden">
                          <button
                            onClick={() => setExtraBeds(Math.max(0, extraBeds - 1))}
                            className={`px-3 py-1 text-gray-600 hover:bg-gray-100 ${extraBeds === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={extraBeds === 0}
                          >
                            -
                          </button>
                          <span className="px-2 font-medium text-gray-900 w-6 text-center">{extraBeds}</span>
                          <button
                            onClick={() => setExtraBeds(Math.min(room.maxExtraBeds, extraBeds + 1))}
                            className={`px-3 py-1 text-gray-600 hover:bg-gray-100 ${extraBeds >= room.maxExtraBeds ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={extraBeds >= room.maxExtraBeds}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to="/booking/guest"
                  className="block w-full bg-[#006b54] hover:bg-[#005a46] text-white text-center py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Book Now
                </Link>

                <p className="text-xs text-gray-400 text-center mt-3">
                  Free cancellation for unpaid reservations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
