import { supabase } from "@/lib/supabaseClient";
import { AppWindow } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function ProfileOtherProjectsSection({
  user_id,
}: {
  user_id: string;
}) {
  const [loading, setLoading] = useState(true);
  const [infos, setInfos] = useState<Info[]>([]);

  useEffect(() => {
    if (user_id) fetchUserProjects();
  }, [user_id]);

  async function fetchUserProjects() {
    setLoading(true);
    const { data: projectData, error } = await supabase
      .from("Info")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching team:", error);
      setInfos([]);
    } else {
      setInfos(projectData || []);
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
    
    <div className="mx-auto p-6 md:p-20 max-w-6xl mt-[-80px]">
        <div className="flex items-center gap-2 py-6">
        <span className="h-3 w-3 rounded-full bg-violet-800 mb-5" />
        <h2 className="text-2xl font-medium text-gray-800 mb-5">Other Projects</h2>
      </div>
      {loading ? (
        <div className="w-full flex items-center justify-center pt-20 text-gray-400">
          <p className="min-h-screen">Loading...</p>
        </div>
      ) : infos.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No projects found.</p>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
          {infos.map((info) => (
            <Link
              key={info.id}
              href={{
                pathname: `/profileCard/${info.user_id}`,
                query: { id: info.id },
              }}
              className="group rounded-2xl bg-white shadow-sm border border-gray-200 hover:shadow-lg transition overflow-hidden"
            >
              <div className="h-40 bg-gray-200 relative mb-6">
                {info.cover_image_url ? (
                  <Image
                    src={info.cover_image_url}
                    alt={info.brand}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
                <div className="absolute bottom-[-40px] left-5 rounded-full w-[100px] h-[100px]  p-1">
                  {info.profile_image_url ? (
                    <Image
                      src={info.profile_image_url}
                      alt="profile"
                      fill
                      className="object-cover rounded-full shadow-md "
                    />
                  ) : (
                    <div className="absolute bottom-[-1px] bg-white left-1 shadow-md  text-center items-center flex justify-center rounded-full w-[100px] h-[100px]  p-1">
                      <Image
                        src="/user.png"
                        alt="user"
                        width={70}
                        height={70}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="p-5 pt-8 ">
                <h2 className="text-xl  right-1.5 font-semibold text-gray-900 group-hover:text-violet-700">
                  {info.brand}
                </h2>
                <p className="text-sm text-gray-400 mt-1 line-clamp-3">
                  {info.details || "No description provided."}
                </p>
                <div className="flex flex-row gap-2 mt-6 items-center">
                  <AppWindow width={20} height={20} />
                  <p className="font-light text-[14px]"> {info.category}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
