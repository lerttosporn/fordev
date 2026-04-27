import { Check } from "lucide-react";

interface StepsProps {
  currentStep: number;
}

export function BookingSteps({ currentStep }: StepsProps) {
  const steps = [
    { id: 1, name: "Room Selection" },
    { id: 2, name: "Guest Details" },
    { id: 3, name: "Payment" },
    { id: 4, name: "Confirmation" },
  ];

  return (
    <div className="w-full bg-white border-b border-gray-100 py-4 mb-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between relative">
          {/* Progress Bar Background */}
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-100 -z-10 transform -translate-y-1/2 hidden md:block" />
          
          {/* Active Progress Bar */}
          <div 
             className="absolute left-0 top-1/2 h-1 bg-[#006b54] -z-10 transform -translate-y-1/2 transition-all duration-500 hidden md:block"
             style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <div key={step.id} className="flex flex-col items-center bg-white px-2">
                <div 
                  className={`
                    w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300
                    ${isCompleted ? 'bg-[#006b54] text-white' : ''}
                    ${isCurrent ? 'bg-[#006b54] text-white ring-4 ring-[#006b54]/20' : ''}
                    ${!isCompleted && !isCurrent ? 'bg-gray-200 text-gray-500' : ''}
                  `}
                >
                  {isCompleted ? <Check size={16} /> : step.id}
                </div>
                <span className={`mt-2 text-xs md:text-sm font-medium ${isCurrent ? 'text-[#006b54]' : 'text-gray-500'}`}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
