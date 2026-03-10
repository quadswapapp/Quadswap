"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Listing } from "@/lib/types";

export default function ListingCard({ listing }: { listing: Listing }) {
  const imageUrl = listing.image_urls?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={`/listing/${listing.id}`}
        className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-800">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={listing.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">
              No image
            </div>
          )}
          {listing.sold && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white">
                SOLD
              </span>
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {listing.title}
          </p>
          <p className="text-lg font-bold text-emerald-600">
            ${listing.price.toFixed(2)}
          </p>
          <p className="mt-1 truncate text-xs text-zinc-500">
            {listing.condition} &middot; {listing.pickup_location}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
