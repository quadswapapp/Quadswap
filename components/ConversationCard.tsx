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

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={`/messages/${conversation.id}`}
        className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
          {otherUser?.full_name?.charAt(0)?.toUpperCase() ?? "?"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {otherUser?.full_name ?? "Unknown"}
            </p>
            {conversation.last_message && (
              <span className="shrink-0 text-xs text-zinc-400">
                {new Date(
                  conversation.last_message.created_at
                ).toLocaleDateString()}
              </span>
            )}
          </div>
          <p className="truncate text-xs text-zinc-500">
            Re: {listingTitle}
          </p>
          {conversation.last_message && (
            <p className="mt-0.5 truncate text-sm text-zinc-600 dark:text-zinc-400">
              {conversation.last_message.content}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
