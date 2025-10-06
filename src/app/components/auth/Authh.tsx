"use client"

import { useState } from "react";
import AuthToggle from "./AuthToggle";
import { toast } from "react-toastify";
import InputField from "../InputField";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useForm, SubmitHandler } from "react-hook-form";

type AuthFormData = {
  email: string;
  password: string;
};

export const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { register, handleSubmit } = useForm<AuthFormData>();
  const router = useRouter();

  const submitForm: SubmitHandler<AuthFormData> = async ({ email, password }) => {
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Account created successfully!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("You’re logged in!");
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };
  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 6) + "…");


  return (
    <div className="max-w-sm mx-auto mt-18 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isSignUp ? "Sign Up" : "Sign In"}
      </h2>

      <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
        <InputField
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
        />
        <InputField
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white 
                     rounded-lg px-4 py-2 font-medium transition cursor-pointer"
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>

      <AuthToggle isSignUp={isSignUp} onToggle={() => setIsSignUp(!isSignUp)} />
    </div>
  );
};
