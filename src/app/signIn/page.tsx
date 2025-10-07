"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import InputField from "../components/InputField";
import Image from "next/image";

interface SignUpFormData {
  username: string;
  email: string;
  password: string;
}

export default function SignIn() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<SignUpFormData>();
  const router = useRouter();

  const onSubmit: SubmitHandler<SignUpFormData> = async ({
    email,
    password,
  }) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      toast.success("SignIn successfully!");
      reset();
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 justify-center p-9 items-center">
      <h2 className="text-xl md:text-3xl text-center mb-2">
        SignIn To Your Personal Account
      </h2>
      <h1 className="text-3xl font-semibold text-center mb-6 text-[#644FC1]">
        FUND FOR FOUND
      </h1>
      <Image src="/logo.png" alt="logo" width={80} height={68} priority />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col w-full max-w-sm"
      >
        <InputField
          type="email"
          placeholder="Email"
          aria-label="Email"
          {...register("email", { required: "Email is required" })}
        />
        <InputField
          type="password"
          placeholder="Password"
          aria-label="Password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full cursor-pointer bg-[#644FC1] text-white rounded-lg px-4 py-2 font-medium transition 
                      ${
                        isSubmitting
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:bg-gray-600"
                      }`}
        >
          {isSubmitting ? "LogIn in to your account..." : "Sign In"}
        </button>
      </form>

      <div className="text-center mt-4 text-sm text-gray-600">
        Do not have an account?{" "}
        <button
          type="button"
          className="text-[#644FC1] underline font-medium cursor-pointer"
          onClick={() => router.push("/signUp")}
        >
          SignUp
        </button>
      </div>
    </div>
  );
}
