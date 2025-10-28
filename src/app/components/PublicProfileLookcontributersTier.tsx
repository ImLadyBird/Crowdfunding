"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

type Tier = {
  id: string;
  name: string;
  reward_description?: string;
  amount?: number;
  user_id?: string;
};

export default function PublicProfileLookContributorsTier({
  user_id,
}: {
  user_id: string;
}) {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user_id) fetchUserTiers();
  }, [user_id]);

  async function fetchUserTiers() {
    setLoading(true);
    const { data, error } = await supabase
      .from("tiers")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching tiers:", error);
      setTiers([]);
    } else {
      setTiers(data || []);
    }
    setLoading(false);
  }

  if (loading) return <p className="text-center py-6">Loading tiers...</p>;
  if (!tiers.length)
    return (
      <div className="p-6 md:px-40 bg-white">
        <div className="flex items-center gap-2 py-6 mb-5">
          <span className="h-3 w-3 rounded-full bg-violet-800" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Contributor Tiers
          </h2>
        </div>
        <p className="text-center py-6 text-gray-500">No tiers found.</p>
      </div>
    );

  return (
    <div className="p-6 md:px-40 bg-white">
      <div className="flex items-center gap-2 py-6 mb-5">
        <span className="h-3 w-3 rounded-full bg-violet-800" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Contributor Tiers
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <div
            key={t.id}
            className="border border-gray-400 shadow-sm overflow-hidden items-center justify-center"
          >
            <div className="bg-violet-800 text-white px-2 py-2 text-center">
              {t.name}
            </div>
            <div className="p-4 min-h-[200px] flex flex-col justify-center items-center">
              <p className="text-gray-700 mb-4 text-center">
                {t.reward_description || "No description"}
              </p>
              <div className="flex flex-col items-center justify-center w-[150px] h-[100px] rounded-[5px] bg-violet-200">
                <p className="font-bold text-violet-700 opacity-40 text-center">
                  {t.name}
                </p>
              </div>
              <p className="text-sm text-gray-500 mb-6 mt-6">
                Start at ${t.amount ?? "—"}
              </p>
              <button className="bg-violet-800 w-full py-2 text-sm rounded-[5px] text-white cursor-pointer hover:bg-gray-500">
                Contribute
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
