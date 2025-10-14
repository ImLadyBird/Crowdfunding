"use client";

import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { WizardContext } from "../../WizardForm/page";
import { supabase } from "@/lib/supabaseClient"; // ✅ import your supabase client

function Step2() {
  const { nextStep } = useContext(WizardContext);
  const { register, handleSubmit, getValues, reset } = useFormContext();

  // 👇 this runs when user submits the final step
  async function submitForm() {
    // get *all* form data from both steps
    const data = getValues();

    // get current user from Supabase auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to submit.");
      return;
    }

    // prepare data to insert into Supabase table
    const formData = {
      id: user.id,
      brand: data.brand,
      country: data.country,
      category: data.category,
      subcategory: data.subcategory,
      tags: data.Tags,
      details: data.details,
      socials: data.socilals, // (you spelled it "socilals" in your code)
    };

    const { error } = await supabase.from("Info").insert([formData]);
    // ⬆️ Replace "organizations" with your actual table name

    if (error) {
      console.error("Error saving form data:", error);
      alert("Error saving your information. Check console for details.");
    } else {
      alert("Data submitted successfully!");
      reset(); // optional - clears form
      nextStep?.(); // move to next wizard step, if you have one
    }
  }

  return (
    <div className="flex flex-col gap-4 justify-center px-9 items-center">
      <form onSubmit={handleSubmit(submitForm)}>
        <h1 className="text-3xl self-start text-[#644FC1] mt-10">
          Detailed Info
        </h1>
        <h2 className="font-bold self-start text-gray-700 mt-2">
          What is the primary mission or objective of your organization?
        </h2>
        <span className="font-light text-neutral-600 text-sm">
          Be specific and provide a detailed description of your organization.
        </span>

        <div className="py-9">
          <textarea
            {...register("details")}
            className="border-1 border-[#644FC1] rounded-[5px] w-full h-[200px]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-bold self-start text-gray-700 mt-2">
            Help your contributors find you faster
          </h2>
          <span className="font-light text-neutral-600 text-sm">
            Connect your socials so contributors get to know you better.
          </span>
          <input
            {...register("socilals")}
            type="text"
            className="border-1 border-[#644FC1] rounded-[5px] w-full"
          />
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

export default Step2;
