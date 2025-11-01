"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import EditProfile from "../components/EditProfile";

type Info = {
  id: string;
  brand: string;
  country: string;
  category: string;
  subcategory: string;
  tags: string;
  details: string;
  socials: string;
  cover_image_url?: string;
  profile_image_url?: string;
  user_id: string;
  created_at?: string;
};

const categories: Record<string, string[]> = {
  "Technology & Innovation": [
    "Software & Apps",
    "Consumer Electronics",
    "Green Tech & Sustainability",
    "Blockchain & Cryptocurrency",
    "Biotech & Health Tech",
    "Others",
  ],
  "Creative Art & Media": [
    "Film & Video",
    "Photography",
    "Music",
    "Design",
    "Publishing",
  ],
  "Business & Entrepreneurship": [
    "Startups",
    "E-commerce",
    "Services",
    "Finance",
  ],
  "Games & Entertainment": ["Video Games", "Board Games", "Esports"],
  "Social Causes & Community": [
    "Education",
    "Environment",
    "Health",
    "Charity",
  ],
};

export default function ExplorePage() {
  const [infos, setInfos] = useState<Info[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("Newest");

  useEffect(() => {
    fetchInfos();
  }, []);

  async function fetchInfos() {
    setLoading(true);
    const { data, error } = await supabase
      .from("Info")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching Info:", error);
    } else {
      setInfos(data || []);
    }
    setLoading(false);
  }

  const filteredInfos = infos
    .filter((info) => {
      const matchesSearch =
        info.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        info.details.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory
        ? info.category === selectedCategory
        : true;

      const matchesSubcategory = selectedSubcategory
        ? info.subcategory === selectedSubcategory
        : true;

      const matchesCountry = selectedCountry
        ? info.country === selectedCountry
        : true;

      return (
        matchesSearch && matchesCategory && matchesSubcategory && matchesCountry
      );
    })
    .sort((a, b) => {
      if (sortBy === "Newest") {
        return (
          new Date(b.created_at ?? "").getTime() -
          new Date(a.created_at ?? "").getTime()
        );
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 shadow-xl">
      {/* ---- Header Search ---- */}
      <div className="bg-gradient-to-r from-violet-900 to-blue-600 relative pt-12 pb-12 md:pt-16 md:pb-16 rounded-t-3xl mx-4">
        <div className="relative max-w-2xl mx-auto px-6">
          <div className="flex items-center bg-white rounded-2xl w-full">
            <div className="p-4 text-gray-400">
              <Image src="/search.svg" alt="search" width={20} height={20} />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow p-4 text-lg border-none focus:ring-0 outline-none rounded-l-full"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="p-4 text-gray-500 hover:text-gray-700 transition"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ---- Filters Section ---- */}
      <div className="bg-white rounded-b-3xl shadow-sm p-10 mx-4">
        <h2 className="text-3xl text-center text-violet-900 pb-10">
          Categories & Subcategories
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {/* ---- Category Dropdown ---- */}
          <select
            value={selectedCategory ?? ""}
            onChange={(e) => {
              const cat = e.target.value || null;
              setSelectedCategory(cat);
              setSelectedSubcategory(null); // reset subcategory
            }}
            className="rounded-[8px] border-2 border-violet-800 bg-gray-200 px-4 py-3 text-violet-900 shadow-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 appearance-none text-center"
          >
            <option value="">Select Category</option>
            {Object.keys(categories).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* ---- Subcategory Dropdown ---- */}
          <select
            value={selectedSubcategory ?? ""}
            onChange={(e) => setSelectedSubcategory(e.target.value || null)}
            hidden={!selectedCategory}
            className="rounded-[8px] border-2 border-violet-800 bg-gray-200 px-4 py-3 text-violet-900 shadow-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 disabled:opacity-50 appearance-none text-center"
          >
            <option value="">Select Subcategory</option>
            {selectedCategory &&
              categories[selectedCategory].map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
          </select>

          {/* ---- Country Dropdown ---- */}
          <select
            value={selectedCountry ?? ""}
            onChange={(e) => setSelectedCountry(e.target.value || null)}
            className="rounded-[8px] border-2 border-violet-800 bg-gray-200 px-4 py-3 text-violet-900 shadow-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 appearance-none text-center"
          >
            <option value="">Select Country</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="Germany">Germany</option>
            <option value="Japan">Japan</option>
            <option value="India">India</option>
          </select>
        </div>
      </div>

      {/* ---- Project Cards Grid ---- */}
      <div className="mx-auto p-6 md:p-20 max-w-6xl">
        {loading ? (
          <div className="w-full flex items-center justify-center pt-20 text-gray-400">
            <p className="min-h-screen">Loading...</p>
          </div>
        ) : filteredInfos.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No projects found.</p>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredInfos.map((info) => (
              <Link
                key={info.id}
                href={`/profileCard/${info.user_id}`}
                className="group rounded-2xl bg-white shadow-sm border border-gray-200 hover:shadow-lg transition overflow-hidden"
              >
                <div className="h-40 bg-gray-200 relative mb-6">
                  {info.cover_image_url ? (
                    <Image
                      src={info.cover_image_url}
                      alt={info.brand}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                  <div className="absolute bottom-[-40px] left-5 rounded-full w-[100px] h-[100px]  p-1">
                    {info.profile_image_url ? (
                    <Image
                      src={info.profile_image_url}
                      alt='profile'
                      fill
                      className="object-cover rounded-full shadow-md " 
                    />
                  ) : (
                    <div className="absolute bottom-[-1px] bg-white left-1 shadow-md  text-center items-center flex justify-center rounded-full w-[100px] h-[100px]  p-1">
                      <Image src="/user.png" alt="user" width={70} height={70} />
                    </div>
                  )}
                  </div>
                </div>
                <div className="p-5 pt-8">
                  <h2 className="text-xl font-semibold text-gray-900 group-hover:text-violet-700">
                    {info.brand}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-3">
                    {info.details || "No description provided."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="text-center pb-10">
        <Link href="/WizardForm" className="text-violet-700 underline">
          Add new one
        </Link>
      </div>
    </div>
  );
}
