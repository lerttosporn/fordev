import { Link } from "react-router-dom";
import { Check, Download, MapPin, Home } from "lucide-react";
import { motion } from "motion/react";

export function SuccessPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-20 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-xl max-w-2xl w-full mx-4 overflow-hidden relative"
      >
        <div className="bg-[#006b54] p-12 text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-white/10 opacity-20 pattern-dots"></div>
           <motion.div 
             initial={{ scale: 0, rotate: -180 }}
             animate={{ scale: 1, rotate: 0 }}
             transition={{ delay: 0.2, type: "spring" }}
             className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
           >
              <Check className="w-12 h-12 text-[#006b54] stroke-[3]" />
           </motion.div>
           <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
           <p className="text-green-100">Thank you for choosing KU Home.</p>
        </div>

        <div className="p-8 md:p-12">
           <div className="text-center mb-8">
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Booking Reference</p>
              <p className="text-3xl font-mono font-bold text-gray-900 tracking-wider">KU-8829-XJ</p>
           </div>

           <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm mb-8 border-b border-gray-100 pb-8">
              <div>
                 <p className="text-gray-500 mb-1">Check-in</p>
                 <p className="font-bold text-gray-900">Oct 12, 2024</p>
                 <p className="text-xs text-gray-400">After 14:00</p>
              </div>
              <div className="text-right">
                 <p className="text-gray-500 mb-1">Check-out</p>
                 <p className="font-bold text-gray-900">Oct 14, 2024</p>
                 <p className="text-xs text-gray-400">Before 12:00</p>
              </div>
              <div className="col-span-2 pt-2">
                 <p className="text-gray-500 mb-1">Room Type</p>
                 <p className="font-bold text-gray-900">Suite Room (x1)</p>
              </div>
              <div className="col-span-2">
                 <p className="text-gray-500 mb-1">Guest Name</p>
                 <p className="font-bold text-gray-900">Dr. Somsak Jai-dee</p>
              </div>
           </div>

           <div className="flex flex-col space-y-3">
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl flex items-center justify-center transition-colors">
                 <Download className="w-5 h-5 mr-2" />
                 Download PDF Receipt
              </button>
              
              <a 
                href="https://maps.google.com" 
                target="_blank"
                rel="noreferrer"
                className="w-full border-2 border-[#006b54] text-[#006b54] hover:bg-[#006b54] hover:text-white font-bold py-3 rounded-xl flex items-center justify-center transition-colors"
              >
                 <MapPin className="w-5 h-5 mr-2" />
                 Get Directions (KU Gate 2)
              </a>
           </div>

           <div className="mt-8 text-center">
              <Link to="/" className="text-gray-400 hover:text-gray-600 font-medium text-sm flex items-center justify-center">
                 <Home className="w-4 h-4 mr-1" /> Return to Home
              </Link>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
