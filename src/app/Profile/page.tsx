"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ProfileHeader from "../components/ProfileHeader";


type Info = {
  id: string;
  brand: string;
  country: string;
  category: string;
  subcategory: string;
  tags: string;
  details: string;
  socials: string;
  user_id: string;
};

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [infoList, setInfoList] = useState<Info[]>([]);

  useEffect(() => {
    async function checkUser() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        toast.error("User not signed in");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("Info")
        .select("*")
        .eq("user_id", user.id);

      if (error) console.error(error);
      else {
        setInfoList(data || []);
        console.log("Fetched data:", data);
      }

      setLoading(false);
    }
    checkUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <ProfileHeader/>
      <div className="flex flex-col gap-4 p-4"> 
        {infoList.map((info) => (
          <div key={info.id} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="w-1/2 flex flex-col gap-4">
                <div className="text-xl font-bold">{info.brand}</div>
                <div className="text-sm">{info.country}</div>
                <div className="text-sm">{info.category}</div>
                <div className="text-sm">{info.subcategory}</div>
              </div>
              <div className="w-1/2 flex flex-col gap-4">
                <div className="text-xl font-bold">{info.tags}</div>
                <div className="text-sm">{info.details}</div>
                <div className="text-sm">{info.socials}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
