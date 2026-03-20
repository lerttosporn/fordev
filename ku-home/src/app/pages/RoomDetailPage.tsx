import { Link, useParams } from "react-router-dom";
import {
  Wifi, Tv, Wind, Maximize, Utensils, Bath, Refrigerator,
  Coffee, CheckCircle2, ChevronLeft, Star, Users, Armchair,
} from "lucide-react";
import { BookingSidebar } from "../components/BookingSidebar.tsx";
import { JSX } from "react/jsx-runtime";
import { ROOMS } from "../data/roomsDataType.ts";
import { useBookingForm } from "../../services/hooks/useBookingForm.ts";

const AMENITY_ICONS: Record<string, JSX.Element> = {
  "wi-fi": <Wifi className="w-5 h-5" />,
  "tv": <Tv className="w-5 h-5" />,
  "air": <Wind className="w-5 h-5" />,
  "kitchen": <Utensils className="w-5 h-5" />,
  "bath": <Bath className="w-5 h-5" />,
  "fridge": <Refrigerator className="w-5 h-5" />,
  "refrigerator": <Refrigerator className="w-5 h-5" />,
  "living": <Armchair className="w-5 h-5" />,
  "balcony": <Maximize className="w-5 h-5" />,
  "desk": <Coffee className="w-5 h-5" />,
};

function getAmenityIcon(amenity: string) {
  const lower = amenity.toLowerCase();
  for (const [key, icon] of Object.entries(AMENITY_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return <CheckCircle2 className="w-5 h-5" />;
}

export function RoomDetailPage() {
  const { id } = useParams();
  const room = ROOMS.find((r) => r.id === id) || ROOMS[2];

  const booking = useBookingForm(room);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Breadcrumb */}
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

      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[500px]">
          <div className="md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden shadow-sm group">
            <img
              src={room.images[0]}
              alt={`${room.name} main`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          {[room.images[1], room.images[2]].map((img, i) => (
            <div key={i} className="md:col-span-1 md:row-span-1 rounded-2xl overflow-hidden shadow-sm group">
              <img
                src={img}
                alt={`Detail ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
          <div className="md:col-span-2 md:row-span-1 rounded-2xl overflow-hidden shadow-sm relative group">
            <img
              src={room.images[3] || room.images[0]}
              alt="Detail 3"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-gray-900 px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
              View All Photos
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{room.name} Room</h1>
              <div className="flex items-center space-x-4 text-gray-500 text-sm">
                <span className="flex items-center">
                  <Maximize className="w-4 h-4 mr-1" /> {room.sizeSqM} sq.m.
                </span>
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" /> {room.baseGuests}–{room.maxGuests} Guests
                </span>
                <span className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" /> Luxury Choice
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{room.description}</p>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Room Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room.amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center text-gray-600">
                    <div className="text-[#006b54] mr-3 bg-[#006b54]/5 p-2 rounded-full">
                      {getAmenityIcon(item)}
                    </div>
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">House Rules</h2>
              <ul className="space-y-3">
                {["Check-in time: 14:00 PM", "Check-out time: 12:00 PM", "No smoking allowed in the room"].map(
                  (rule, i) => (
                    <li key={i} className="flex items-start text-gray-600 text-sm">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                      {rule}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BookingSidebar
              room={room}
              checkIn={booking.checkIn}
              checkOut={booking.checkOut}
              guests={booking.guests}
              extraBeds={booking.extraBeds}
              includeBreakfast={booking.includeBreakfast}
              nights={booking.nights}
              priceSummary={booking.priceSummary}
              todayStr={booking.todayStr}
              minCheckOut={booking.minCheckOut}
              isReadyToBook={booking.isReadyToBook}
              onCheckInChange={booking.setCheckIn}
              onCheckOutChange={booking.setCheckOut}
              onGuestsChange={booking.setGuests}
              onExtraBedsChange={booking.setExtraBeds}
              onIncludeBreakfastChange={booking.setIncludeBreakfast}
              bookingLinkTo="/booking/guest"
              bookingLinkState={{
                room,
                checkInPrev: booking.checkIn,
                checkOutPrev: booking.checkOut,
                calDateDiffPrev: booking.nights,
                extraBedsPrev: booking.extraBeds,
                includeBreakfastPrev: booking.includeBreakfast,
                totalPricePrev: booking.priceSummary,
                guestsPrev: booking.guests,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}