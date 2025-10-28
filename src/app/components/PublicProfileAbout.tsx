"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function PublicProfileAbout({ user_id }: { user_id: string }) {
  const [abouts, setAbout] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user_id) fetchUserTiers();
  }, [user_id]);

  async function fetchUserTiers() {
    setLoading(true);
    const { data: aboutData, error } = await supabase
      .from("profileAbout")
      .select("about")
      .eq("user_id", user_id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching tiers:", error);
      setAbout("");
    } else {
      setAbout(aboutData?.about || "");
    }
    setLoading(false);
  }

  if (loading)
    return (
      <div className="w-full flex items-center justify-center pt-20 text-gray-400">
        <p className="min-h-screen">Loading...</p>;
      </div>
    );
  return (
    <div className="p-6 md:px-40 bg-white">
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-violet-800 mb-5 mt-10" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-5 mt-10">About</h2>
          </div>
        </div>

        {/* About content area */}
        <div className="rounded-lg bg-gray-100 p-9 md:min-w-[700px] mx-8">
          {loading ? (
            <p className="text-gray-500 text-sm">Loading…</p>
          ) : abouts ? (
            <p className="text-violet-800 whitespace-pre-wrap">{abouts}</p>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-md border border-gray-300 bg-white">
                <svg
                  className="h-12 w-12 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5h18M3 19h18M3 5l9 7 9-7"
                  />
                </svg>
              </div>
              <p>No about text added yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
