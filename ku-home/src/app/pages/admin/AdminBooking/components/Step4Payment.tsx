import { CreditCard, QrCode, Building2, Tag } from "lucide-react";
import { PaymentMethod } from "../types.ts";
import { DepartmentInfo } from "../../../../../models/index.ts";
import { SectionCard } from "./SectionCard.tsx";

interface Step4PaymentProps {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (m: PaymentMethod) => void;
  deptInfo: DepartmentInfo;
  setDeptInfo: (info: DepartmentInfo | ((prev: DepartmentInfo) => DepartmentInfo)) => void;
  discountCode: string;
  setDiscountCode: (val: string) => void;
  totalAmount: number;
  totalRooms: number;
  mode: string;
  facilityPax: number;
  onBack: () => void;
  onSubmit: () => void;
}

export function Step4Payment({
  paymentMethod, setPaymentMethod, deptInfo, setDeptInfo,
  discountCode, setDiscountCode, totalAmount, totalRooms, mode, facilityPax,
  onBack, onSubmit
}: Step4PaymentProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <SectionCard icon={<CreditCard className="w-5 h-5" />} title="Payment Summary">
        <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
            <span>Mode</span>
            <span className="font-semibold capitalize">{mode}</span>
          </div>
          <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
            <span>{mode === "meeting" || mode === "restaurant" ? "Pax / People" : "Total Rooms"}</span>
            <span className="font-semibold">{mode === "meeting" || mode === "restaurant" ? `${facilityPax} pax` : `${totalRooms} rooms`}</span>
          </div>
          <div className="w-full h-px bg-gray-200 mb-4" />
          <div className="flex justify-between items-end">
            <span className="text-gray-900 font-bold">Total Amount</span>
            <span className="text-3xl font-black text-[#006b54]">
              ฿{totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setPaymentMethod("qr")}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                paymentMethod === "qr"
                  ? "border-[#006b54] bg-[#006b54]/5 text-[#006b54]"
                  : "border-gray-200 bg-white text-gray-500 hover:border-[#006b54]/40"
              }`}
            >
              <QrCode className="w-6 h-6" />
              <span className="font-bold text-sm">QR PromptPay</span>
            </button>
            <button
              onClick={() => setPaymentMethod("cash")}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                paymentMethod === "cash"
                  ? "border-[#006b54] bg-[#006b54]/5 text-[#006b54]"
                  : "border-gray-200 bg-white text-gray-500 hover:border-[#006b54]/40"
              }`}
            >
              <CreditCard className="w-6 h-6" />
              <span className="font-bold text-sm">Cash / Card</span>
            </button>
            <button
              onClick={() => setPaymentMethod("department")}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all text-center ${
                paymentMethod === "department"
                  ? "border-[#006b54] bg-[#006b54]/5 text-[#006b54]"
                  : "border-gray-200 bg-white text-gray-500 hover:border-[#006b54]/40"
              }`}
            >
              <Building2 className="w-6 h-6" />
              <span className="font-bold text-sm">Department</span>
            </button>
          </div>
        </div>

        {paymentMethod === "department" && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6">
            <h4 className="font-bold text-blue-900 mb-4">Department Billing Details</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-blue-700 uppercase mb-1">Department Name</label>
                <input
                  type="text"
                  value={deptInfo.deptName}
                  onChange={(e) => setDeptInfo((prev) => ({ ...prev, deptName: e.target.value }))}
                  className="w-full border border-blue-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-blue-700 uppercase mb-1">ERP Code / Project Code</label>
                <input
                  type="text"
                  value={deptInfo.erpCode}
                  onChange={(e) => setDeptInfo((prev) => ({ ...prev, erpCode: e.target.value }))}
                  className="w-full border border-blue-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-blue-700 uppercase mb-1">Staff ID</label>
                <input
                  type="text"
                  value={deptInfo.staffId}
                  onChange={(e) => setDeptInfo((prev) => ({ ...prev, staffId: e.target.value }))}
                  className="w-full border border-blue-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Discount Code</label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="e.g. KU123"
              className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-[#006b54] outline-none font-mono"
            />
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          className="bg-[#006b54] hover:bg-[#005a46] text-white px-8 py-3 rounded-xl font-bold shadow-md transition-all"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
