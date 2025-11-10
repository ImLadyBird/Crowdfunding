"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import ProfileContributorTier from "../components/ProfileContributorTier";
import ProfileAboutSection from "../components/ProfileAboutSection";
import ProfileUpdateSection from "../components/ProfileUpdateSection";
import TeamManager from "../components/ProfileTeamSection";
import { useRouter } from "next/navigation";
import Step1 from "../components/Steps/Step1";


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
  const [active, setActive] = useState("Contribution tiers");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

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
    <div className="flex flex-col md:flex-row p-4 bg-gray-50 min-h-screen relative">
      {/* Mobile header */}
      <div className="md:hidden flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm mb-4">
        <h2
          className="text-violet-800 font-bold text-lg cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          FUND FOR FOUND
        </h2>

        {/* Hamburger icon */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-violet-800 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`md:static absolute top-0 left-0 h-full md:h-auto bg-white rounded-2xl p-6 shadow-sm transform transition-transform duration-300 ease-in-out
        ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        md:min-w-64 z-20 md:z-auto`}
      >
        <h2
          className="text-violet-800 font-bold text-lg mb-6 hidden md:block cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          FUND FOR FOUND
        </h2>

        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => {
                if (section === "Public profile") {
                  router.push("/Profile");
                } else if (section === "Info") {
                  router.push("/WizardForm");
                }
                 else {
                  setActive(section);
                }
                setMenuOpen(false); // close menu on selection
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

      {/* Overlay for mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden z-10"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <main className="flex-1 p-4 md:p-8">{renderContent()}</main>
    </div>
  );
}
