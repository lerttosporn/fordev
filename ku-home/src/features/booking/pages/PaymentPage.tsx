import { Link } from "react-router-dom";
import { BookingSteps } from "../components/BookingSteps";
import { QrCode, Building, CreditCard, ChevronLeft, Upload } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

export function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'internal' | 'bank'>('qr');

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <BookingSteps currentStep={3} />

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
               <button 
                 onClick={() => setPaymentMethod('qr')}
                 className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${paymentMethod === 'qr' ? 'border-[#006b54] bg-[#006b54]/5 text-[#006b54]' : 'border-gray-200 bg-white hover:border-[#006b54]/50'}`}
               >
                  <QrCode className="w-8 h-8 mb-2" />
                  <span className="font-bold text-sm">QR PromptPay</span>
               </button>
               <button 
                 onClick={() => setPaymentMethod('internal')}
                 className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${paymentMethod === 'internal' ? 'border-[#006b54] bg-[#006b54]/5 text-[#006b54]' : 'border-gray-200 bg-white hover:border-[#006b54]/50'}`}
               >
                  <Building className="w-8 h-8 mb-2" />
                  <span className="font-bold text-sm text-center">Inter-departmental</span>
               </button>
               <button 
                 onClick={() => setPaymentMethod('bank')}
                 className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${paymentMethod === 'bank' ? 'border-[#006b54] bg-[#006b54]/5 text-[#006b54]' : 'border-gray-200 bg-white hover:border-[#006b54]/50'}`}
               >
                  <CreditCard className="w-8 h-8 mb-2" />
                  <span className="font-bold text-sm">Bank Transfer</span>
               </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {paymentMethod === 'qr' && (
                <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="flex flex-col items-center text-center"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Scan to Pay</h3>
                  <p className="text-gray-500 mb-6">Please scan the QR code below with your banking app.</p>
                  
                  <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-200 mb-6">
                     <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded-lg">
                        {/* Placeholder QR */}
                        <QrCode className="w-24 h-24 text-gray-300" />
                     </div>
                  </div>
                  
                  <div className="text-left w-full max-w-md bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                     <div className="flex justify-between mb-2">
                        <span>Account Name:</span>
                        <span className="font-bold">KU Home Kasetsart University</span>
                     </div>
                     <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="font-bold text-[#006b54]">3,600.00 THB</span>
                     </div>
                  </div>
                </motion.div>
              )}

              {paymentMethod === 'internal' && (
                <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                >
                   <h3 className="text-lg font-bold text-gray-900 mb-4">University Internal Transfer</h3>
                   <p className="text-gray-600 mb-6">For Kasetsart University departments and units only.</p>
                   <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Department / Faculty Name</label>
                        <input type="text" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#006b54]" placeholder="e.g. Faculty of Engineering" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">ERP / Budget Code</label>
                        <input type="text" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#006b54]" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Contact Person</label>
                        <input type="text" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#006b54]" />
                      </div>
                   </div>
                </motion.div>
              )}

              {paymentMethod === 'bank' && (
                <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Bank Transfer</h3>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-6">
                     <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs mr-4">BBL</div>
                        <div>
                           <p className="font-bold text-gray-900">Bangkok Bank</p>
                           <p className="text-sm text-gray-600">Kasetsart University Branch</p>
                        </div>
                     </div>
                     <p className="text-xl font-mono text-gray-800 tracking-wider mb-1">123-4-56789-0</p>
                     <p className="text-sm text-gray-500">Account Name: KU Home</p>
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <h4 className="font-bold text-gray-900 mb-3">Upload Payment Slip</h4>
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> payment slip</p>
                            </div>
                            <input type="file" className="hidden" />
                        </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex justify-between pt-8">
               <Link 
                 to="/booking/guest"
                 className="text-gray-500 font-medium hover:text-gray-900 flex items-center px-4"
               >
                 <ChevronLeft className="w-5 h-5 mr-1" />
                 Back to Guest Details
               </Link>
               <Link 
                 to="/booking/success"
                 className="bg-[#006b54] hover:bg-[#005a46] text-white py-4 px-12 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
               >
                 Confirm Payment
               </Link>
            </div>
          </div>

          {/* Sidebar Summary (Repeated for context) */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">Order Summary</h3>
                <div className="flex justify-between items-center mb-6">
                   <span className="text-gray-600">Total Amount</span>
                   <span className="text-2xl font-bold text-[#006b54]">3,600 THB</span>
                </div>
                <div className="bg-yellow-50 text-yellow-800 text-xs p-3 rounded-lg mb-4">
                   Note: Room availability is guaranteed for 15 minutes while you complete payment.
                </div>
                <div className="text-xs text-gray-400 text-center">
                   Secure Payment Encrypted 256-bit SSL
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
