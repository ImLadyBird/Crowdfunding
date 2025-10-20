"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ProfileHeader from "../components/ProfileHeader";
import ProfileGuideBar from "../components/ProfileGuideBar";
import ProfileContributorTier from "../components/ProfileContributorTier";

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
    console.log("infoList updated:", infoList);
  }, [infoList]);

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
      <ProfileHeader infoList={infoList} />
      <ProfileGuideBar/>
      <ProfileContributorTier/>
    </div>
  );
}
