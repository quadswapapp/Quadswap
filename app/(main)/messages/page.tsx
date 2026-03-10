"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ConversationCard from "@/components/ConversationCard";
import type { Conversation, Message } from "@/lib/types";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchConversations() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setCurrentUserId(user.id);

      const { data, error } = await supabase
        .from("conversations")
        .select(
          "*, listings(id, title, image_urls), buyer:profiles!conversations_buyer_id_fkey(*), seller:profiles!conversations_seller_id_fkey(*)"
        )
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching conversations:", error);
        setLoading(false);
        return;
      }

      // Fetch last message for each conversation
      const convos: Conversation[] = [];
      for (const conv of data ?? []) {
        const { data: msgs } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1);

        convos.push({
          ...conv,
          last_message: (msgs?.[0] as Message) ?? undefined,
        });
      }

      setConversations(convos);
      setLoading(false);
    }

    fetchConversations();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-zinc-500">Loading...</div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        Messages
      </h1>

      {!currentUserId ? (
        <div className="py-20 text-center text-zinc-500">
          Please sign in to view messages.
        </div>
      ) : conversations.length === 0 ? (
        <div className="py-20 text-center text-zinc-500">
          No conversations yet.
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv) => (
            <ConversationCard
              key={conv.id}
              conversation={conv}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
