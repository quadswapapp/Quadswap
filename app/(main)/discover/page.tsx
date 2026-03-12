"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { Listing } from "@/lib/types";

const SAMPLE_LISTINGS: Listing[] = [
  {
    id: "discover-1",
    seller_id: "sample-seller",
    title: "Calculus: Early Transcendentals",
    description: "Lightly used, no highlights. 8th edition.",
    price: 45,
    category: "Textbooks",
    condition: "Like New",
    image_urls: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop"],
    pickup_location: "Student Union",
    sold: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "discover-2",
    seller_id: "sample-seller",
    title: "Sony WH-1000XM4 Headphones",
    description: "Great condition, noise cancelling. Includes case.",
    price: 120,
    category: "Electronics",
    condition: "Good",
    image_urls: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"],
    pickup_location: "Library Lobby",
    sold: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "discover-3",
    seller_id: "sample-seller",
    title: "Mini Fridge",
    description: "3.2 cu ft, black. Perfect for dorm rooms.",
    price: 80,
    category: "Furniture",
    condition: "Fair",
    image_urls: ["https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop"],
    pickup_location: "East Parking Lot",
    sold: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "discover-4",
    seller_id: "sample-seller",
    title: "TI-84 Plus Calculator",
    description: "Fully functional. Great for math/science courses.",
    price: 60,
    category: "Electronics",
    condition: "Good",
    image_urls: ["https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400&h=400&fit=crop"],
    pickup_location: "Engineering Building",
    sold: false,
    created_at: new Date().toISOString(),
  },
];

function SwipeCard({
  listing,
  onSwipe,
  isFront,
}: {
  listing: Listing;
  onSwipe: (direction: "left" | "right") => void;
  isFront: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const leftIndicatorOpacity = useTransform(x, [-150, -50], [1, 0]);
  const rightIndicatorOpacity = useTransform(x, [50, 150], [0, 1]);

  const imageUrl = listing.image_urls?.[0];
  const isSample = listing.id.startsWith("discover-");

  return (
    <motion.div
      style={{ x, rotate, opacity, zIndex: isFront ? 10 : 5 }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) {
          animate(x, 300, { duration: 0.2 });
          setTimeout(() => onSwipe("right"), 200);
        } else if (info.offset.x < -100) {
          animate(x, -300, { duration: 0.2 });
          setTimeout(() => onSwipe("left"), 200);
        }
      }}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface">
        {/* Image area */}
        <div className="relative flex-1 bg-background">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 400px"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-16 w-16 text-border">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
              </svg>
              <span className="text-xs font-medium uppercase tracking-wider text-muted">No image</span>
            </div>
          )}

          {/* Swipe indicators */}
          <motion.div
            style={{ opacity: rightIndicatorOpacity }}
            className="absolute left-4 top-4 rounded-lg bg-emerald-500/90 px-4 py-2 text-sm font-bold uppercase text-white"
          >
            Interested
          </motion.div>
          <motion.div
            style={{ opacity: leftIndicatorOpacity }}
            className="absolute right-4 top-4 rounded-lg bg-red-500/90 px-4 py-2 text-sm font-bold uppercase text-white"
          >
            Skip
          </motion.div>

          {/* Seller badge */}
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-semibold text-white">WFU Verified</span>
          </div>
        </div>

        {/* Details */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-foreground">
                {listing.title}
              </h2>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                <span>{listing.condition}</span>
                <span className="text-border">&middot;</span>
                <span className="truncate">{listing.pickup_location}</span>
              </div>
            </div>
            <span className="shrink-0 text-xl font-bold text-gold">
              ${listing.price}
            </span>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onSwipe("left")}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold text-muted-foreground transition-all hover:border-red-500/30 hover:text-red-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Skip
            </button>
            <Link
              href={isSample ? "#" : `/listing/${listing.id}`}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold text-muted-foreground transition-all hover:border-gold/30 hover:text-gold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              View
            </Link>
            <button
              onClick={() => onSwipe("right")}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-gold text-sm font-bold text-background transition-all hover:bg-gold-light"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              Interested
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function DiscoverPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchListings() {
      const { data } = await supabase
        .from("listings")
        .select("*")
        .eq("sold", false)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        setListings(data);
      } else {
        setListings(SAMPLE_LISTINGS);
      }
      setLoading(false);
    }

    fetchListings();
  }, []);

  const handleSwipe = (direction: "left" | "right") => {
    // V1.5: track interested items
    if (direction === "right") {
      // TODO: save interest to Supabase
    }
    setCurrentIndex((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-8">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-surface" />
        <div className="mt-6 aspect-[3/4] w-full animate-pulse rounded-2xl bg-surface" />
      </div>
    );
  }

  const remaining = listings.slice(currentIndex);
  const isDone = remaining.length === 0;

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          <span className="text-gold">Discover</span>
        </h1>
        <p className="mt-1 text-xs text-muted">Swipe to find items you want</p>
      </div>

      {isDone ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-muted">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            You&apos;ve seen all listings
          </p>
          <p className="mt-1 text-xs text-muted">Check back later for new items</p>
          <button
            onClick={() => setCurrentIndex(0)}
            className="mt-6 rounded-lg bg-gold/10 px-4 py-2 text-sm font-semibold text-gold transition-all hover:bg-gold/20"
          >
            Start Over
          </button>
        </div>
      ) : (
        <div className="relative aspect-[3/4] w-full">
          {remaining.slice(0, 2).map((listing, i) => (
            <SwipeCard
              key={listing.id}
              listing={listing}
              onSwipe={handleSwipe}
              isFront={i === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
