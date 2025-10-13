import { useState } from "react";

interface WizardProps {
  initialStep?: number;
  steps?: number;
}

export function useWizard({ initialStep, steps }: WizardProps) {
  const [step, setStep] = useState(initialStep ?? 0);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return {
    nextStep,
    prevStep,
    step,
  };
}
