"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import PublicProfileLookcontributersTier from "@/app/components/PublicProfileLookcontributersTier";
import PublicProfileAbout from "@/app/components/PublicProfileAbout";
import PublicProfileTeam from "@/app/components/PublicProfileTeam";
import ProfileTopSection from "@/app/components/ProfileTopSection";
import PublicProfileFAQ from "@/app/components/PublicProfileFAQ";
import ProfileUpdateSection from "@/app/components/ProfileUpdateSection";
import Image from "next/image";
import ProfileGuideBar from "@/app/components/ProfileGuideBar";

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
        <p className="min-h-screen">Loading...</p>
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
      <div className="w-[120px] h-[120px]  mt-[-60px] left-10 mb-15 md:left-35 relative z-10">
        {info.profile_image_url ? (
          <Image
            src={info.profile_image_url}
            alt="Profile"
            fill
            className="object-cover rounded-full shadow-md"
          />
        ) : (
          <div className="absolute shadow-md bg-white left-1 text-center items-center flex justify-center border- rounded-full w-[120px] h-[120px]  p-1">
            <Image src="/user.png" alt="user" width={80} height={80} />
          </div>
        )}
        <h2 className="text-xl font-medium top-33 left-4.5 absolute text-gray-900 ">
          {info.brand}
        </h2>
      </div>

      <ProfileGuideBar />
      <div id="contribution">
        <PublicProfileLookcontributersTier user_id={user_id} />
      </div>
      <div id="about">
        <PublicProfileAbout user_id={user_id} />
      </div>
      <div id="team">
        <PublicProfileTeam user_id={user_id} />
      </div>
      <div id="tops">
        <ProfileTopSection />
      </div>
      <div id="faq">
        <PublicProfileFAQ user_id={user_id} />
      </div>
      <div id="updates">
        <ProfileUpdateSection />
      </div>
    </div>
  );
}
