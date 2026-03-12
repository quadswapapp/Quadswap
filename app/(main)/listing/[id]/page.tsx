"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-surface" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded-lg bg-surface" />
            <div className="h-10 w-1/3 animate-pulse rounded-lg bg-surface" />
            <div className="h-20 w-full animate-pulse rounded-lg bg-surface" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-muted">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <p className="text-sm font-medium text-muted-foreground">Listing not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid gap-8 md:grid-cols-2"
      >
        {/* Images */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface">
            {listing.image_urls?.[activeImage] ? (
              <Image
                src={listing.image_urls[activeImage]}
                alt={listing.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-16 w-16 text-border">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                </svg>
                <span className="text-xs font-medium uppercase tracking-wider text-muted">No image</span>
              </div>
            )}
          </div>
          {listing.image_urls && listing.image_urls.length > 1 && (
            <div className="mt-3 flex gap-2">
              {listing.image_urls.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-all ${
                    activeImage === i
                      ? "border-gold shadow-md shadow-gold/20"
                      : "border-border hover:border-muted"
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {listing.title}
          </h1>
          <p className="mt-2 text-3xl font-bold text-gold">
            ${listing.price.toFixed(2)}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {listing.category}
            </span>
            <span className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {listing.condition}
            </span>
            {listing.sold && (
              <span className="rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-red-400">
                Sold
              </span>
            )}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            {listing.description}
          </p>

          <div className="mt-4 flex items-center gap-2 text-sm text-muted">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span>{listing.pickup_location}</span>
          </div>

          {!listing.sold && (
            <button
              onClick={handleContact}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3.5 text-sm font-bold uppercase tracking-wider text-background transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 active:scale-[0.98]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              Message Seller
            </button>
          )}

          {seller && (
            <Link href={`/seller/${seller.id}`} className="mt-6 block">
              <SellerProfileCard profile={seller} />
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}
