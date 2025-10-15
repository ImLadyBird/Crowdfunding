"use client";
import { useState, KeyboardEvent, ChangeEvent, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface TagInputProps {
  suggestions?: string[];
  placeholder?: string;
  label?: string;
  onChange?: (tags: string[]) => void;
}

export default function TagInput({
  suggestions = [],
  placeholder = "Type and press Enter",
  label,
  onChange,
}: TagInputProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      const newTags = [...tags, tag];
      setTags(newTags);
      onChange?.(newTags);
    }
  };

  const removeTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    onChange?.(newTags);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      addTag(inputValue.trim());
      setInputValue("");
      setShowDropdown(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.trim()) {
      const filtered = suggestions.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (!inputValue) setShowDropdown(false);
  }, [inputValue]);

  return (
    <div className="w-full ">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <div
          className="flex flex-wrap items-center gap-2 border border-[#644FC1] rounded-md px-2 py-2 cursor-text focus-within:ring-2"
          onClick={() => setShowDropdown(true)}
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-purple-100 text-[#644FC1] px-3 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                className="text-[#644FC1] hover:text-purple-700 cursor-pointer"
                onClick={() => removeTag(tag)}
              >
                ×
              </button>
            </span>
          ))}
          <input
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 border-none outline-none text-sm py-1 min-w-[100px]"
          />
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>

        {showDropdown && filteredSuggestions.length > 0 && (
          <div className="absolute left-0 right-0 bg-purple-50 border border-purple-200 rounded-md mt-1 shadow-lg max-h-48 overflow-y-auto z-10">
            {filteredSuggestions.map((s, idx) => (
              <div
                key={idx}
                className="px-3 py-2 hover:bg-purple-100 cursor-pointer text-sm text-gray-700"
                onClick={() => {
                  addTag(s);
                  setInputValue("");
                  setShowDropdown(false);
                }}
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
