"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import ListingCard from "@/components/ListingCard";
import type { Profile, Listing } from "@/lib/types";

export default function SellerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetch() {
      const [profileRes, listingsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", id).single(),
        supabase
          .from("listings")
          .select("*")
          .eq("seller_id", id)
          .eq("sold", false)
          .order("created_at", { ascending: false }),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (listingsRes.data) setListings(listingsRes.data);
      setLoading(false);
    }

    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="h-32 animate-pulse rounded-2xl bg-surface" />
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-surface" />
          ))}
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-surface" />
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-muted">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-muted-foreground">Seller not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border border-border bg-surface p-5"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gold/10 text-lg font-bold text-gold ring-2 ring-gold/20">
            {(() => {
              const parts = (profile.full_name ?? "").trim().split(/\s+/).filter(Boolean);
              if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
              return parts[0]?.[0]?.toUpperCase() ?? "?";
            })()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-xl font-bold text-foreground">
                {profile.full_name}
              </h1>
              {profile.verified && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0 text-gold">
                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">{profile.school}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-surface p-4 text-center">
          <p className="text-2xl font-bold text-gold">{listings.length}</p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted">Active</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4 text-center">
          <p className="text-2xl font-bold text-gold">{profile.items_sold}</p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted">Sold</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4 text-center">
          <p className="text-lg font-bold text-foreground">
            {new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted">Joined</p>
        </div>
      </div>

      {/* Active listings */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-bold text-foreground">
          Active <span className="text-gold">Listings</span>
        </h2>
        {listings.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface py-12 text-center">
            <p className="text-sm text-muted">No active listings</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
