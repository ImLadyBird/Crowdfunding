"use client";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center mt-6">
      {steps.map((num, idx) => (
        <div key={num} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-medium transition-all
              ${num - 1 === currentStep ? "bg-[#644FC1]" : "bg-[#b8a7f5]"}
            `}
          >
            {num}
          </div>
          {idx < steps.length - 1 && (
            <div
              className={`w-10 h-[2px] mx-2 transition-all ${
                num - 1 < currentStep ? "bg-[#644FC1]" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
