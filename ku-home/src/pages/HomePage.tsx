import { motion } from "motion/react";
import { useState, forwardRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  ArrowRight,
  Train,
  GraduationCap,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { ROOMS } from "../data/roomsDataType";
export function HomePage() {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 2,
    roomType: "",
  });

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.checkIn) params.append("checkIn", searchData.checkIn);
    if (searchData.checkOut) params.append("checkOut", searchData.checkOut);
    if (searchData.guests)
      params.append("guests", searchData.guests.toString());

    navigate(`/rooms?${params.toString()}`);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section with Search */}
      <section className="relative h-[85vh] min-h-[600px] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src="https://images.unsplash.com/photo-1682310219853-63d0d399362e?auto=format&fit=crop&q=80&w=1080"
            alt="KU Home Exterior"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-20 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center text-white mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight shadow-black/20 drop-shadow-lg">
              Welcome to KU Home
            </h1>
            <p className="text-lg md:text-2xl font-light text-gray-100 max-w-2xl mx-auto drop-shadow-md">
              Your academic sanctuary in the heart of Kasetsart University.
              Modern comfort meets warm hospitality.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row items-center gap-4"
          >
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider ml-1">
                  Check-in
                </label>
                <div className="relative bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors cursor-pointer group">
                  <input
                    type="date"
                    value={searchData.checkIn}
                    onChange={(e) =>
                      setSearchData({ ...searchData, checkIn: e.target.value })
                    }
                    className="w-full p-3 bg-transparent cursor-pointer"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider ml-1">
                  Check-out
                </label>
                <div className="relative bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors cursor-pointer group">
                  <input
                    type="date"
                    value={searchData.checkOut}
                    onChange={(e) =>
                      setSearchData({ ...searchData, checkOut: e.target.value })
                    }
                    className="w-full p-3 bg-transparent cursor-pointer"
                    min={
                      searchData.checkIn ||
                      new Date().toISOString().split("T")[0]
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider ml-1">
                  Guests
                </label>
                <div className="relative bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors cursor-pointer group">
                  <select
                    value={searchData.guests}
                    onChange={(e) =>
                      setSearchData({
                        ...searchData,
                        guests: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-3 bg-transparent cursor-pointer appearance-none"
                  >
                    <option value={0}>Select Room Type</option>
                    <option value={2}>Standard Room Up to 2 Guests</option>
                    <option value={3}>Deluxe Room Up to 3 Guests</option>
                    <option value={4}>Suite Room Up to 4 Guests</option>
                  </select>
                </div>
              </div>
              
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="w-full md:w-auto bg-[#006b54] hover:bg-[#005a46] text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center whitespace-nowrap mt-4 md:mt-0"
            >
              Check Availability
            </button>
          </motion.div>
        </div>
      </section>

      {/* Signature Rooms */}
      <section id="rooms" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-[#006b54] tracking-widest uppercase mb-2">
              Accommodations
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Signature Rooms
            </h3>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              Choose from our carefully designed rooms, each offering a unique
              blend of comfort and style.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {ROOMS.map((room) => (
              <div
                key={room.id}
                className={`bg-white rounded-2xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col ${
                  room.id === "suite"
                    ? "ring-2 ring-[#006b54] ring-offset-2 shadow-xl"
                    : ""
                }`}
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={room.images[0]}
                    alt={`${room.name} Room`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    className={`absolute top-4 right-4 ${room.id === "suite" ? "bg-[#006b54] text-white" : "bg-white/90 backdrop-blur-sm text-[#006b54]"} px-3 py-1 rounded-lg text-xs font-bold`}
                  >
                    {room.sizeSqM} sq.m.
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col relative">
                  {room.id === "suite" && (
                    <div className="absolute top-0 right-0 bg-[#006b54] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase">
                      Best Value
                    </div>
                  )}
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    {room.name} Room
                  </h4>
                  <p className="text-gray-500 mb-6 text-sm flex-1">
                    {room.description}
                  </p>

                  {/* Pricing Display */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200 border-dashed">
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        General Public
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {room.rates.daily.general.toLocaleString()}{" "}
                        <span className="text-xs font-normal text-gray-500">
                          THB
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#006b54] uppercase flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" /> Personnel
                      </span>
                      <span className="text-lg font-bold text-[#006b54]">
                        {room.rates.daily.personnel.toLocaleString()}{" "}
                        <span className="text-xs font-normal text-[#006b54]/70">
                          THB
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-auto">
                    <Link
                      to={`/room/${room.id}`}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center ${
                        room.id === "suite"
                          ? "bg-[#006b54] text-white hover:bg-[#005a46] hover:shadow-lg"
                          : "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      {room.id === "suite" ? (
                        "Book Now"
                      ) : (
                        <>
                          Details <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-sm font-bold text-[#006b54] tracking-widest uppercase mb-2">
                  Location & Convenience
                </h2>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Why Choose KU Home?
                </h3>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Situated perfectly within the Kasetsart University campus, we
                  offer unparalleled convenience for visiting faculty, students,
                  and guests.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-[#006b54]/10 p-3 rounded-xl mr-4 text-[#006b54]">
                      <Train className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-1">
                        BTS Connectivity
                      </h4>
                      <p className="text-gray-500">
                        Minutes away from BTS Kasetsart University Station
                        (Green Line), connecting you to the heart of Bangkok.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-[#006b54]/10 p-3 rounded-xl mr-4 text-[#006b54]">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-1">
                        On-Campus Location
                      </h4>
                      <p className="text-gray-500">
                        Located at Gate 2, Ngamwongwan Road. Direct access to
                        all university facilities and faculties.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-[#006b54]/10 p-3 rounded-xl mr-4 text-[#006b54]">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-1">
                        Secure & Private
                      </h4>
                      <p className="text-gray-500">
                        24/7 security, keycard access, and a peaceful
                        environment conducive to rest and study.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-[#006b54]/10 rounded-[32px] rotate-3 z-0"></div>
                <img
                  src="https://images.unsplash.com/photo-1677129666186-d29eba893fe3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJlY2VwdGlvbiUyMHNtaWxpbmclMjBzdGFmZiUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzA3OTM4NTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Staff at reception"
                  className="relative rounded-2xl shadow-2xl z-10 w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl z-20 flex items-center space-x-4 max-w-xs">
                  <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      Prime Location
                    </div>
                    <div className="text-xs text-gray-500">
                      50 Ngamwongwan Road
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
