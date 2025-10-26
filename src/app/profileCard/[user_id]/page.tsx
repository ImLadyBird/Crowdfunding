"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

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
  user_id: string;
};

export default function ProfilePage() {
  const params = useParams();
  const user_id = params?.user_id as string;

  const [infos, setInfos] = useState<Info[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user_id) fetchUserProjects();
  }, [user_id]);

  async function fetchUserProjects() {
    setLoading(true);
    const { data, error } = await supabase
      .from("Info")
      .select("*")
      .eq("user_id", user_id);

    if (error) console.error("Error fetching user's projects:", error);
    else setInfos(data || []);
    setLoading(false);
  }

  if (loading) return <p className="p-8 text-gray-500">Loading...</p>;

  if (infos.length === 0)
    return <p className="p-8 text-gray-500">This user has no projects yet.</p>;

  const info = infos[0]; // assuming one project per user

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Cover Image */}
      <div className="relative h-64 bg-gray-300">
        {info.cover_image_url ? (
          <Image
            src={info.cover_image_url}
            alt={info.brand}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No cover image
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-[-50px] relative z-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{info.brand}</h1>
        <p className="text-gray-600 mb-4">
          {info.category} • {info.country}
        </p>

        <p className="text-gray-700 mb-6">{info.details}</p>

        <div className="flex flex-wrap gap-2">
          {info.tags?.split(",").map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-violet-100 text-violet-700 text-sm rounded-full"
            >
              {tag.trim()}
            </span>
          ))}
        </div>

        {info.socials && (
          <a
            href={info.socials}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-violet-700 font-medium hover:underline"
          >
            Visit Socials
          </a>
        )}
      </div>
    </div>
  );
}
