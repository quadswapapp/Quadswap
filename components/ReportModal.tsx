"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

const REASONS = [
  "Scam or suspicious",
  "Prohibited item",
  "Harassment",
  "Misleading listing",
  "Other",
];

export default function ReportModal({
  open,
  onClose,
  listingId,
  reportedUserId,
}: {
  open: boolean;
  onClose: () => void;
  listingId?: string;
  reportedUserId?: string;
}) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    setSubmitting(true);
    setError("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be signed in to submit a report.");
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("reports").insert({
      reporter_id: user.id,
      listing_id: listingId ?? null,
      reported_user_id: reportedUserId ?? null,
      reason,
      description: description.trim() || null,
    });

    if (insertError) {
      setError("Something went wrong. Please try again.");
      console.error("Report error:", insertError);
    } else {
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  const handleClose = () => {
    onClose();
    // Reset after close animation
    setTimeout(() => {
      setReason("");
      setDescription("");
      setSubmitted(false);
      setError("");
    }, 200);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-[20%] z-50 mx-auto max-w-sm rounded-2xl border border-border bg-surface p-5 shadow-2xl sm:inset-x-auto sm:w-full"
          >
            {submitted ? (
              <div className="text-center py-4">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 text-gold">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-foreground">Report submitted</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Thanks for helping keep QuadSwap safe.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-5 rounded-xl bg-gold/10 px-5 py-2 text-sm font-semibold text-gold transition-colors hover:bg-gold/20"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-foreground">
                    Report {listingId ? "Listing" : "User"}
                  </h2>
                  <button
                    onClick={handleClose}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {error && (
                  <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                      Reason
                    </label>
                    <select
                      required
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                    >
                      <option value="" disabled>
                        Select a reason
                      </option>
                      {REASONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                      Details <span className="normal-case tracking-normal text-muted">(optional)</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="Anything else we should know?"
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !reason}
                    className="w-full rounded-xl bg-gold py-3 text-sm font-bold uppercase tracking-wider text-background transition-all hover:bg-gold-light disabled:opacity-40 active:scale-[0.98]"
                  >
                    {submitting ? "Submitting..." : "Submit Report"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
