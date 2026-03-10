"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ListingCard from "@/components/ListingCard";
import type { Listing } from "@/lib/types";

export default function MyListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="py-20 text-center text-zinc-500">Loading...</div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        My Listings
      </h1>

      {listings.length === 0 ? (
        <div className="py-20 text-center text-zinc-500">
          You haven&apos;t posted any listings yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
