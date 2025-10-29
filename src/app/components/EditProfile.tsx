"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { Camera } from "lucide-react";
import { toast } from "react-toastify";


export default function EditProfile() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch current profile image
  useEffect(() => { 
    const fetchProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("profile_image_url")
        .eq("id", user.id)
        .maybeSingle();

      if (profileData?.profile_image_url) {
        setProfileImage(profileData.profile_image_url);
      }
    };

    fetchProfile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setSelectedFile(file);
      setProfileImage(URL.createObjectURL(file)); // preview
    } else {
      toast.error("File size must be under 5MB");
    }
  };

  const handleSaveProfileImage = async () => {
    if (!selectedFile) {
      toast.warning("Please select an image first");
      return;
    }

    setIsUploading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) throw new Error("User not logged in");

      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(filePath, selectedFile, {
          upsert: true,
          contentType: selectedFile.type,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("profile-images")
        .getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      const { error: dbError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          profile_image_url: publicUrl,
        });

      if (dbError) throw dbError;

      setProfileImage(publicUrl);
      setSelectedFile(null);
      setIsModalOpen(false);
      toast.success("Profile image updated successfully!");
    } catch (err) {
      console.error("Error uploading profile image:", err);
      toast.error("Failed to upload profile image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({ profile_image_url: null })
        .eq("id", user.id);

      if (error) throw error;

      setProfileImage(null);
      setSelectedFile(null);
      setIsModalOpen(false);
      toast.success("Profile image removed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove profile image");
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Profile image preview */}
      <div
        className="w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-white shadow-lg relative cursor-pointer"
        onClick={() => setIsModalOpen(true)}
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
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white w-[90%] md:w-[400px] rounded-2xl p-6 relative shadow-lg">
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
                <span className="text-gray-400">No Image</span>
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
                onClick={handleReset}
                className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Delete
              </button>
              <button
                onClick={handleSaveProfileImage}
                disabled={isUploading}
                className="px-4 py-2 rounded-md bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {isUploading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
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
