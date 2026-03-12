"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Listing } from "@/lib/types";

const CONDITION_COLORS: Record<string, string> = {
  "Like New": "text-emerald-400",
  "Good": "text-blue-400",
  "Fair": "text-amber-400",
  "Poor": "text-red-400",
};

export default function ListingCard({ listing }: { listing: Listing }) {
  const imageUrl = listing.image_urls?.[0];
  const isSample = listing.id.startsWith("sample-");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Link
        href={isSample ? "#" : `/listing/${listing.id}`}
        className="group block overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/30 hover:shadow-xl hover:shadow-gold/5"
      >
        {/* Image area */}
        <div className="relative aspect-square overflow-hidden bg-background">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 bg-surface-raised">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-10 w-10 text-border">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
              </svg>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted">
                No image
              </span>
            </div>
          )}
          {listing.sold && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <span className="rounded-full bg-red-500/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                Sold
              </span>
            </div>
          )}
          {/* Price badge */}
          <div className="absolute bottom-2 left-2 rounded-lg border border-white/5 bg-black/70 px-2.5 py-1 backdrop-blur-sm">
            <span className="text-sm font-bold text-gold">
              ${listing.price.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="p-3">
          <p className="truncate text-sm font-semibold text-foreground group-hover:text-gold transition-colors">
            {listing.title}
          </p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className={`text-[11px] font-medium ${CONDITION_COLORS[listing.condition] ?? "text-muted"}`}>
              {listing.condition}
            </span>
            <span className="text-border">&#183;</span>
            <span className="truncate text-[11px] text-muted">
              {listing.pickup_location}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
