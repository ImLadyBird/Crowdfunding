"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import ProfileContributorTier from "../components/ProfileContributorTier";
import ProfileAboutSection from "../components/ProfileAboutSection";
import ProfileUpdateSection from "../components/ProfileUpdateSection";
import TeamManager from "../components/ProfileTeamSection";
import { useRouter } from "next/navigation";

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

const sections = [
  "Public profile",
  "Info",
  "Contribution tiers",
  "About",
  "Team",
  "Updates",
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [infos, setInfos] = useState<Info[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const [active, setActive] = useState("Contribution tiers");

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        console.error("User not found:", error);
        setLoading(false);
        return;
      }

      const user = data.user;
      setUserId(user.id);
      fetchUserProjects(user.id);
    };
    getUser();
  }, []);
  async function fetchUserProjects(user_id: string) {
    setLoading(true);

    const { data, error } = await supabase
      .from("Info")
      .select("*")
      .eq("user_id", user_id);

    if (error) {
      console.error("Error fetching user's projects:", error);
    } else {
      setInfos(data || []);
    }
    setLoading(false);
  }

  const renderContent = () => {
    switch (active) {
      case "Contribution tiers":
        return <ProfileContributorTier />;
      case "About":
        return <ProfileAboutSection />;
      case "Team":
        return <TeamManager />;
      case "Updates":
        return <ProfileUpdateSection />;
      default:
        return null;
    }
  };

  if (loading)
    return (
      <div className="w-full flex items-center justify-center pt-20 text-gray-400">
        <p className="min-h-screen">Loading...</p>
      </div>
    );

  if (!userId)
    return (
      <div className="p-5 text-red-600">
        You must be logged in to view your dashboard.
      </div>
    );

  return (
    <div className="flex p-4 bg-gray-50">

      <aside className="min-w-64 bg-white rounded-2xl p-6 shadow-sm ">
        <h2 className="text-violet-800 font-bold text-lg mb-6">
          FUND FOR FOUND
        </h2>
        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => {
                if (section === "Public profile") {
                  router.push("/Profile");
                } else {
                  setActive(section);
                }
              }}
              className={`block w-full text-left px-3 py-2 rounded-md transition ${
                active === section
                  ? "bg-violet-100 text-violet-700 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {section}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">{renderContent()}</main>
    </div>
  );
}
