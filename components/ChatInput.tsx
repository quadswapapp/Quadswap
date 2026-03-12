"use client";

import { useState } from "react";

export default function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (content: string) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground shadow-sm shadow-black/20 outline-none placeholder:text-muted transition-all focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="flex items-center gap-1.5 rounded-xl bg-gold px-4 py-3 text-sm font-bold text-background transition-all hover:bg-gold-light disabled:opacity-40 active:scale-95"
      >
        Send
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
        </svg>
      </button>
    </form>
  );
}
