"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Camera, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";

export default function EditProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch current user and existing profile image
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) throw new Error("User not logged in");

        const user = data.user;
        setUserId(user.id);

        const { data: profileData } = await supabase
          .from("Info")
          .select("profile_image_url")
          .eq("user_id", user.id)
          .maybeSingle();

        setProfileImage(profileData?.profile_image_url || null);
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    })();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setSelectedImage(file);
      setProfileImage(URL.createObjectURL(file));
    } else {
      toast.error("File size must be under 5MB");
    }
  };

  const handleSave = async () => {
    if (!selectedImage || !userId) return toast.warning("Please select an image");
    setIsSaving(true);

    try {
      const fileExt = selectedImage.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(filePath, selectedImage, {
          upsert: true,
          contentType: selectedImage.type,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("profile-images")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      const { error: dbError } = await supabase
        .from("Info")
        .update({ profile_image_url: publicUrl })
        .eq("user_id", userId);

      if (dbError) throw dbError;

      setProfileImage(publicUrl);
      setSelectedImage(null);
      setIsModalOpen(false);
      toast.success("Profile image saved successfully!");
    } catch (err) {
      console.error("Error saving profile image:", err);
      toast.error("Failed to save image");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!userId) return;
    if (!confirm("Are you sure you want to delete your profile image?")) return;

    try {
      const { error } = await supabase
        .from("Info")
        .update({ profile_image_url: null })
        .eq("id", userId);

      if (error) throw error;

      setProfileImage(null);
      setSelectedImage(null);
      setIsModalOpen(false);
      toast.success("Profile image deleted successfully!");
    } catch (err) {
      console.error("Error deleting profile image:", err);
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Avatar display */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-white shadow-lg relative cursor-pointer"
      >
        {profileImage ? (
          <Image
            src={profileImage}
            alt="Profile"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
            <Camera className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
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
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="profile-upload"
                className="flex items-center gap-2 text-violet-700 cursor-pointer"
              >
                <ImageIcon className="w-5 h-5" />
                Upload new image
              </label>
              <span className="text-xs text-gray-500">Max 5MB • JPG, PNG</span>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 rounded-md bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save"}
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
