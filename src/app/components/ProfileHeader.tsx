"use client";
import React, { useState } from "react";
import { Edit3, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

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
  cover_image_url?: string;
};

type ProfileHeaderProps = {
  infoList: Info[];
};

export default function ProfileHeader({ infoList }: ProfileHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(
    infoList[0]?.cover_image_url || null
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setSelectedImage(file);
      setCoverImage(URL.createObjectURL(file));
    } else {
      alert("File size must be under 5MB");
    }
  };

  const handleSave = async () => {
    if (!selectedImage) return;
    setIsSaving(true);

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not logged in");

      const fileExt = selectedImage.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("cover-images")
        .upload(filePath, selectedImage, {
          upsert: true,
          contentType: selectedImage.type,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("cover-images")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      const { error: dbError } = await supabase
        .from("Info")
        .update({ cover_image_url: publicUrl })
        .eq("user_id", user.id);

      if (dbError) throw dbError;

      setCoverImage(publicUrl);
      setSelectedImage(null);
      setIsModalOpen(false);
      alert("Cover image saved successfully!");
    } catch (err) {
      console.error("Error uploading/saving image:", err);
      alert("Failed to save cover image — see console.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setCoverImage(null);
    setSelectedImage(null);
  };

  return (
    <div className="bg-white">
      <div className="p-5 mx-auto">
        <div
          className="relative bg-gradient-to-br from-slate-400 via-slate-500 to-slate-400 rounded-3xl"
          style={{
            height: "240px",
            backgroundImage: coverImage ? `url(${coverImage})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h1 className="absolute top-20 left-3 md:top-12 md:left-12 text-white text-3xl md:text-5xl font-bold">
            {infoList[0]?.brand}
          </h1>

          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 bg-violet-200 px-4 py-2 rounded-[7px] border border-violet-900 transition-colors shadow-sm hover:bg-violet-300"
          >
            <Edit3 className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-medium text-violet-900">
              Edit cover
            </span>
          </button>

          <div className="absolute bottom-4 right-6 md:bottom-6 md:right-8 text-white text-right">
            <div className="text-sm md:text-base opacity-90">
              <span className="font-bold">000$</span> Total contribution
            </div>
          </div>
        </div>

        <div className="px-4 md:px-8 pb-8">
          <div className="mt-4">
            <h2 className="text-3xl font-bold text-gray-900">Wish Work</h2>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white w-[90%] md:w-[600px] rounded-2xl p-6 relative shadow-lg">
            <h2 className="text-center text-lg font-semibold mb-4">
              Add cover image
            </h2>

            <div className="border border-gray-300 rounded-xl flex items-center justify-center h-40 bg-gray-100 text-gray-400 mb-4">
              {coverImage ? (
                <Image
                  src={coverImage}
                  alt="Preview"
                  width={600}
                  height={600}
                  className="h-full w-full object-cover rounded-xl"
                />
              ) : (
                <span className="text-lg font-medium">
                  Brand or Organisation
                </span>
              )}
            </div>

            <div className="flex items-center justify-between mb-4">
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                id="upload"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="upload"
                className="flex items-center gap-2 text-violet-700 cursor-pointer"
              >
                <ImageIcon className="w-5 h-5" />
                Upload new image
              </label>
              <span className="text-xs text-gray-500">Max 5MB • JPG, PNG</span>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Reset
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
