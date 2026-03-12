"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Conversation } from "@/lib/types";

export default function ConversationCard({
  conversation,
  currentUserId,
}: {
  conversation: Conversation;
  currentUserId: string;
}) {
  const otherUser =
    conversation.buyer_id === currentUserId
      ? conversation.seller
      : conversation.buyer;
  const listingTitle = conversation.listings?.title ?? "Listing";

  const nameParts = (otherUser?.full_name ?? "").trim().split(/\s+/).filter(Boolean);
  const initials =
    nameParts.length >= 2
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : nameParts[0]?.[0]?.toUpperCase() ?? "?";

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={`/messages/${conversation.id}`}
        className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-all duration-200 hover:border-gold/30 hover:bg-surface-hover"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/10 text-xs font-bold text-gold ring-2 ring-gold/20">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-foreground">
              {otherUser?.full_name ?? "Unknown"}
            </p>
            {conversation.last_message && (
              <span className="shrink-0 text-[10px] font-medium text-muted">
                {new Date(
                  conversation.last_message.created_at
                ).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-[11px] font-medium text-gold/70">
            {listingTitle}
          </p>
          {conversation.last_message && (
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {conversation.last_message.content}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
