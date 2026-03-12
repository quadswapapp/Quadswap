"use client";

import { motion } from "framer-motion";
import type { Profile } from "@/lib/types";

export default function SellerProfileCard({
  profile,
}: {
  profile: Profile;
}) {
  const parts = (profile.full_name ?? "").trim().split(/\s+/).filter(Boolean);
  const initials =
    parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0]?.[0]?.toUpperCase() ?? "?";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-border bg-surface p-5"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gold/10 text-lg font-bold text-gold ring-2 ring-gold/20">
          {initials}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-bold text-foreground">
              {profile.full_name}
            </h3>
            {profile.verified && (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0 text-gold">
                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{profile.school}</p>
        </div>
      </div>
      <div className="mt-4 flex gap-6 border-t border-border pt-4 text-sm">
        <div className="text-muted-foreground">
          <span className="font-bold text-gold">
            {profile.items_sold}
          </span>{" "}
          items sold
        </div>
        <div className="text-muted-foreground">
          Joined{" "}
          <span className="font-medium text-foreground">
            {new Date(profile.created_at).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
