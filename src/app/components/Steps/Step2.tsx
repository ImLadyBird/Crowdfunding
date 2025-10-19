"use client";

import { useContext, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { WizardContext } from "../../WizardForm/page";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";
import SocialLinksInput, { SocialLink } from "../SocialLinksInput";

export default function Step2() {
  const wizard = useContext(WizardContext);
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const socials = watch("socials") || [];

useEffect(() => {
  register("socials", {
    required: "At least one social link is required",
    validate: (links: SocialLink[] = []) => {
      if (links.length === 0) return "At least one social link is required";
      const invalid = links.some(
        (link) =>
          !link.platform ||
          !link.url ||
          !/^https?:\/\//i.test(link.url) ||
          (() => {
            try {
              new URL(link.url);
              return false;
            } catch {
              return true;
            }
          })()
      );
      return invalid
        ? "All links must have a platform and a valid URL"
        : true;
    },
  });
}, [register]);

  async function submitForm() {
    const data = getValues();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to submit.");
      return;
    }

    const formData = {
      user_id: user.id,
      brand: data.brand,
      country: data.country,
      category: data.category,
      subcategory: data.subcategory,
      tags: data.tags,
      details: data.details,
      socials: data.socials,
    };

    const { error } = await supabase.from("Info").insert([formData]);

    if (error) {
      console.error("Error saving form data:", error);
      toast.error("Error saving your information. Check console for details.");
    } else {
      toast.success("Data submitted successfully!");
      reset();
      wizard?.nextStep?.();
    }
  }

  return (
    <div className="flex flex-col gap-4 justify-center px-9 items-center">
      <form onSubmit={handleSubmit(submitForm)} className="w-full max-w-2xl">
        <h1 className="text-3xl self-start text-[#644FC1] mt-10">
          Detailed Info
        </h1>

        <h2 className="font-bold self-start text-gray-700 mt-2">
          What is the primary mission or objective of your organization?
        </h2>
        <span className="font-light text-neutral-600 text-sm">
          Be specific and provide a detailed description of your organization.
        </span>

        <div className="py-6">
          <textarea
            placeholder="Write the details..."
            {...register("details", { required: "Details are required" })}
            className="border border-[#644FC1] rounded-[5px] w-full h-[200px] p-3 outline-none focus:ring-2"
          />
          {errors.details && (
            <p className="text-red-500 text-sm">
              {errors.details.message as string}
            </p>
          )}
        </div>

        {/* Social Links */}
        <div className="flex flex-col gap-2">
          <h2 className="font-bold self-start text-gray-700 mt-2">
            Help your contributors find you faster
          </h2>
          <span className="font-light text-neutral-600 text-sm">
            Connect your socials so contributors get to know you better.
          </span>

          <SocialLinksInput
            value={socials}
            onChange={(links) =>
              setValue("socials", links, { shouldValidate: true })
            }
          />
          {errors.socials && (
            <p className="text-red-500 text-sm">
              {errors.socials.message as string}
            </p>
          )}
        </div>

        <div className="flex flex-row gap-4 justify-center p-9 items-center">
          <button
            type="submit"
            className="bg-[#644FC1] text-white rounded-lg px-4 py-2 font-medium hover:bg-gray-400 cursor-pointer"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
