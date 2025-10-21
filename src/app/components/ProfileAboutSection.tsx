"use client";

import { supabase } from "@/lib/supabaseClient";
import React, { useEffect, useState } from "react";

export default function ProfileAboutSection() {
  const [about, setAbout] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load current user's "about" section
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setErrorMsg(null);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setAbout(null);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("profileAbout")
          .select("about")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          setErrorMsg(error.message);
          console.error(error);
        } else {
          if (data && mounted) setAbout(data.about ?? null);
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("Failed to load profile.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  async function openEditor() {
    setErrorMsg(null);
    setEditingValue(about ?? "");
    setIsOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setErrorMsg(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setErrorMsg("You must be signed in to update your about.");
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from("profileAbout")
        .upsert(
          { user_id: user.id, about: editingValue },
          { onConflict: "user_id" }
        );

      if (error) {
        console.error(error);
        setErrorMsg(error.message);
      } else {
        setAbout(editingValue);
        setIsOpen(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 md:px-40 bg-white">
      <section className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-violet-800" />
            <h2 className="text-xl font-semibold text-gray-800">About</h2>
          </div>

          <button
            onClick={openEditor}
            className="flex items-center gap-1 rounded-md border border-violet-800 px-4 py-2 cursor-pointer text-sm text-violet-800 bg-violet-200 hover:bg-purple-50"
          >
            Edit
          </button>
        </div>

        {/* About content area */}
        <div className="rounded-lg bg-gray-100 p-9 md:min-w-[700px] mx-8">
          {loading ? (
            <p className="text-gray-500 text-sm">Loading…</p>
          ) : about ? (
            <p className="text-violet-800 whitespace-pre-wrap">{about}</p>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-md border border-gray-300 bg-white">
                <svg
                  className="h-12 w-12 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5h18M3 19h18M3 5l9 7 9-7"
                  />
                </svg>
              </div>
              <p>No about text added yet.</p>
            </div>
          )}
        </div>

        {/* Example guidance sections */}
        {!about && (
          <div className="space-y-6 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-700">Summary</h3>
              <p className="mt-1">
                Introduce yourself, your team (if you have one), and your
                background. Briefly describe the long-term and short-term goals
                of your brand and why they’re important.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700">The Impact</h3>
              <ul className="mt-1 list-disc pl-5 space-y-1">
                <li>
                  Share more about your brand and highlight how contributions
                  make a meaningful impact.
                </li>
                <li>
                  Explain why your brand matters to contributors and how it
                  positively influences the world.
                </li>
                <li>Showcase proven success or achievements, if applicable.</li>
                <li>
                  Help people connect with your mission and build trust through
                  authentic stories.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700">The Story</h3>
              <ul className="mt-1 list-disc pl-5">
                <li>
                  Share the vision of your organization and the journey that led
                  to its creation.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Modal */}
        {isOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          >
            <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
              <h4 className="text-lg font-semibold text-gray-800">
                Edit About
              </h4>

              <textarea
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                placeholder="Tell others about yourself..."
                rows={6}
                className="mt-3 w-full rounded-md border border-gray-300 p-3 text-sm focus:border-purple-500 focus:ring-purple-500"
              />

              {errorMsg && (
                <p className="mt-2 text-sm text-red-600">{errorMsg}</p>
              )}

              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-md px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="rounded-md bg-purple-600 px-4 py-1 text-sm text-white hover:bg-purple-700 disabled:opacity-60"
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
