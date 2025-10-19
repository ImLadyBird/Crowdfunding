"use client";

import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { WizardContext } from "../../WizardForm/page";
import TagInput from "../TagInput";
import Button from "../../components/Button";

export default function Step1() {
  const wizard = useContext(WizardContext);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const watchedTags = watch("tags") || [];

  function onSubmit() {
    wizard?.nextStep?.();
  }

  return (
    <div className="flex flex-col gap-4 justify-center px-9 items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 px-5"
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
              {...register("brand", { required: "This field is required" })}
              type="text"
              className="border-1 border-[#644FC1] rounded-[5px]"
            />
            {errors.brand && (
              <p className="text-red-500 text-sm">
                {errors.brand.message as string}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="country" className="text-sm font-extralight">
              Country
            </label>
            <input
              {...register("country", { required: "This field is required" })}
              type="text"
              className="border-1 border-[#644FC1] rounded-[5px]"
            />
            {errors.country && (
              <p className="text-red-500 text-sm">
                {errors.country.message as string}
              </p>
            )}
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
              {...register("category", { required: "This field is required" })}
              type="text"
              className="border-1 border-[#644FC1] rounded-[5px]"
            />
            {errors.category && (
              <p className="text-red-500 text-sm">
                {errors.category.message as string}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="country" className="text-sm font-extralight">
              Subcategory
            </label>
            <input
              {...register("subcategory", {
                required: "This field is required",
              })}
              type="text"
              className="border-1 border-[#644FC1] rounded-[5px]"
            />
            {errors.category && (
              <p className="text-red-500 text-sm">
                {errors.category.message as string}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="tag" className="text-sm font-extralight">
            Brand Tags
          </label>
          <TagInput
            suggestions={[
              "UI",
              "Web",
              "Software",
              "Web design",
              "UI design",
              "Software",
              "Product design",
            ]}
            placeholder="Type or Select..."
            onChange={(newTags) => setValue("tags", newTags)}
          />
          <p className="text-sm text-gray-500">
            Current Tags: {watchedTags.join(", ")}
          </p>
        </div>
        <label className="text-sm font-extralight flex items-center">
          <input
            type="checkbox"
            {...register("acceptTerms", {
              required: "You must accept the terms of service",
            })}
          />
          <span className="ml-2">I agree to the terms of services of 3F.</span>
        </label>
        {errors.acceptTerms && (
          <p className="text-red-500 text-sm">
            {errors.acceptTerms.message as string}
          </p>
        )}
        <div className="flex flex-row gap-4 justify-center p-9 items-center">
          <Button
            type="submit"
            text="Continue"
            className="bg-[#644FC1] text-white rounded-lg px-4 py-2 font-medium hover:bg-gray-400 cursor-pointer"
          />
        </div>
      </form>
    </div>
  );
}
