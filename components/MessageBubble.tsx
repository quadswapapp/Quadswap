"use client";

import { motion } from "framer-motion";
import type { Message } from "@/lib/types";

export default function MessageBubble({
  message,
  isOwn,
}: {
  message: Message;
  isOwn: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isOwn
            ? "rounded-br-md bg-gold text-background"
            : "rounded-bl-md border border-border bg-surface text-foreground"
        }`}
      >
        <p>{message.content}</p>
        <p
          className={`mt-1 text-right text-[10px] ${
            isOwn ? "text-background/50" : "text-muted"
          }`}
        >
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </motion.div>
  );
}
