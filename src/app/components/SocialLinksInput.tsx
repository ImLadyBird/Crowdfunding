"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

type SocialOption = {
  label: string;
};

const SOCIAL_OPTIONS: SocialOption[] = [
  { label: "Website" },
  { label: "YouTube" },
  { label: "Instagram" },
  { label: "Twitter" },
  { label: "Discord" },
  { label: "WhatsApp" },
  { label: "Telegram" },
  { label: "Facebook" },
  { label: "Linkedin" },
];

interface SocialLink {
  platform: string;
  url: string;
}

interface SocialLinksInputProps {
  value?: SocialLink[];
  onChange?: (links: SocialLink[]) => void;
}

export default function SocialLinksInput({
  value = [],
  onChange,
}: SocialLinksInputProps) {
  const [links, setLinks] = useState<SocialLink[]>(value);

  useEffect(() => {
    onChange?.(links);
  }, [links]);

  const handleAddLink = () => {
    setLinks([...links, { platform: "", url: "" }]);
  };

  const handleRemoveLink = (index: number) => {
    const updated = links.filter((_, i) => i !== index);
    setLinks(updated);
  };

  const handleChange = (
    index: number,
    field: keyof SocialLink,
    value: string
  ) => {
    const updated = [...links];
    updated[index][field] = value;
    setLinks(updated);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg">
      {links.map((link, index) => (
        <div key={index} className="flex gap-2 items-center">
          <select
            value={link.platform}
            onChange={(e) => handleChange(index, "platform", e.target.value)}
            className="w-1/3 border border-[#644FC1] rounded-md px-3 py-2 text-sm focus:ring-2 outline-none"
          >
            <option value="">Select platform</option>
            {SOCIAL_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.label}>
                {opt.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="https://"
            value={link.url}
            onChange={(e) => handleChange(index, "url", e.target.value)}
            className="flex-1 border border-[#644FC1] rounded-md px-3 py-2 text-sm focus:ring-2 outline-none"
          />

          <button
            type="button"
            onClick={() => handleRemoveLink(index)}
            className="text-gray-400 hover:text-red-500 transition"
          >
            <X size={18} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddLink}
        className="flex items-center gap-2 text-sm border border-gray-300 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-50 transition w-fit"
      >
        <Plus size={16} /> Add social link
      </button>
    </div>
  );
}
