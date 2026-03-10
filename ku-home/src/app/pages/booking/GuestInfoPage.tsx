import { Link } from "react-router-dom";
import { BookingSteps } from "../../components/BookingSteps.tsx";
import { Upload, User, Mail, Phone, CreditCard, ChevronRight, Coffee } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

const BREAKFAST_PRICE_PER_PERSON = 150;
const MOCK_NIGHTS = 2;
const MOCK_GUESTS = 2;
const MOCK_ROOM_RATE_GENERAL = 1800;
const MOCK_ROOM_RATE_KU = 1500;

export function GuestInfoPage() {
  const [isKuMember, setIsKuMember] = useState(false);
  const [includeBreakfast, setIncludeBreakfast] = useState(false);

  const roomRate = isKuMember ? MOCK_ROOM_RATE_KU : MOCK_ROOM_RATE_GENERAL;
  const roomTotal = roomRate * MOCK_NIGHTS;
  const breakfastTotal = includeBreakfast ? BREAKFAST_PRICE_PER_PERSON * MOCK_GUESTS * MOCK_NIGHTS : 0;
  const grandTotal = roomTotal + breakfastTotal;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <BookingSteps currentStep={2} />

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <User className="w-6 h-6 mr-3 text-[#006b54]" />
                Guest Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                  <select className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#006b54] focus:border-transparent outline-none transition-all">
                    <option>Mr.</option>
                    <option>Ms.</option>
                    <option>Mrs.</option>
                    <option>Dr.</option>
                  </select>
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Nationality</label>
                   <input type="text" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#006b54] focus:border-transparent outline-none transition-all" placeholder="Thai" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#006b54] focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#006b54] focus:border-transparent outline-none transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">ID Card / Passport Number</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#006b54] focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" /> Email Address
                  </label>
                  <input type="email" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#006b54] focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" /> Phone Number
                  </label>
                  <input type="tel" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#006b54] focus:border-transparent outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* KU Member Toggle */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <GraduationCapIcon className="w-6 h-6 mr-3 text-[#006b54]" />
                KU Member Discount
              </h2>
              <div className="flex items-center mb-4">
                 <button
                   onClick={() => setIsKuMember(!isKuMember)}
                   className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isKuMember ? 'bg-[#006b54]' : 'bg-gray-200'}`}
                 >
                   <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isKuMember ? 'translate-x-6' : 'translate-x-1'}`} />
                 </button>
                 <span className="ml-3 text-sm font-medium text-gray-900">
                   I am a KU Student or Staff Member <span className="text-[#006b54] font-bold">(Eligible for Special Rate)</span>
                 </span>
               </div>

               {isKuMember && (
                 <motion.div 
                   initial={{ height: 0, opacity: 0 }}
                   animate={{ height: "auto", opacity: 1 }}
                   className="bg-gray-50 rounded-xl p-6 border border-dashed border-gray-300"
                 >
                    <label className="block text-sm font-bold text-gray-700 mb-3">Upload KU ID Card / Staff ID</label>
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500">PNG, JPG or PDF (MAX. 5MB)</p>
                            </div>
                            <input type="file" className="hidden" />
                        </label>
                    </div>
                 </motion.div>
               )}
            </div>

            <div className="flex justify-end pt-4">
               <Link 
                 to="/booking/payment"
                 className="bg-[#006b54] hover:bg-[#005a46] text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center"
               >
                 Proceed to Payment <ChevronRight className="w-5 h-5 ml-2" />
               </Link>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">Booking Summary</h3>
                
                {/* Room Info */}
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1763402578679-f6fba8bee3e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    alt="Room"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">Suite Room</h4>
                    <p className="text-sm text-gray-500">1 Bedroom, 52 sq.m.</p>
                  </div>
                </div>

                {/* Stay Details */}
                <div className="space-y-3 text-sm text-gray-600 mb-5">
                  <div className="flex justify-between">
                    <span>Check-in</span>
                    <span className="font-medium text-gray-900">Oct 12, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out</span>
                    <span className="font-medium text-gray-900">Oct 14, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span className="font-medium text-gray-900">{MOCK_NIGHTS} Nights</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests</span>
                    <span className="font-medium text-gray-900">{MOCK_GUESTS} Adults</span>
                  </div>
                </div>

                {/* ── Breakfast Checkbox ── */}
                <div className="mb-5">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Add-on Services</p>
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
                      onChange={(e) => setIncludeBreakfast(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[#006b54] cursor-pointer flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <Coffee className="w-4 h-4 text-[#006b54]" />
                        <span className="text-sm font-semibold text-gray-900">Breakfast</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        ฿{BREAKFAST_PRICE_PER_PERSON}/person/night · {MOCK_GUESTS} guests × {MOCK_NIGHTS} nights
                      </p>
                    </div>
                    <span className={`text-sm font-bold flex-shrink-0 ${includeBreakfast ? "text-[#006b54]" : "text-gray-400"}`}>
                      +฿{(BREAKFAST_PRICE_PER_PERSON * MOCK_GUESTS * MOCK_NIGHTS).toLocaleString()}
                    </span>
                  </label>
                </div>

                {/* Price Breakdown */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-gray-600">Room Rate</span>
                    <span className="font-medium text-gray-900">
                      ฿{roomRate.toLocaleString()} × {MOCK_NIGHTS}
                    </span>
                  </div>

                  {isKuMember && (
                    <div className="flex justify-between items-center mb-2 text-sm text-green-600">
                      <span>KU Discount</span>
                      <span>-฿{((MOCK_ROOM_RATE_GENERAL - MOCK_ROOM_RATE_KU) * MOCK_NIGHTS).toLocaleString()}</span>
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
                      <span>+฿{breakfastTotal.toLocaleString()}</span>
                    </motion.div>
                  )}

                  <div className="border-t border-gray-200 pt-3 mt-2 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-xl text-[#006b54]">
                      ฿{grandTotal.toLocaleString()} THB
                    </span>
                  </div>
                </div>

             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function GraduationCapIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
