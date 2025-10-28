"use client";

import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import React, { useEffect, useReducer } from "react";
import { toast } from "react-toastify";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  description?: string;
  user_id?: string;
};

type State = {
  members: TeamMember[];
  loading: boolean;
  isOpen: boolean;
  editingMember: TeamMember | null;
  saving: boolean;
  deleting: boolean;
  name: string;
  role: string;
  description: string;
};

type Action =
  | { type: "SET_MEMBERS"; payload: TeamMember[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "OPEN_CREATE_MODAL" }
  | { type: "OPEN_EDIT_MODAL"; payload: TeamMember }
  | { type: "CLOSE_MODAL" }
  | { type: "SET_FIELD"; field: "name" | "role" | "description"; payload: string }
  | { type: "SET_SAVING"; payload: boolean }
  | { type: "SET_DELETING"; payload: boolean };

const initialState: State = {
  members: [],
  loading: true,
  isOpen: false,
  editingMember: null,
  saving: false,
  deleting: false,
  name: "",
  role: "",
  description: "",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_MEMBERS":
      return { ...state, members: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "OPEN_CREATE_MODAL":
      return { ...state, editingMember: null, name: "", role: "", description: "", isOpen: true };
    case "OPEN_EDIT_MODAL":
      return {
        ...state,
        editingMember: action.payload,
        name: action.payload.name,
        role: action.payload.role,
        description: action.payload.description || "",
        isOpen: true,
      };
    case "CLOSE_MODAL":
      return { ...state, isOpen: false };
    case "SET_FIELD":
      return { ...state, [action.field]: action.payload };
    case "SET_SAVING":
      return { ...state, saving: action.payload };
    case "SET_DELETING":
      return { ...state, deleting: action.payload };
    default:
      return state;
  }
}

export default function TeamManager() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchMembers();
  }, []);

  // 🔹 Fetch only current user’s team members
  async function fetchMembers() {
    dispatch({ type: "SET_LOADING", payload: true });

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      toast.error("User not authenticated");
      dispatch({ type: "SET_MEMBERS", payload: [] });
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }

    const { data, error } = await supabase
      .from("team")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      toast.error("Failed to fetch team members");
    } else {
      dispatch({ type: "SET_MEMBERS", payload: data || [] });
    }

    dispatch({ type: "SET_LOADING", payload: false });
  }

  // 🔹 Save (insert or update) team member
  async function saveMember() {
    if (!state.name.trim() || !state.role.trim()) {
      toast.error("Name and role are required");
      return;
    }

    dispatch({ type: "SET_SAVING", payload: true });

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      toast.error("Not authenticated");
      dispatch({ type: "SET_SAVING", payload: false });
      return;
    }

    try {
      if (state.editingMember) {
        // 🔹 Update existing member
        const { error } = await supabase
          .from("team")
          .update({
            name: state.name.trim(),
            role: state.role.trim(),
            description: state.description.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", state.editingMember.id)
          .eq("user_id", user.id);

        if (error) throw error;
        toast.success("Member updated");
      } else {
        // 🔹 Create new member (include user_id)
        const { error } = await supabase.from("team").insert([
          {
            name: state.name.trim(),
            role: state.role.trim(),
            description: state.description.trim(),
            user_id: user.id,
          },
        ]);

        if (error) throw error;
        toast.success("Member added");
      }

      await fetchMembers();
      dispatch({ type: "CLOSE_MODAL" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to save member");
    } finally {
      dispatch({ type: "SET_SAVING", payload: false });
    }
  }

  // 🔹 Delete member
  async function handleDelete() {
    if (!state.editingMember) return;
    if (!confirm("Delete this member? This cannot be undone.")) return;

    dispatch({ type: "SET_DELETING", payload: true });

    try {
      const { error } = await supabase.from("team").delete().eq("id", state.editingMember.id);
      if (error) throw error;

      toast.success("Member deleted");
      await fetchMembers();
      dispatch({ type: "CLOSE_MODAL" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete member");
    } finally {
      dispatch({ type: "SET_DELETING", payload: false });
    }
  }

  return (
    <div className="p-6 md:px-40 bg-white">
      <div className="flex items-center gap-2 py-6">
        <span className="h-3 w-3 rounded-full bg-violet-800" />
        <h2 className="text-xl font-semibold text-gray-800">Team Members</h2>
      </div>

      {state.loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {state.members.map((m) => (
            <div
              key={m.id}
              className="flex flex-col max-w-[250px] relative gap-3 items-center justify-center px-3 py-5 border border-gray-400 rounded-[5px] shadow-sm overflow-hidden"
            >
              <button
                onClick={() => dispatch({ type: "OPEN_EDIT_MODAL", payload: m })}
                className="absolute top-2 right-2 cursor-pointer hover:bg-gray-200 p-1 rounded-md"
              >
                <Image src="/edit.png" alt="edit" width={30} height={30} />
              </button>

              <Image src="/user.png" alt="avatar" width={100} height={100} className="mt-4" />
              <h1 className="text-2xl font-semibold mt-4 text-violet-800">{m.name}</h1>
              <div className="flex flex-col gap-3 justify-center items-center text-center">
                <p className="text-gray-700 bg-gray-300 px-2 py-1 opacity-40 rounded-full">{m.role}</p>
                <p className="text-gray-400 text-sm px-3 font-extralight">{m.description}</p>
              </div>
            </div>
          ))}

          {/* Add new member card */}
          <div className="border border-gray-400 flex items-center max-w-[250px] justify-center">
            <button
              onClick={() => dispatch({ type: "OPEN_CREATE_MODAL" })}
              className="flex flex-col items-center justify-center py-8 px-4 w-full h-40 cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="mb-2 text-gray-400 text-center">Add Member</div>
              <div className="bg-violet-800 text-white rounded-lg p-4 flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {state.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => dispatch({ type: "CLOSE_MODAL" })}
          />
          <div className="relative bg-white rounded-lg w-[min(90%,700px)] p-6 z-10 shadow-lg">
            <h3 className="text-lg font-medium mb-4">
              {state.editingMember ? "Edit Member" : "Add Member"}
            </h3>

            <div className="space-y-4">
              <label className="block">
                <div className="text-sm mb-1">Name *</div>
                <input
                  className="w-full border px-3 py-2 rounded"
                  value={state.name}
                  onChange={(e) =>
                    dispatch({ type: "SET_FIELD", field: "name", payload: e.target.value })
                  }
                />
              </label>

              <label className="block">
                <div className="text-sm mb-1">Role *</div>
                <input
                  className="w-full border px-3 py-2 rounded"
                  value={state.role}
                  onChange={(e) =>
                    dispatch({ type: "SET_FIELD", field: "role", payload: e.target.value })
                  }
                />
              </label>

              <label className="block">
                <div className="text-sm mb-1">Description</div>
                <textarea
                  className="w-full border px-3 py-2 rounded"
                  value={state.description}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "description",
                      payload: e.target.value,
                    })
                  }
                />
              </label>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={saveMember}
                  disabled={state.saving}
                  className="bg-violet-600 text-white px-4 py-2 rounded disabled:opacity-60"
                >
                  {state.saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => dispatch({ type: "CLOSE_MODAL" })}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
              </div>

              {state.editingMember && (
                <div>
                  <button
                    onClick={handleDelete}
                    disabled={state.deleting}
                    className="px-4 py-2 text-red-600 border border-red-600 rounded disabled:opacity-60"
                  >
                    {state.deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
