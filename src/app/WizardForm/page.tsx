"use client";

import { createContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Button from "../components/Button";
import { useWizard } from "../hooks/useWizard";
import Step1 from "../components/Steps/Step1";
import Step2 from "../components/Steps/Step2";
import Step3 from "../components/Steps/Step3";

interface WizardContext {
  nextStep: () => void;
  prevStep: () => void;
}

export const WizardContext = createContext<WizardContext | null>(null);

function WizardForm() {
  const { nextStep, prevStep, step } = useWizard({});

  const { ...props } = useForm({});

  const steps = {
    0: <Step1 />,
    1: <Step2 />,
    2: <Step3 />,
  };

  return (
    <WizardContext.Provider value={{ nextStep, prevStep }}>
      <FormProvider {...props}>{steps[step]}</FormProvider>
      <div className="flex flex-row gap-4 justify-center p-9 items-center">
        <Button text="Back" hidden={step === 0 || step === 2 || step === 1} onClick={prevStep} />
        <Button text="Continue" hidden={step === 2 || step === 1} onClick={nextStep} />
      </div>
    </WizardContext.Provider>
  );
}
export default WizardForm;
