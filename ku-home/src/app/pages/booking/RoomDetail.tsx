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

// interface RoomDetailProps {
//   room: RoomModel;
// }
export function RoomDetail() {
  const amenities = [
    { icon: <Maximize className="w-5 h-5" />, label: "52 sq.m. Space" },
    { icon: <Maximize className="w-5 h-5" />, label: "Private Balcony" },
    { icon: <Coffee className="w-5 h-5" />, label: "Living Area" },
    { icon: <Utensils className="w-5 h-5" />, label: "Kitchenette" },
    { icon: <Bath className="w-5 h-5" />, label: "Bathtub" },
    { icon: <Wifi className="w-5 h-5" />, label: "Free Wi-Fi" },
    { icon: <Tv className="w-5 h-5" />, label: "Smart TV" },
    { icon: <Refrigerator className="w-5 h-5" />, label: "Refrigerator" },
    { icon: <Wind className="w-5 h-5" />, label: "Air Conditioning" },
  ];

  const { name } = useParams();

  const room = ROOMS.find((r) => r.name.toLowerCase() === name?.toLowerCase()) || ROOMS[0];
  const [extraBeds, setExtraBeds] = useState(0);
  const totalPriceGeneral =
    room.rates.daily.general + extraBeds * room.extraBedPrice;
  const totalPricePersonnel =
    room.rates.daily.general + extraBeds * room.extraBedPrice;

  if (!room) {
    return <div>Room not found</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Breadcrumb / Back */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            to="/"
            className="flex items-center text-gray-500 hover:text-[#006b54] text-sm font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[500px]">
          <div className="md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden shadow-sm relative group">
            <img
              src={room.imageInSide[0]}
              alt="Suite Room Main"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="md:col-span-1 md:row-span-1 rounded-2xl overflow-hidden shadow-sm relative group">
            <img
              src={room.imageInSide[1]}
              alt="Bedroom"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="md:col-span-1 md:row-span-1 rounded-2xl overflow-hidden shadow-sm relative group">
            <img
              src={room.imageInSide[2]}
              alt="Kitchen"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="md:col-span-2 md:row-span-1 rounded-2xl overflow-hidden shadow-sm relative group">
            <img
              src={room.imageInSide[3]}
              alt="Bathroom"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
            <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-gray-900 px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
              View All Photos
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                {room.name}
              </h1>
              <div className="flex items-center space-x-4 text-gray-500 text-sm">
                <span className="flex items-center">
                  <Maximize className="w-4 h-4 mr-1" />
                  {room.sizeSqM} sq.m.
                </span>
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {room.maxGuests} Guests
                </span>
                <span className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" /> Luxury
                  Choice
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {room.description}
              </p>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Room Amenities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center text-gray-600">
                    <div className="text-[#006b54] mr-3 bg-[#006b54]/5 p-2 rounded-full">
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                House Rules
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start text-gray-600 text-sm">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                  Check-in time: 14:00 PM
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
                      {(
                        room.rates.daily.general +
                        extraBeds * room.extraBedPrice
                      ).toLocaleString()}{" "}
                      THB
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#006b54] text-xs uppercase tracking-wide font-bold mb-1">
                      KU Personnel
                    </p>
                    <div className="text-2xl font-bold text-[#006b54]">
                      {(
                        room.rates.daily.personnel +
                        extraBeds * room.extraBedPrice
                      ).toLocaleString()}{" "}
                      THB
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
                  </div>{" "}
                  {/* Additional Option Box - Extra Bed */}
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
                        <span className="text-sm text-gray-600">
                          Need extra bed?
                        </span>
                        <div className="flex items-center bg-white rounded-lg border border-gray-300 overflow-hidden">
                          <button
                            onClick={() =>
                              setExtraBeds(Math.max(0, extraBeds - 1))
                            }
                            className={`px-3 py-1 text-gray-600 hover:bg-gray-100 ${extraBeds === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={extraBeds === 0}
                          >
                            -
                          </button>
                          <span className="px-2 font-medium text-gray-900 w-6 text-center">
                            {extraBeds}
                          </span>
                          <button
                            onClick={() =>
                              setExtraBeds(
                                Math.min(room.maxExtraBeds, extraBeds + 1),
                              )
                            }
                            className={`px-3 py-1 text-gray-600 hover:bg-gray-100 ${extraBeds >= room.maxExtraBeds ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={extraBeds >= room.maxExtraBeds}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      {extraBeds > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                          Max {room.maxExtraBeds} extra bed(s) allowed.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <Link
                  to={`/booking/guest${"/" + room.name.toLowerCase()}`}
                  className="block w-full bg-[#006b54] hover:bg-[#005a46] text-white text-center py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Book Now
                </Link>
                <p className="text-xs text-center text-gray-400 mt-4">
                  No credit card required for reservation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
