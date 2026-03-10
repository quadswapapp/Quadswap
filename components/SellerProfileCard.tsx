"use client";

import { motion } from "framer-motion";
import type { Profile } from "@/lib/types";

export default function SellerProfileCard({
  profile,
}: {
  profile: Profile;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
          {profile.full_name?.charAt(0)?.toUpperCase() ?? "?"}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {profile.full_name}
            </h3>
            {profile.verified && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                Verified
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-500">{profile.school}</p>
        </div>
      </div>
      <div className="mt-4 flex gap-6 text-sm text-zinc-600 dark:text-zinc-400">
        <div>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {profile.items_sold}
          </span>{" "}
          items sold
        </div>
        <div>
          Joined{" "}
          {new Date(profile.created_at).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>
    </motion.div>
  );
}
