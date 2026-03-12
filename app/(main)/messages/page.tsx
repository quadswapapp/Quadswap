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
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-6 h-8 w-40 animate-pulse rounded-lg bg-surface" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-surface" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-8">
      <h1 className="mb-5 text-3xl font-bold tracking-tight text-foreground">
        <span className="text-gold">Messages</span>
      </h1>

      {!currentUserId ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-muted">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Please sign in to view messages.
          </p>
        </div>
      ) : conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-muted">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            No conversations yet
          </p>
          <p className="mt-1 text-xs text-muted">
            Start a conversation by messaging a seller
          </p>
        </div>
      ) : (
        <div className="space-y-2">
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
