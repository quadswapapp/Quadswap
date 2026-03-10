"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import SellerProfileCard from "@/components/SellerProfileCard";
import type { Listing, Profile } from "@/lib/types";

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [seller, setSeller] = useState<Profile | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchListing() {
      const { data, error } = await supabase
        .from("listings")
        .select("*, profiles(*)")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Error fetching listing:", error);
        setLoading(false);
        return;
      }

      setListing(data);
      setSeller(data.profiles ?? null);
      setLoading(false);
    }

    fetchListing();
  }, [id]);

  const handleContact = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !listing) return;

    // Check for existing conversation
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("listing_id", listing.id)
      .eq("buyer_id", user.id)
      .single();

    if (existing) {
      router.push(`/messages/${existing.id}`);
      return;
    }

    // Create new conversation
    const { data: newConv, error } = await supabase
      .from("conversations")
      .insert({
        listing_id: listing.id,
        buyer_id: user.id,
        seller_id: listing.seller_id,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating conversation:", error);
      return;
    }

    router.push(`/messages/${newConv.id}`);
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-zinc-500">Loading...</div>
    );
  }

  if (!listing) {
    return (
      <div className="py-20 text-center text-zinc-500">
        Listing not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid gap-8 md:grid-cols-2"
      >
        {/* Images */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
            {listing.image_urls?.[activeImage] ? (
              <Image
                src={listing.image_urls[activeImage]}
                alt={listing.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-400">
                No image
              </div>
            )}
          </div>
          {listing.image_urls && listing.image_urls.length > 1 && (
            <div className="mt-3 flex gap-2">
              {listing.image_urls.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-colors ${
                    activeImage === i
                      ? "border-emerald-500"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={url}
                    alt={`${listing.title} ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {listing.title}
          </h1>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            ${listing.price.toFixed(2)}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {listing.category}
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {listing.condition}
            </span>
            {listing.sold && (
              <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                SOLD
              </span>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {listing.description}
          </p>

          <div className="mt-4 text-sm text-zinc-500">
            Pickup: {listing.pickup_location}
          </div>

          {!listing.sold && (
            <button
              onClick={handleContact}
              className="mt-6 w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Contact Seller
            </button>
          )}

          {seller && (
            <div className="mt-6">
              <SellerProfileCard profile={seller} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
