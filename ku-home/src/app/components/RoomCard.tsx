import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap } from "lucide-react";
import { RoomType } from "../../models/Room.ts";

interface RoomCardProps {
  room: RoomType;
}

export function RoomCard({ room }: RoomCardProps) {
  const isSuite = room.name === "Suite";

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col ${
        isSuite ? "ring-2 ring-[#006b54] ring-offset-2 shadow-xl" : ""
      }`}
    >
      <div className="h-64 overflow-hidden relative">
        <img
          src={room.images[0]}
          alt={`${room.name} Room`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div
          className={`absolute top-4 right-4 ${isSuite ? "bg-[#006b54] text-white" : "bg-white/90 backdrop-blur-sm text-[#006b54]"} px-3 py-1 rounded-lg text-xs font-bold`}
        >
          {room.sizeSqM} sq.m.
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col relative">
        {isSuite && (
          <div className="absolute top-0 right-0 bg-[#006b54] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase">
            Best Value
          </div>
        )}

        <h4 className="text-2xl font-bold text-gray-900 mb-2">{room.name} Room</h4>
        <p className="text-gray-500 mb-6 text-sm flex-1">{room.description}</p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200 border-dashed">
            <span className="text-xs font-semibold text-gray-500 uppercase">General Public</span>
            <span className="text-lg font-bold text-gray-900">
              {room.rates.daily.general.toLocaleString()}{" "}
              <span className="text-xs font-normal text-gray-500">THB</span>
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-[#006b54] uppercase flex items-center gap-1">
              <GraduationCap className="w-3 h-3" /> Personnel
            </span>
            <span className="text-lg font-bold text-[#006b54]">
              {room.rates.daily.personnel.toLocaleString()}{" "}
              <span className="text-xs font-normal text-[#006b54]/70">THB</span>
            </span>
          </div>
        </div>

        <Link
          to={`/room/${room.id}`}
          className="w-full py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
        >
          Details <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}