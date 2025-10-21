import { supabase } from "@/lib/supabaseClient";
import React, { useEffect, useReducer } from "react";
import { toast } from "react-toastify";

type Tier = {
  id: string;
  name: string;
  reward_description?: string;
  amount?: number;
  user_id?: string;
};

type State = {
  tiers: Tier[];
  loading: boolean;
  isOpen: boolean;
  editingTier: Tier | null;
  saving: boolean;
  deleting: boolean;
  name: string;
  reward: string;
  amount: string;
};

type Action =
  | { type: "SET_TIERS"; payload: Tier[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "OPEN_CREATE_MODAL" }
  | { type: "OPEN_EDIT_MODAL"; payload: Tier }
  | { type: "CLOSE_MODAL" }
  | { type: "SET_FIELD"; field: "name" | "reward" | "amount"; payload: string }
  | { type: "SET_SAVING"; payload: boolean }
  | { type: "SET_DELETING"; payload: boolean };

const initialState: State = {
  tiers: [],
  loading: true,
  isOpen: false,
  editingTier: null,
  saving: false,
  deleting: false,
  name: "",
  reward: "",
  amount: "",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_TIERS":
      return { ...state, tiers: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "OPEN_CREATE_MODAL":
      return {
        ...state,
        editingTier: null,
        name: "",
        reward: "",
        amount: "",
        isOpen: true,
      };
    case "OPEN_EDIT_MODAL":
      return {
        ...state,
        editingTier: action.payload,
        name: action.payload.name,
        reward: action.payload.reward_description || "",
        amount: action.payload.amount?.toString() ?? "",
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

export default function ProfileContributorTier() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchTiers();
  }, []);

  async function fetchTiers() {
    dispatch({ type: "SET_LOADING", payload: true });
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      dispatch({ type: "SET_TIERS", payload: [] });
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }

    const { data, error } = await supabase
      .from("tiers")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      toast.error("Failed to fetch tiers");
    } else {
      dispatch({ type: "SET_TIERS", payload: data || [] });
    }
    dispatch({ type: "SET_LOADING", payload: false });
  }

  async function saveTier() {
    if (!state.name.trim()) {
      toast.error("Name is required");
      return;
    }
    const numAmount = state.amount ? Number(state.amount) : null;
    dispatch({ type: "SET_SAVING", payload: true });

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      toast.error("Not authenticated");
      dispatch({ type: "SET_SAVING", payload: false });
      return;
    }

    try {
      if (state.editingTier) {
        const { error } = await supabase
          .from("tiers")
          .update({
            name: state.name.trim(),
            reward_description: state.reward.trim(),
            amount: numAmount,
            updated_at: new Date().toISOString(),
          })
          .eq("id", state.editingTier.id);

        if (error) throw error;
        toast.success("Tier updated");
      } else {
        const { error } = await supabase.from("tiers").insert([
          {
            name: state.name.trim(),
            reward_description: state.reward.trim(),
            amount: numAmount,
            user_id: user.id,
          },
        ]);

        if (error) throw error;
        toast.success("Tier created");
      }

      await fetchTiers();
      dispatch({ type: "CLOSE_MODAL" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to save tier");
    } finally {
      dispatch({ type: "SET_SAVING", payload: false });
    }
  }

  async function handleDelete() {
    if (!state.editingTier) return;
    if (!confirm("Delete this tier? This cannot be undone.")) return;

    dispatch({ type: "SET_DELETING", payload: true });
    try {
      const { error } = await supabase
        .from("tiers")
        .delete()
        .eq("id", state.editingTier.id);
      if (error) throw error;
      toast.success("Tier deleted");
      await fetchTiers();
      dispatch({ type: "CLOSE_MODAL" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete tier");
    } finally {
      dispatch({ type: "SET_DELETING", payload: false });
    }
  }

  return (
    <div className="p-6 md:px-40 bg-white">
      <div className="flex items-center gap-2 py-6">
            <span className="h-3 w-3 rounded-full bg-violet-800" />
            <h2 className="text-xl font-semibold text-gray-800">Contributor Tiers</h2>
          </div>

      {state.loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {state.tiers.map((t) => (
            <div
              key={t.id}
              className="border border-gray-400 shadow-sm overflow-hidden items-center justify-center"
            >
              <div className="bg-violet-800 text-white px-2 py-2 text-center">
                {t.name}
              </div>
              <div className="p-4 min-h-[200px] flex flex-col justify-center items-center">
                <p className="text-gray-700 mb-4 text-center">
                  {t.reward_description}
                </p>
                <div className="flex flex-col items-center justify-center w-[150px] h-[100px] rounded-[5px] bg-violet-200">
                  <p className=" font-bold text-violet-700 opacity-40   text-center">
                    {t.name}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mb-6 mt-6">
                  Start at ${t.amount ?? "—"}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      dispatch({ type: "OPEN_EDIT_MODAL", payload: t })
                    }
                    className="px-3 py-2 bg-violet-800 text-white rounded-md text-sm"
                  >
                    Edit Tier
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="border border-gray-400 flex items-center justify-center">
            <button
              onClick={() => dispatch({ type: "OPEN_CREATE_MODAL" })}
              className="flex flex-col items-center justify-center py-8 px-4 w-full h-40 cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="mb-2 text-gray-400 text-center">Add Tier</div>
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

      {state.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => dispatch({ type: "CLOSE_MODAL" })}
          />
          <div className="relative bg-white rounded-lg w-[min(90%,700px)] p-6 z-10 shadow-lg">
            <h3 className="text-lg font-medium mb-4">
              {state.editingTier ? "Edit Tier" : "Create Tier"}
            </h3>

            <div className="space-y-4">
              <label className="block">
                <div className="text-sm mb-1">Name *</div>
                <input
                  className="w-full border px-3 py-2 rounded"
                  value={state.name}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "name",
                      payload: e.target.value,
                    })
                  }
                />
              </label>

              <label className="block">
                <div className="text-sm mb-1">Reward description</div>
                <textarea
                  className="w-full border px-3 py-2 rounded"
                  value={state.reward}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "reward",
                      payload: e.target.value,
                    })
                  }
                />
              </label>

              <label className="block">
                <div className="text-sm mb-1">Amount (USD)</div>
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded"
                  value={state.amount}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "amount",
                      payload: e.target.value,
                    })
                  }
                />
              </label>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={saveTier}
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

              {state.editingTier && (
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
