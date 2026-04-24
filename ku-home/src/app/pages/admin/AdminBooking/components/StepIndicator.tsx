import { CheckCircle2 } from "lucide-react";
import { Step, STEP_LABELS } from "../types.ts";

export function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {([1, 2, 3, 4] as Step[]).map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                s < current
                  ? "bg-[#006b54] border-[#006b54] text-white"
                  : s === current
                  ? "border-[#006b54] text-[#006b54] bg-white ring-4 ring-[#006b54]/20"
                  : "border-gray-200 text-gray-400 bg-white"
              }`}
            >
              {s < current ? <CheckCircle2 className="w-4 h-4" /> : s}
            </div>
            <span
              className={`text-[10px] mt-1 font-medium uppercase tracking-wide ${
                s === current ? "text-[#006b54]" : "text-gray-400"
              }`}
            >
              {STEP_LABELS[s]}
            </span>
          </div>
          {i < 3 && (
            <div
              className={`w-16 h-0.5 mb-4 mx-1 transition-all ${
                s < current ? "bg-[#006b54]" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
