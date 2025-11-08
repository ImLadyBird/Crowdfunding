"use client";

import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { useEffect, useState } from "react";

type Team = {
  id: string;
  name: string;
  role?: string;
  description?: string;
  user_id?: string;
};

export default function PublicProfileTeam({ user_id }: { user_id: string }) {
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<Team[]>([]);

  useEffect(() => {
    if (user_id) fetchUserTeam();
  }, [user_id]);

  async function fetchUserTeam() {
    setLoading(true);
    const { data: teamData, error } = await supabase
      .from("team")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching team:", error);
      setTeam([]);
    } else {
      console.log("Fetched team:", teamData);
      setTeam(teamData || []);
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
    <div className="p-6 md:px-40 bg-white ">
      <div className="flex items-center gap-2 py-6">
        <span className="h-3 w-3 rounded-full bg-violet-800 mb-5" />
        <h2 className="text-2xl font-medium text-gray-800 mb-5">Team Members</h2>
      </div>
       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 justify-center place-items-center ">
        {team.length === 0 ? (
          <p className="text-gray-500 col-span-3 text-center py-6">
            No team members found.
          </p>
        ) : (
          team.map((m) => (
            <div
              key={m.id}
              className="flex flex-col w-[250px]  relative gap-3 items-center justify-center px-3 py-5 border border-gray-400 rounded-[5px] shadow-sm overflow-hidden"
            >
              <Image
                src="/user.png"
                alt="avatar"
                width={100}
                height={100}
                className="mt-4"
              />
              <h1 className="text-2xl font-semibold mt-4 text-violet-800">
                {m.name}
              </h1>
              <div className="flex flex-col gap-3 justify-center items-center text-center">
                <p className="text-gray-700 bg-gray-300 px-2 py-1 opacity-40 rounded-full">
                  {m.role || "Member"}
                </p>
                <p className="text-gray-400 text-sm px-3 font-extralight">
                  {m.description || "No description available."}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
