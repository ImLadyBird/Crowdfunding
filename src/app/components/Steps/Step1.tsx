"use client";

import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { WizardContext } from "../../WizardForm/page";

export default function Step1() {
  const { nextStep } = useContext(WizardContext);
  const { register, handleSubmit } = useFormContext();

 function onSubmit() {
    nextStep();
  }

  return (
    <div className="flex flex-col gap-4 justify-center p-9 items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-5"
      >
        <h1 className="text-3xl self-start text-[#644FC1] mt-10">Basic Info</h1>
        <h2 className="font-bold self-start text-gray-700 mt-2">
          Tell us about your organization
        </h2>
        <span className="font-light text-neutral-600 text-sm">
          Provide an overview of your organization and brand.
        </span>
        <div className="flex flex-col md:flex-row  gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="brand" className="text-sm font-extralight">
              Brand / Organization Name
            </label>
            <input
              {...register("brand")}
              type="text"
              className="border-1 border-[#644FC1] rounded-[5px]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="country" className="text-sm font-extralight">
              Country
            </label>
            <input
              {...register("country")}
              type="text"
              className="border-1 border-[#644FC1] rounded-[5px]"
            />
          </div>
        </div>
        <span className="font-light text-neutral-600 text-sm max-w-[500px]">
          Select the primary category that best describes your organization.
          then select the subcategory that best describes your organization.
        </span>
        <div className="flex flex-col md:flex-row   gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="brand" className="text-sm font-extralight">
              Category
            </label>
            <input
              {...register("category")}
              type="text"
              className="border-1 border-[#644FC1] rounded-[5px]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="country" className="text-sm font-extralight">
              Subcategory
            </label>
            <input
              {...register("subcategory")}
              type="text"
              className="border-1 border-[#644FC1] rounded-[5px]"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="tag">Brand Tags</label>
          <input
            {...register("Tags")}
            type="text"
            className="border-1 border-[#644FC1] rounded-[5px]"
          />
        </div>
        <label className="text-sm font-extralight flex items-center">
          <input type="checkbox" {...register("acceptTerms")} />
          <span className="ml-2">I agree to the terms of services of 3F.</span>
        </label>
      </form>
    </div>
  );
}
