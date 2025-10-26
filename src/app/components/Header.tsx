"use client";

import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, MouseEvent } from "react";
import type { User } from "@supabase/supabase-js";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [ProfileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        setUsername(user.user_metadata?.username || user.email?.split("@")[0]);
        setIsAuthenticated(true);
      }
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          setUsername(
            session.user.user_metadata?.username ||
              session.user.email?.split("@")[0]
          );
        } else {
          setUser(null);
          setUsername("");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const toggleMenu = (event?: MouseEvent<HTMLButtonElement>) => {
    if (event) event.preventDefault();
    setIsOpen((prev) => !prev);
  };

  const handleStart = () => {
    if (isAuthenticated) {
      router.push("/explore");
      setIsOpen(false);
    } else {
      router.push("/signUp");
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear local state
      setUser(null);
      setUsername(null);
      setIsAuthenticated(false);
      setProfileOpen(false);

      // Redirect to homepage (or login page)
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="relative">
      <div className="bg-gray-200 flex flex-row justify-between items-center p-4 md:px-10 md:shadow-sm">
        <Image src="/logo.png" alt="logo" width={50} height={68} />

        {/* 🔹 Mobile buttons */}
        <div className="flex flex-row gap-4 md:hidden">
          <button aria-label="Search">
            <Image src="/search-p.svg" alt="search" width={20} height={20} />
          </button>
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="cursor-pointer"
          >
            <Image src="/Ham.svg" alt="ham" width={24} height={16} />
          </button>
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center justify-center cursor-pointer bg-[#E8E8E8] border-[1.5px] border-[#644FC1] rounded-full w-10 h-10 text-sm font-medium text-gray-700"
          >
            {username && (
              <span className="text-[#644FC1] font-semibold text-xl">
                {username.charAt(0).toUpperCase()}
              </span>
            )}
          </button>
        </div>

        {/* 🔹 Desktop nav links */}
        <div className="hidden md:flex flex-row gap-4">
          {[
            { href: "/", label: "Home" },
            { href: "/explore", label: "Explore" },
            { href: "/about", label: "About Us" },
            { href: "/help", label: "Help & Support" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-4 py-2 text-[#444444] text-[14px] hover:text-indigo-800 font-medium hover:border-b-2"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* 🔹 Desktop search + user circle */}
        <div className="hidden md:flex flex-row items-center gap-2 max-h-9">
          <div className="flex flex-row gap-2 items-center border border-gray-400 rounded-[10px] px-2 py-1 shadow-sm">
            <Image src="/search.svg" alt="search" width={15} height={20} />
            <input
              type="text"
              className="text-[12px] focus:outline-none"
              placeholder="Search..."
            />
          </div>

          {/* 🔹 User icon or username circle */}
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center justify-center cursor-pointer hover:bg-gray-300 bg-[#E8E8E8] border-[1.5px] border-[#644FC1] rounded-full w-10 h-10 text-sm font-medium text-gray-700"
          >
            {username && (
              <span className="text-[#644FC1] font-semibold text-xl">
                {username.charAt(0).toUpperCase()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 🔹 Mobile dropdown menu */}
      {isOpen && (
        <div className="absolute z-50  top-20 w-full bg-white shadow-lg rounded-lg flex flex-col gap-9 p-3 text-gray-700">
          <div className="flex flex-col items-start ">
            {[
              { href: "/", label: "Home", rounded: "rounded-t-lg" },
              { href: "/explore", label: "Explore" },
              { href: "/about", label: "About Us" },
              { href: "/help", label: "Help", rounded: "rounded-b-lg" },
            ].map(({ href, label, rounded }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 text-violet-800 font-bold hover:bg-gray-400 ${
                  rounded || ""
                }`}
                onClick={() => setIsOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col items-center gap-3">
            {!isAuthenticated && (
              <button
                onClick={handleStart}
                className="w-full mx-4 border-1 p-2 bg-violet-200 text-violet-900 hover:bg-white rounded-[5px] border-violet-800"
              >
                Login/Signup
              </button>
            )}
            <button
              onClick={handleStart}
              className="w-full mx-4 border-1 border-violet-900 text-white p-2 bg-violet-900 hover:bg-white rounded-[5px]"
            >
              Start
            </button>
          </div>
        </div>
      )}
      {ProfileOpen && user && (
        <div className="absolute z-50 top-20 right-0 w-full md:max-w-[400px] bg-white shadow-lg rounded-lg flex flex-col gap-9 p-3 text-gray-700">
          <div className="flex flex-row gap-4 items-center justify-start p-3 border-b-1 border-gray-300">
            <div className="flex items-center justify-center bg-[#E8E8E8] border-[1.5px] border-violet-800 rounded-full w-10 h-10 text-sm font-medium text-gray-700">
              <span className="text-violet-800 font-semibold text-xl">
                {username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col">
              <span>{username}</span>
              <span className="text-gray-500">
                {user?.user_metadata?.email}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4 px-3 mt-[-20px] items-start justify-center">
            <Link href="/Profile" onClick={()=> setProfileOpen((prev) => !prev)} className="flex flex-row items-center gap-4">
              <Image src="/pro.svg" alt="settings" width={25} height={20} />
              <span className="text-gray-600 text-m hover:border-b-2">
                My Profile
              </span>
            </Link>
            <Link href="/Profile" onClick={()=> setProfileOpen((prev) => !prev)} className="flex flex-row items-center gap-4">
              <Image src="/bag.svg" alt="settings" width={25} height={20} />
              <span className="text-gray-600 text-m hover:border-b-2">
                My Brand/Organization
              </span>
            </Link>
            <Link href="/Profile" onClick={()=> setProfileOpen((prev) => !prev)} className="flex flex-row items-center gap-4">
              <Image src="/setting.svg" alt="settings" width={25} height={20} />
              <span className="text-gray-600 text-m hover:border-b-2">
                Setting
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex flex-row items-center gap-4 text-left w-full cursor-pointer  "
            >
              <Image src="/logout.svg" alt="logout" width={25} height={20} />
              <span className="text-gray-600 text-m hover:border-b-2">
                Log out
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
