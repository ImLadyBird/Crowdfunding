"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, MouseEvent } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = (event?: MouseEvent<HTMLButtonElement>) => {
    if (event) event.preventDefault();
    setIsOpen((prev) => !prev);
  };

  return (
    <header>
      <div className="flex flex-row justify-between items-center p-4 md:px-10 md:shadow-sm">
        <Image src="/logo.png" alt="logo" width={50} height={68} />

        <div className="flex flex-row gap-4 lg:hidden md:hidden">
          <button aria-label="Search">
            <Image src="/search-p.svg" alt="search" width={20} height={20} />
          </button>
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="cursor-pointer"
          >
            <Image src="/ham.svg" alt="ham" width={24} height={16} />
          </button>
        </div>

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

        <div className="hidden md:flex flex-row items-center gap-2 max-h-9">
          <div className="flex flex-row gap-2 items-center border border-gray-400 rounded-[10px] px-2 py-1 shadow-sm">
            <Image src="/search.svg" alt="search" width={15} height={20} />
            <input
              type="text"
              className="font-[12px] focus:outline-none"
              placeholder="Search..."
            />
          </div>
          <div>
            <Image src="/Circle.svg" alt="user" width={40} height={40} />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute right-4 top-14 w-40 bg-white shadow-lg rounded-lg flex flex-col text-gray-700">
          {[
            { href: "/", label: "Home", rounded: "rounded-t-lg" },
            { href: "/explore", label: "Explore" },
            { href: "/about", label: "About Us" },
            { href: "/help", label: "Help", rounded: "rounded-b-lg" },
          ].map(({ href, label, rounded }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 hover:bg-gray-400  ${rounded || ""}`}
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
