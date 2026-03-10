import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { ROOMS } from "../data/rooms.ts";
import { 
  Users, 
  Maximize, 
  Star, 
  BedDouble, 
  CheckCircle2,
  GraduationCap,
  Building2,
  Calendar as CalendarIcon,
  Filter
} from 'lucide-react';
import { Button } from "../components/ui/button.tsx";
import { Badge } from "../components/ui/badge.tsx";
import { Card } from "../components/ui/card.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select.tsx";

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const [filteredRooms, setFilteredRooms] = useState(ROOMS);
  const [priceFilter, setPriceFilter] = useState<'all' | 'personnel' | 'general'>('all');
  const [guestFilter, setGuestFilter] = useState<number>(0);

  useEffect(() => {
    // Apply filters
    let rooms = [...ROOMS];

    // Filter by guests
    const guests = parseInt(searchParams.get('guests') || '0') || guestFilter;
    if (guests > 0) {
      rooms = rooms.filter(room => room.maxGuests >= guests);
    }

    setFilteredRooms(rooms);
  }, [searchParams, guestFilter]);

  const getPriceDisplay = (room: typeof ROOMS[0]) => {
    if (priceFilter === 'personnel') {
      return room.rates.daily.personnel;
    } else if (priceFilter === 'general') {
      return room.rates.daily.general;
    }
    // Show both if 'all'
    return room.rates.daily.general;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Available Rooms
          </h1>
          <p className="text-gray-600">
            Found {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} matching your criteria
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#006b54]" />
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guest Type
              </label>
              <Select value={priceFilter} onValueChange={(value: any) => setPriceFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="personnel">University Personnel</SelectItem>
                  <SelectItem value="general">General Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Guests
              </label>
              <Select value={guestFilter.toString()} onValueChange={(value) => setGuestFilter(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any</SelectItem>
                  <SelectItem value="1">1 Guest</SelectItem>
                  <SelectItem value="2">2 Guests</SelectItem>
                  <SelectItem value="3">3 Guests</SelectItem>
                  <SelectItem value="4">4+ Guests</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Room Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                {/* Room Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={room.images[0]}
                    alt={`${room.name} Room`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-[#006b54]">
                    {room.sizeSqM} sq.m.
                  </div>
                  {room.maxExtraBeds > 0 && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-[#006b54] text-white hover:bg-[#005a46]">
                        Extra Bed Available
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Room Details */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {room.name} Room
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 flex-1">
                    {room.description}
                  </p>

                  {/* Room Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Up to {room.maxGuests}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Maximize className="w-4 h-4" />
                      <span>{room.sizeSqM} m²</span>
                    </div>
                    {room.maxExtraBeds > 0 && (
                      <div className="flex items-center gap-1">
                        <BedDouble className="w-4 h-4" />
                        <span>+{room.maxExtraBeds}</span>
                      </div>
                    )}
                  </div>

                  {/* Pricing Tiers */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 border-dashed">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Standard Rate</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        ฿{room.rates.daily.general.toLocaleString()}
                        <span className="text-xs font-normal text-gray-500 ml-1">/night</span>
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 border-dashed">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-3 h-3 text-[#006b54]" />
                        <span className="text-xs font-bold text-[#006b54] uppercase">Personnel</span>
                      </div>
                      <span className="text-lg font-bold text-[#006b54]">
                        ฿{room.rates.daily.personnel.toLocaleString()}
                        <span className="text-xs font-normal text-[#006b54]/70 ml-1">/night</span>
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 border-dashed">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3 h-3 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-600 uppercase">Group (5+ rooms)</span>
                      </div>
                      <span className="text-sm font-bold text-blue-600">
                        ฿{room.rates.group.min5Rooms.toLocaleString()}
                        <span className="text-xs font-normal text-blue-600/70 ml-1">/night</span>
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-3 h-3 text-purple-600" />
                        <span className="text-xs font-semibold text-purple-600 uppercase">Monthly Rate</span>
                      </div>
                      <span className="text-sm font-bold text-purple-600">
                        ฿{room.rates.monthly.toLocaleString()}
                        <span className="text-xs font-normal text-purple-600/70 ml-1">/month</span>
                      </span>
                    </div>
                  </div>

                  {room.maxExtraBeds > 0 && (
                    <p className="text-xs text-gray-500 mb-4">
                      <CheckCircle2 className="w-3 h-3 inline mr-1" />
                      Extra bed: ฿{room.extraBedPrice.toLocaleString()}/night
                    </p>
                  )}

                  {/* Amenities Preview */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.amenities.slice(0, 3).map((amenity, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {room.amenities.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{room.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <Link to={`/room/${room.id}`} className="flex-1">
                      <Button variant="outline" className="w-full border-[#006b54] text-[#006b54] hover:bg-[#006b54]/5">
                        View Details
                      </Button>
                    </Link>
                    <Link to="/booking/guest" className="flex-1">
                      <Button className="w-full bg-[#006b54] hover:bg-[#005a46]">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No rooms found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters to see more options
            </p>
            <Button
              onClick={() => {
                setPriceFilter('all');
                setGuestFilter(0);
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Booking Information */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Information</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Check-in / Check-out</h3>
              <p>Check-in: 2:00 PM</p>
              <p>Check-out: 12:00 PM</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Cancellation Policy</h3>
              <p>Free cancellation before check-in for unpaid reservations</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Extra Services</h3>
              <p>Breakfast: ฿150/person</p>
              <p>Extra bed: Varies by room type</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Contact</h3>
              <p>Phone: +66 2 XXX XXXX</p>
              <p>Email: info@kuhome.ku.ac.th</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
