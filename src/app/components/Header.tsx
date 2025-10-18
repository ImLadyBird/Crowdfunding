"use client";

import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, MouseEvent } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUsername(user.user_metadata?.username || user.email?.split("@")[0]);
      }
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUsername(
          session.user.user_metadata?.username ||
            session.user.email?.split("@")[0]
        );
      } else {
        setUsername("");
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const toggleMenu = (event?: MouseEvent<HTMLButtonElement>) => {
    if (event) event.preventDefault();
    setIsOpen((prev) => !prev);
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
          <div className="relative flex items-center justify-center bg-[#E8E8E8] rounded-full w-10 h-10 text-sm font-medium text-gray-700">
            {username ? (
              <span>{username.charAt(0).toUpperCase()}</span>
            ) : (
              <Image src="/Circle.svg" alt="user" width={40} height={40} />
            )}
          </div>
        </div>
      </div>

      {/* 🔹 Mobile dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 right-4 top-14 w-40 bg-white shadow-lg rounded-lg flex flex-col text-gray-700">
          {[
            { href: "/", label: "Home", rounded: "rounded-t-lg" },
            { href: "/explore", label: "Explore" },
            { href: "/about", label: "About Us" },
            { href: "/help", label: "Help", rounded: "rounded-b-lg" },
          ].map(({ href, label, rounded }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 hover:bg-gray-400 ${rounded || ""}`}
              onClick={() => setIsOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
