"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ListingCard from "@/components/ListingCard";
import type { Listing } from "@/lib/types";

const CATEGORIES = [
  "All",
  "Textbooks",
  "Electronics",
  "Furniture",
  "Clothing",
  "Other",
];

const SAMPLE_LISTINGS: Listing[] = [
  {
    id: "sample-1",
    seller_id: "sample-seller",
    title: "Calculus: Early Transcendentals",
    description: "Lightly used, no highlights. 8th edition.",
    price: 45.0,
    category: "Textbooks",
    condition: "Like New",
    image_urls: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop"],
    pickup_location: "Student Union",
    sold: false,
    created_at: "2025-01-15T00:00:00.000Z",
  },
  {
    id: "sample-2",
    seller_id: "sample-seller",
    title: "Sony WH-1000XM4 Headphones",
    description: "Great condition, noise cancelling. Includes case.",
    price: 120.0,
    category: "Electronics",
    condition: "Good",
    image_urls: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"],
    pickup_location: "Library Lobby",
    sold: false,
    created_at: "2025-01-15T00:00:00.000Z",
  },
  {
    id: "sample-3",
    seller_id: "sample-seller",
    title: "IKEA Desk Lamp",
    description: "White desk lamp, adjustable arm. Works perfectly.",
    price: 15.0,
    category: "Furniture",
    condition: "Good",
    image_urls: ["https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400&h=400&fit=crop"],
    pickup_location: "West Dorms",
    sold: false,
    created_at: "2025-01-15T00:00:00.000Z",
  },
  {
    id: "sample-4",
    seller_id: "sample-seller",
    title: "North Face Fleece Jacket (M)",
    description: "Black, medium. Worn twice.",
    price: 55.0,
    category: "Clothing",
    condition: "Like New",
    image_urls: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop"],
    pickup_location: "Quad Fountain",
    sold: false,
    created_at: "2025-01-15T00:00:00.000Z",
  },
  {
    id: "sample-5",
    seller_id: "sample-seller",
    title: "TI-84 Plus Calculator",
    description: "Fully functional. Great for math/science courses.",
    price: 60.0,
    category: "Electronics",
    condition: "Good",
    image_urls: ["https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400&h=400&fit=crop"],
    pickup_location: "Engineering Building",
    sold: false,
    created_at: "2025-01-15T00:00:00.000Z",
  },
  {
    id: "sample-6",
    seller_id: "sample-seller",
    title: "Mini Fridge",
    description: "3.2 cu ft, black. Perfect for dorm rooms.",
    price: 80.0,
    category: "Furniture",
    condition: "Fair",
    image_urls: ["https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop"],
    pickup_location: "East Parking Lot",
    sold: false,
    created_at: "2025-01-15T00:00:00.000Z",
  },
  {
    id: "sample-7",
    seller_id: "sample-seller",
    title: "Organic Chemistry Textbook",
    description: "Klein, 4th edition. Some highlighting.",
    price: 35.0,
    category: "Textbooks",
    condition: "Fair",
    image_urls: ["https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=400&fit=crop"],
    pickup_location: "Science Center",
    sold: false,
    created_at: "2025-01-15T00:00:00.000Z",
  },
  {
    id: "sample-8",
    seller_id: "sample-seller",
    title: "Apple Magic Keyboard",
    description: "Wireless, space gray. Like new condition.",
    price: 70.0,
    category: "Electronics",
    condition: "Like New",
    image_urls: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop"],
    pickup_location: "Student Union",
    sold: false,
    created_at: "2025-01-15T00:00:00.000Z",
  },
];

export default function BrowsePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [usingSample, setUsingSample] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const supabase = createClient();

    async function fetchListings() {
      setLoading(true);
      let query = supabase
        .from("listings")
        .select("*")
        .eq("sold", false)
        .order("created_at", { ascending: false });

      if (category !== "All") {
        query = query.eq("category", category);
      }

      if (search.trim()) {
        query = query.ilike("title", `%${search.trim()}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching listings:", error);
      }

      if (data && data.length > 0) {
        setListings(data);
        setUsingSample(false);
      } else {
        // Fallback to sample listings with client-side filtering
        let filtered = SAMPLE_LISTINGS;
        if (category !== "All") {
          filtered = filtered.filter((l) => l.category === category);
        }
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          filtered = filtered.filter((l) =>
            l.title.toLowerCase().includes(q)
          );
        }
        setListings(filtered);
        setUsingSample(true);
      }
      setLoading(false);
    }

    fetchListings();
  }, [category, search]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      {/* Hero header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Browse <span className="text-gold">Listings</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Find deals from students on your campus
        </p>
      </div>

      {/* Search + filters */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search for textbooks, electronics, furniture..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 pl-11 text-sm text-foreground shadow-sm shadow-black/20 outline-none placeholder:text-muted transition-all focus:border-gold/50 focus:ring-1 focus:ring-gold/20 focus:shadow-gold/5"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                category === cat
                  ? "bg-gold text-background shadow-lg shadow-gold/25 ring-1 ring-gold/40"
                  : "border border-border bg-surface text-muted-foreground hover:border-gold/30 hover:bg-surface-hover hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sample data notice */}
      {usingSample && !loading && (
        <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-surface px-4 py-3">
          <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold/60" />
          <p className="text-sm text-muted-foreground">
            Showing sample listings &mdash; real listings will appear once added
          </p>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse rounded-2xl bg-surface"
            />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-muted">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            No listings found
          </p>
          <p className="mt-1 text-xs text-muted">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
