// components/GoogleSignInButton.tsx
"use client";

import React from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function GoogleSignInButton() {
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // optional: where Supabase redirects after auth success
        redirectTo: `${window.location.origin}/explore`,
      },
    });
    if (error) {
      console.error("Supabase OAuth error:", error.message);
      alert("Sign-in failed — check console");
    }
    // note: supabase will redirect the browser to Google so code after this won't run
  };

  return (
    <button
      onClick={handleSignIn}
      className="flex justify-center items-center gap-2 px-4 py-2 rounded border cursor-pointer hover:bg-gray-200 hover:shadow-md text-center"
    >
      <Image src="/google.png" alt="Google" width={20} height={20} priority />
      Sign in / sign up with Google
    </button>
  );
}
