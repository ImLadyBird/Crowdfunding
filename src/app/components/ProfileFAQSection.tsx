"use client";

import React, { useEffect, useReducer } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";
import Image from "next/image";

type FAQ = {
  id: number;
  question: string;
  answer: string;
  user_id: string;
  created_at?: string;
};

type State = {
  faqs: FAQ[];
  loading: boolean;
  isOpen: boolean;
  editingFAQ: FAQ | null;
  saving: boolean;
  deleting: boolean;
  question: string;
  answer: string;
};

type Action =
  | { type: "SET_FAQS"; payload: FAQ[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "OPEN_CREATE_MODAL" }
  | { type: "OPEN_EDIT_MODAL"; payload: FAQ }
  | { type: "CLOSE_MODAL" }
  | { type: "SET_FIELD"; field: "question" | "answer"; payload: string }
  | { type: "SET_SAVING"; payload: boolean }
  | { type: "SET_DELETING"; payload: boolean };

const initialState: State = {
  faqs: [],
  loading: true,
  isOpen: false,
  editingFAQ: null,
  saving: false,
  deleting: false,
  question: "",
  answer: "",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FAQS":
      return { ...state, faqs: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "OPEN_CREATE_MODAL":
      return { ...state, isOpen: true, editingFAQ: null, question: "", answer: "" };
    case "OPEN_EDIT_MODAL":
      return {
        ...state,
        isOpen: true,
        editingFAQ: action.payload,
        question: action.payload.question,
        answer: action.payload.answer,
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

export default function ProfileFAQSection() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchFAQs();
  }, []);

  async function fetchFAQs() {
    dispatch({ type: "SET_LOADING", payload: true });

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      dispatch({ type: "SET_FAQS", payload: [] });
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }

    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      toast.error("Failed to fetch FAQs");
    } else {
      dispatch({ type: "SET_FAQS", payload: data || [] });
    }

    dispatch({ type: "SET_LOADING", payload: false });
  }

  async function saveFAQ() {
    if (!state.question.trim()) {
      toast.error("Question is required");
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
      if (state.editingFAQ) {
        const { error } = await supabase
          .from("faqs")
          .update({
            question: state.question.trim(),
            answer: state.answer.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", state.editingFAQ.id);

        if (error) throw error;
        toast.success("FAQ updated");
      } else {
        const { error } = await supabase.from("faqs").insert([
          {
            question: state.question.trim(),
            answer: state.answer.trim(),
            user_id: user.id,
          },
        ]);

        if (error) throw error;
        toast.success("FAQ created");
      }

      await fetchFAQs();
      dispatch({ type: "CLOSE_MODAL" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to save FAQ");
    } finally {
      dispatch({ type: "SET_SAVING", payload: false });
    }
  }

  async function handleDelete() {
    if (!state.editingFAQ) return;
    if (!confirm("Delete this question? This cannot be undone.")) return;

    dispatch({ type: "SET_DELETING", payload: true });

    try {
      const { error } = await supabase
        .from("faqs")
        .delete()
        .eq("id", state.editingFAQ.id);
      if (error) throw error;
      toast.success("FAQ deleted");
      await fetchFAQs();
      dispatch({ type: "CLOSE_MODAL" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete FAQ");
    } finally {
      dispatch({ type: "SET_DELETING", payload: false });
    }
  }

  return (
    <div className="p-6 md:px-40 bg-white">
      <div className="flex items-center gap-2 py-6">
        <span className="h-3 w-3 rounded-full bg-violet-800" />
        <h2 className="text-xl font-semibold text-gray-800">FAQ</h2>
      </div>

      {state.loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-3">
          {state.faqs.map((faq) => (
            <div key={faq.id} className="flex items-center gap-2">
              <details className="w-full border border-violet-300 rounded-md px-4 py-2 text-gray-800 open:border-violet-500 open:bg-violet-50">
                <summary className="cursor-pointer flex justify-between items-center">
                  <span>{faq.question}</span>
                </summary>
                <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
              </details>
              <button
                onClick={() => dispatch({ type: "OPEN_EDIT_MODAL", payload: faq })}
                className="p-2 rounded-2xl hover:bg-violet-50 cursor-pointer"
              >
                <Image src="/edit.png" alt="edit" width={40} height={30} />
              </button>
            </div>
          ))}

          <div className="flex justify-center pt-6 my-5">
            <button
              onClick={() => dispatch({ type: "OPEN_CREATE_MODAL" })}
              className="border text-sm border-gray-500 text-gray-500 px-4 py-2 rounded-md bg-gray-200 cursor-pointer hover:bg-white flex items-center gap-2"
            >
              <span>＋</span> Add question
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {state.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-[min(90%,700px)] shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              {state.editingFAQ ? "Edit Question" : "Add Question"}
            </h3>

            <div className="space-y-4">
              <label className="block">
                <div className="text-sm mb-1">Question *</div>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={state.question}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "question",
                      payload: e.target.value,
                    })
                  }
                />
              </label>

              <label className="block">
                <div className="text-sm mb-1">Answer</div>
                <textarea
                  className="w-full border px-3 py-2 rounded"
                  rows={4}
                  value={state.answer}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "answer",
                      payload: e.target.value,
                    })
                  }
                />
              </label>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={saveFAQ}
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

              {state.editingFAQ && (
                <button
                  onClick={handleDelete}
                  disabled={state.deleting}
                  className="px-4 py-2 text-red-600 border border-red-600 rounded disabled:opacity-60"
                >
                  {state.deleting ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
