import { Users, User, Minus, Plus, Trash2 } from "lucide-react";
import { Guest } from "../../../../models/index";
import { SectionCard } from "./SectionCard";

interface Step3GuestsProps {
  guests: Guest[];
  addGuest: () => void;
  removeGuest: (i: number) => void;
  updateGuest: (i: number, patch: Partial<Guest>) => void;
  notes: string;
  setNotes: (val: string) => void;
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
}


export function Step3Guests({
  guests, addGuest, removeGuest, updateGuest, notes, setNotes, onBack, onNext, canProceed
}: Step3GuestsProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <SectionCard icon={<Users className="w-5 h-5" />} title="Guest Information">
        <div className="space-y-6">
          {guests.map((guest, i) => (
            <div key={guest.id} className="border border-gray-200 rounded-xl p-5 bg-gray-50 relative">
              {i > 0 && (
                <button
                  onClick={() => removeGuest(i)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#006b54] text-white flex items-center justify-center text-xs">
                  {i + 1}
                </span>
                {i === 0 ? "Primary Contact" : "Additional Guest"}
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2 flex gap-4">
                  <div className="w-32">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                    <select
                      value={guest.title}
                      onChange={(e) => updateGuest(i, { title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#006b54] outline-none bg-white"
                    >
                      <option>Mr.</option>
                      <option>Mrs.</option>
                      <option>Ms.</option>
                      <option>Dr.</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">First Name</label>
                    <input
                      type="text"
                      value={guest.firstName}
                      onChange={(e) => updateGuest(i, { firstName: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#006b54] outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Last Name</label>
                    <input
                      type="text"
                      value={guest.lastName}
                      onChange={(e) => updateGuest(i, { lastName: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#006b54] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={guest.email}
                    onChange={(e) => updateGuest(i, { email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#006b54] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                  <input
                    type="tel"
                    value={guest.phone}
                    onChange={(e) => updateGuest(i, { phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#006b54] outline-none"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addGuest}
            className="text-[#006b54] font-bold text-sm flex items-center gap-1 hover:underline"
          >
            <Plus className="w-4 h-4" /> Add Another Guest
          </button>
        </div>
      </SectionCard>

      <SectionCard icon={<User className="w-5 h-5" />} title="Additional Requests (Optional)">
        <div>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special requests or notes for this booking..."
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#006b54] outline-none resize-none"
          />
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
          onClick={onNext}
          disabled={!canProceed}
          className={`px-8 py-3 rounded-xl font-bold shadow-md transition-all ${
            canProceed
              ? "bg-[#006b54] hover:bg-[#005a46] text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
