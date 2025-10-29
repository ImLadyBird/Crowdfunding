import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

type FAQ = {
  id: number;
  question: string;
  answer: string;
  user_id: string;
  created_at?: string;
};

export default function PublicProfileFAQ({ user_id }: { user_id: string }) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user_id) fetchFaqs();
  }, [user_id]);

  async function fetchFaqs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching FAQs:", error);
      setFaqs([]);
    } else {
      setFaqs(data || []);
    }
    setLoading(false);
  }

  if (loading) return <p className="text-center py-6">Loading FAQs...</p>;

   if (!faqs.length)
    return (
      <div className="p-6 md:px-40 bg-white">
        <div className="flex items-center gap-2 py-6 mb-5">
          <span className="h-3 w-3 rounded-full bg-violet-800" />
          <h2 className="text-2xl font-semibold text-gray-800">
            FAQ
          </h2>
        </div>
        <p className="text-center py-6 text-gray-500">No FAQ found.</p>
      </div>
    );

  return (
    <div className="p-6 md:px-40 bg-white">
      <div className="flex items-center gap-2 py-6">
        <span className="h-3 w-3 rounded-full bg-violet-800" />
        <h2 className="text-2xl font-medium text-gray-800">FAQ</h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <div key={faq.id} className="flex items-center gap-2">
            <details className="w-full border border-violet-300 rounded-[4px] px-4 py-2 text-gray-800 open:border-violet-500 open:bg-violet-50">
              <summary className="cursor-pointer flex justify-between items-center">
                <span>{faq.question}</span>
              </summary>
              <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
