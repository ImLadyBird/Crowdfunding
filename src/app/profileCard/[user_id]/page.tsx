"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import PublicProfileLookcontributersTier from "@/app/components/PublicProfileLookcontributersTier";
import PublicProfileAbout from "@/app/components/PublicProfileAbout";
import PublicProfileTeam from "@/app/components/PublicProfileTeam";

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
    else {
      setInfos(data || []);
    }
    setLoading(false);
  }

  if (loading)
    return (
      <div className="w-full flex items-center justify-center pt-20 text-gray-400">
        <p className="min-h-screen">Loading...</p>;
      </div>
    );

  if (infos.length === 0)
    return <p className="p-8 text-gray-500">This user has no projects yet.</p>;

  const info = infos[0];

  return (
    <div className="min-h-screen bg-white pb-20 p-5 mx-auto">
      <div
        className="relative bg-linear-to-br height-[240px] from-slate-400 via-slate-500 to-slate-400 rounded-3xl"
        style={{
          height: "240px",
          backgroundImage: info.cover_image_url
            ? `url(${info.cover_image_url})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="absolute top-20 left-3 md:top-22 md:left-12 text-white text-3xl md:text-5xl font-medium">
          {info.brand}
        </h1>
        <div className="absolute bottom-4 right-6 md:bottom-6 md:right-8 text-white text-right">
          <div className="text-sm md:text-base opacity-90">
            <span className="font-bold">000$</span> Total contribution
          </div>
        </div>
      </div>
      <div className="w-[100px] h-[100px] bg-violet-900 rounded-2xl shadow-md mt-[-50px] left-10 mb-15 md:left-35 relative z-10">
        <h2 className="text-xl font-medium top-27 absolute text-gray-900">
          Wish Work
        </h2>
      </div>
      <PublicProfileLookcontributersTier user_id={user_id} />
      <PublicProfileAbout user_id={user_id} />
      <PublicProfileTeam user_id={user_id}/>
    </div>
  );
}
