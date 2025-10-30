"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { Camera } from "lucide-react";
import { toast } from "react-toastify";


async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) throw new Error("User not logged in");
  return data.user;
}

async function getProfileImage(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("profile_image_url")
    .eq("id", userId)
    .maybeSingle();
  return data?.profile_image_url ?? null;
}

async function uploadProfileImage(userId: string, file: File) {
  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("profile-images")
    .upload(filePath, file, { upsert: true, contentType: file.type });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("profile-images").getPublicUrl(filePath);
  const publicUrl = data.publicUrl;

  const { error: dbError } = await supabase
    .from("profiles")
    .upsert({ id: userId, profile_image_url: publicUrl });
  if (dbError) throw dbError;

  return publicUrl;
}

async function removeProfileImage(userId: string) {
  const { error } = await supabase
    .from("profiles")
    .update({ profile_image_url: null })
    .eq("id", userId);
  if (error) throw error;
}


export default function EditProfile() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUser();
        setUserId(user.id);
        const url = await getProfileImage(user.id);
        setProfileImage(url);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.size > 5 * 1024 * 1024) return toast.error("Max 5MB file size");
    setFile(selected);
    setProfileImage(URL.createObjectURL(selected));
  };

  const handleSave = async () => {
    if (!file || !userId) return toast.warning("Please select an image");
    setIsUploading(true);
    try {
      const url = await uploadProfileImage(userId, file);
      setProfileImage(url);
      setFile(null);
      toast.success("Profile updated");
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!userId) return;
    try {
      await removeProfileImage(userId);
      setProfileImage(null);
      setFile(null);
      toast.success("Profile image removed");
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove");
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <div
        onClick={() => setIsOpen(true)}
        className="w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-white shadow-lg relative cursor-pointer"
      >
        {profileImage ? (
          <Image src={profileImage} alt="Profile" fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
            <Camera className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white w-[90%] md:w-[400px] rounded-2xl p-6 shadow-lg">
            <h2 className="text-center text-lg font-semibold mb-4">
              Edit Profile Image
            </h2>

            <div className="border border-gray-300 rounded-full flex items-center justify-center h-40 w-40 bg-gray-100 text-gray-400 mx-auto mb-4">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt="Preview"
                  width={160}
                  height={160}
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <span>No Image</span>
              )}
            </div>

            <div className="flex items-center justify-between mb-4">
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                id="profile-upload"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="profile-upload"
                className="flex items-center gap-2 text-violet-700 cursor-pointer"
              >
                <Camera className="w-5 h-5" />
                Upload new image
              </label>
              <span className="text-xs text-gray-500">Max 5MB • JPG, PNG</span>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Delete
              </button>
              <button
                onClick={handleSave}
                disabled={isUploading}
                className="px-4 py-2 rounded-md bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {isUploading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
