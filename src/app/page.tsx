"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // ✅ Check if user is logged in using Supabase Auth
useEffect(() => {
  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  checkUser();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setIsAuthenticated(!!session?.user);
  });

  return () => subscription.unsubscribe();
}, []);


  const handleStart = () => {
    if (isAuthenticated) {
      router.push("/explore");
    } else {
      router.push("/signUp");
    }
  };

  if (isAuthenticated === null) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center px-9 py-15 gap-5">
      <h1 className="text-2xl font-bold text-center text-[#270F94]">
        Create your Profile and take the first step toward new opportunities
      </h1>

      <p className="text-center text-gray-500 max-w-2xl font-light text-sm">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur
        voluptates debitis repellat laudantium dolor distinctio voluptatibus sed
        dolorem similique deleniti.
      </p>

      <div className="flex flex-col items-center justify-center gap-5  border-[1.5px] border-[#644FC1] rounded-2xl mt-2 py-9 px-3">
        <Image src="/bag.png" alt="bag" width={60} height={60} />

        <h2 className="text-xl font-bold text-center text-[#644FC1] mt-5">
          Brand Your Organization
        </h2>

        <p className="text-center text-gray-500 max-w-70 font-light text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>

        <div className="w-full flex flex-col items-center justify-center mt-5">
          <button
            onClick={handleStart}
            className="w-full bg-[#644FC1] text-white text-sm font-medium py-2 px-4 rounded-lg cursor-pointer hover:bg-amber-50 hover:text-[#644FC1] transition"
          >
            Start
          </button>

          <p className="text-center text-gray-500 max-w-70 font-light text-sm mt-1">
            learn more
          </p>
        </div>
      </div>
    </div>
  );
}
