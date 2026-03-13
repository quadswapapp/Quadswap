"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ListingCard from "@/components/ListingCard";
import type { Listing } from "@/lib/types";

export default function MyListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function fetchMyListings() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching listings:", error);
      } else {
        setListings(data ?? []);
      }
      setLoading(false);
    }

    fetchMyListings();
  }, []);

  const handleMarkSold = async (listingId: string) => {
    setUpdatingId(listingId);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUpdatingId(null);
      return;
    }

    // Only the listing owner can mark their own listing as sold
    const { error } = await supabase
      .from("listings")
      .update({ sold: true })
      .eq("id", listingId)
      .eq("seller_id", user.id);

    if (error) {
      console.error("Error marking as sold:", error);
    } else {
      setListings((prev) =>
        prev.map((l) => (l.id === listingId ? { ...l, sold: true } : l))
      );
    }
    setUpdatingId(null);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 h-8 w-48 animate-pulse rounded-lg bg-surface" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-[3/4] animate-pulse rounded-2xl bg-surface" />
              <div className="h-9 animate-pulse rounded-xl bg-surface" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground">
        My <span className="text-gold">Listings</span>
      </h1>

      {listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-muted">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            You haven&apos;t posted any listings yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing) => (
            <div key={listing.id} className="space-y-2">
              <ListingCard listing={listing} />
              {listing.sold ? (
                <div className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-muted">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-medium text-muted">Sold</span>
                </div>
              ) : (
                <button
                  onClick={() => handleMarkSold(listing.id)}
                  disabled={updatingId === listing.id}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-muted-foreground transition-all duration-200 hover:border-gold/30 hover:text-gold disabled:opacity-50"
                >
                  {updatingId === listing.id ? (
                    "Updating..."
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      Mark as Sold
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
