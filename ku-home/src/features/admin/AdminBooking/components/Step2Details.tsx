import { Calendar, BedDouble, Minus, Plus, Trash2 } from "lucide-react";
import { BookingType, RoomAssignment, RoomType } from "../../../../models/index";
import { today, getNextDay } from "../../../../utils/bookingUtils";
import { SectionCard } from "./SectionCard";

interface Step2DetailsProps {
  mode: BookingType;
  checkIn: string;
  setCheckIn: (val: string) => void;
  checkOut: string;
  setCheckOut: (val: string) => void;
  monthStart: string;
  setMonthStart: (val: string) => void;
  monthCount: number;
  setMonthCount: (val: number | ((prev: number) => number)) => void;
  nights: number;
  facilityDate: string;
  setFacilityDate: (val: string) => void;
  facilityTime: string;
  setFacilityTime: (val: string) => void;
  facilityType: string;
  setFacilityType: (val: string) => void;
  facilityPax: number;
  setFacilityPax: (val: number | ((prev: number) => number)) => void;
  roomAssignments: RoomAssignment[];
  updateRA: (i: number, patch: Partial<RoomAssignment>) => void;
  addRoomType: () => void;
  removeRoomType: (i: number) => void;
  roomsList: RoomType[];
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
}

export function Step2Details(props: Step2DetailsProps) {
  const {
    mode, checkIn, setCheckIn, checkOut, setCheckOut, monthStart, setMonthStart, monthCount, setMonthCount, nights,
    facilityDate, setFacilityDate, facilityTime, setFacilityTime, facilityType, setFacilityType, facilityPax, setFacilityPax,
    roomAssignments, updateRA, addRoomType, removeRoomType, roomsList, onBack, onNext, canProceed
  } = props;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Dates */}
      {(mode === "group" || mode === "monthly") && (
        <SectionCard
          icon={<Calendar className="w-5 h-5" />}
          title={mode === "group" ? "Stay Dates" : "Monthly Period"}
        >
          {mode === "group" ? (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Check-in Date</label>
                <input
                  type="date"
                  min={today()}
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (checkOut && e.target.value >= checkOut) setCheckOut("");
                  }}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#006b54] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Check-out Date</label>
                <input
                  type="date"
                  min={checkIn ? getNextDay(checkIn) : getNextDay(today())}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#006b54] outline-none"
                />
              </div>
              {nights > 0 && (
                <div className="md:col-span-2 bg-[#006b54]/5 rounded-lg px-4 py-2 text-sm text-[#006b54] font-semibold">
                  📅 {nights} night{nights !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Start Month</label>
                <input
                  type="month"
                  value={monthStart}
                  onChange={(e) => setMonthStart(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#006b54] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Duration (months)</label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button onClick={() => setMonthCount((m) => Math.max(1, m - 1))} className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-center font-bold text-lg">{monthCount}</span>
                  <button onClick={() => setMonthCount((m) => m + 1)} className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {/* Facility/Meeting/Restaurant Dates */}
      {(mode === "meeting" || mode === "restaurant") && (
        <SectionCard
          icon={<Calendar className="w-5 h-5" />}
          title={mode === "meeting" ? "Meeting Details" : "Restaurant Reservation"}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Date</label>
              <input
                type="date"
                min={today()}
                value={facilityDate}
                onChange={(e) => setFacilityDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#006b54] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Time</label>
              <input
                type="time"
                value={facilityTime}
                onChange={(e) => setFacilityTime(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#006b54] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{mode === "meeting" ? "Meeting Room" : "Table/Room Type"}</label>
              <select
                value={facilityType}
                onChange={(e) => setFacilityType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#006b54] outline-none bg-white"
              >
                {mode === "meeting" ? (
                  <>
                    <option value="standard">Standard Room (up to 10 pax)</option>
                    <option value="large">Large Conference Room (up to 50 pax)</option>
                  </>
                ) : (
                  <>
                    <option value="standard">Standard Table</option>
                    <option value="private">Private VIP Room</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Number of People</label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                <button onClick={() => setFacilityPax((p) => Math.max(1, p - 1))} className="px-4 py-3 hover:bg-gray-50 text-gray-600 border-r border-gray-300">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="flex-1 text-center font-bold text-lg">{facilityPax}</span>
                <button onClick={() => setFacilityPax((p) => p + 1)} className="px-4 py-3 hover:bg-gray-50 text-gray-600 border-l border-gray-300">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Room Assignments */}
      {(mode === "group" || mode === "monthly") && (
        <SectionCard icon={<BedDouble className="w-5 h-5" />} title="Room Selection">
          <div className="space-y-4">
            {roomAssignments.map((ra, i) => {
              const room = roomsList.find((r) => r.id === ra.roomTypeId);
              return (
                <div key={i} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 grid md:grid-cols-3 gap-3">
                      {/* Room Type */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Room Type</label>
                        <select
                          value={ra.roomTypeId}
                          onChange={(e) => updateRA(i, { roomTypeId: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#006b54] outline-none bg-white"
                        >
                          {roomsList.map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Count */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">No. of Rooms</label>
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                          <button onClick={() => updateRA(i, { count: Math.max(1, ra.count - 1) })} className="px-3 py-2.5 hover:bg-gray-50 text-gray-600">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="flex-1 text-center font-bold text-sm">{ra.count}</span>
                          <button onClick={() => updateRA(i, { count: ra.count + 1 })} className="px-3 py-2.5 hover:bg-gray-50 text-gray-600">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Extra Beds */}
                      {mode === "group" && room && room.maxExtraBeds > 0 && (
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Extra Beds</label>
                          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                            <button onClick={() => updateRA(i, { extraBeds: Math.max(0, ra.extraBeds - 1) })} className="px-3 py-2.5 hover:bg-gray-50 text-gray-600">
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="flex-1 text-center font-bold text-sm">{ra.extraBeds}</span>
                            <button onClick={() => updateRA(i, { extraBeds: Math.min(room.maxExtraBeds, ra.extraBeds + 1) })} className="px-3 py-2.5 hover:bg-gray-50 text-gray-600">
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {roomAssignments.length > 1 && (
                      <button onClick={() => removeRoomType(i)} className="text-red-400 hover:text-red-600 p-1 mt-5 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Breakfast Toggle */}
                  {mode === "group" && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ra.includeBreakfast}
                          onChange={(e) => updateRA(i, { includeBreakfast: e.target.checked })}
                          className="w-4 h-4 text-[#006b54] rounded focus:ring-[#006b54]"
                        />
                        <span className="text-sm font-semibold text-gray-700">Include Breakfast (+฿150/person/night)</span>
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
            <button
              onClick={addRoomType}
              className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Room Type
            </button>
          </div>
        </SectionCard>
      )}

      {/* Navigation Buttons */}
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
            canProceed ? "bg-[#006b54] hover:bg-[#005a46] text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
