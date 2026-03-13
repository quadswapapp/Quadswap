/**
 * Seed script — populates QuadSwap with realistic sample listings.
 *
 * ⚠ LOCAL/ADMIN USE ONLY — uses the Supabase service role key to bypass RLS.
 * Never import this file from browser/client code or commit the key to git.
 *
 * Usage:
 *   SEED_USER_ID=<uuid> npx tsx scripts/seed-listings.ts
 *
 * Prerequisites:
 *   1. NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *   2. A seed user must already exist in auth + profiles.
 */

import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing env vars. Make sure .env.local contains:\n" +
      "  NEXT_PUBLIC_SUPABASE_URL=…\n" +
      "  SUPABASE_SERVICE_ROLE_KEY=…"
  );
  process.exit(1);
}

// Replace with your seed user's profile UUID, or pass via env var
const SEED_USER_ID = process.env.SEED_USER_ID || "YOUR_SEED_USER_UUID_HERE";

if (SEED_USER_ID === "YOUR_SEED_USER_UUID_HERE") {
  console.error(
    "Set SEED_USER_ID to a valid profile UUID.\n" +
      "  SEED_USER_ID=<uuid> npx tsx scripts/seed-listings.ts"
  );
  process.exit(1);
}

// Service role client — bypasses RLS. Only used in this CLI script.
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Placeholder images from picsum.photos — each listing gets a unique seed
const placeholder = (seed: number) =>
  `https://picsum.photos/seed/quadswap${seed}/600/400`;

interface SeedListing {
  seller_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  image_urls: string[];
  pickup_location: string;
  sold: boolean;
}

const listings: SeedListing[] = [
  {
    seller_id: SEED_USER_ID,
    title: "Calculus: Early Transcendentals (8th Ed.)",
    description:
      "Used for MTH 111/112. Some highlighting in chapters 1–6, otherwise clean. No access code.",
    price: 45,
    category: "Textbooks",
    condition: "Good",
    image_urls: [placeholder(1)],
    pickup_location: "ZSR Library lobby",
    sold: false,
  },
  {
    seller_id: SEED_USER_ID,
    title: "MacBook Pro 67W USB-C Charger",
    description:
      "Original Apple charger, works perfectly. Upgrading to MagSafe so don't need this anymore.",
    price: 30,
    category: "Electronics",
    condition: "Like New",
    image_urls: [placeholder(2)],
    pickup_location: "Benson Center",
    sold: false,
  },
  {
    seller_id: SEED_USER_ID,
    title: "Black Mini Fridge (3.2 cu ft)",
    description:
      "Perfect dorm fridge. Fits under the desk. Freezer compartment works great. Graduating, must go!",
    price: 60,
    category: "Furniture",
    condition: "Good",
    image_urls: [placeholder(3)],
    pickup_location: "South Hall front desk",
    sold: false,
  },
  {
    seller_id: SEED_USER_ID,
    title: "LED Desk Lamp with USB Port",
    description:
      "Adjustable brightness, warm/cool modes. Built-in USB charging port. Great for late-night studying.",
    price: 15,
    category: "Electronics",
    condition: "Like New",
    image_urls: [placeholder(4)],
    pickup_location: "Poteat Hall",
    sold: false,
  },
  {
    seller_id: SEED_USER_ID,
    title: "Sony WH-1000XM4 Headphones",
    description:
      "Amazing noise canceling. Battery still lasts 25+ hrs. Includes case and cable. Small scratch on left ear cup.",
    price: 120,
    category: "Electronics",
    condition: "Good",
    image_urls: [placeholder(5)],
    pickup_location: "Reynolda Hall steps",
    sold: false,
  },
  {
    seller_id: SEED_USER_ID,
    title: "North Face Puffer Jacket (Men's M)",
    description:
      "Black 700-fill down jacket. Wore it one season, still in great shape. Warm enough for Winston winters.",
    price: 85,
    category: "Clothing",
    condition: "Like New",
    image_urls: [placeholder(6)],
    pickup_location: "Mag Quad",
    sold: false,
  },
  {
    seller_id: SEED_USER_ID,
    title: "Wake Forest Pullover Hoodie (L)",
    description:
      "Black and gold WFU hoodie from the bookstore. Super comfy, just have too many. Size large.",
    price: 25,
    category: "Clothing",
    condition: "Good",
    image_urls: [placeholder(7)],
    pickup_location: "Benson Center",
    sold: false,
  },
  {
    seller_id: SEED_USER_ID,
    title: "5x7 Dorm Area Rug — Gray",
    description:
      "Neutral gray rug, fits most dorm rooms. No stains. Rolled up and ready for pickup.",
    price: 35,
    category: "Furniture",
    condition: "Good",
    image_urls: [placeholder(8)],
    pickup_location: "Collins Hall",
    sold: false,
  },
  {
    seller_id: SEED_USER_ID,
    title: "Schwinn Hybrid Bike",
    description:
      "21-speed, great for getting around campus. New tires last semester. Comes with lock.",
    price: 110,
    category: "Other",
    condition: "Good",
    image_urls: [placeholder(9)],
    pickup_location: "Farrell Hall bike rack",
    sold: false,
  },
  {
    seller_id: SEED_USER_ID,
    title: "iClicker 2 Remote",
    description:
      "Required for a bunch of classes. Works perfectly, new batteries included.",
    price: 15,
    category: "Electronics",
    condition: "Good",
    image_urls: [placeholder(10)],
    pickup_location: "ZSR Library lobby",
    sold: false,
  },
  {
    seller_id: SEED_USER_ID,
    title: "TI-84 Plus CE Graphing Calculator",
    description:
      "Color screen model. Used for MTH and ECN classes. Has protective cover. All functions work.",
    price: 55,
    category: "Electronics",
    condition: "Good",
    image_urls: [placeholder(11)],
    pickup_location: "Manchester Hall",
    sold: false,
  },
  {
    seller_id: SEED_USER_ID,
    title: "Ergonomic Desk Chair — Black Mesh",
    description:
      "Adjustable height and lumbar support. Way better than the dorm chair. Fits in a sedan for transport.",
    price: 50,
    category: "Furniture",
    condition: "Fair",
    image_urls: [placeholder(12)],
    pickup_location: "Polo Rd parking lot",
    sold: false,
  },
  {
    seller_id: SEED_USER_ID,
    title: "Keurig K-Mini Coffee Maker",
    description:
      "Single-serve, takes K-cups. Compact enough for a dorm desk. Descaled and cleaned. Works great.",
    price: 25,
    category: "Electronics",
    condition: "Good",
    image_urls: [placeholder(13)],
    pickup_location: "Kitchin Hall",
    sold: false,
  },
  {
    seller_id: SEED_USER_ID,
    title: "Intro to Psychology (11th Ed.)",
    description:
      "Myers & DeWall. Used for PSY 151. Clean copy, no writing inside. Spine in good shape.",
    price: 30,
    category: "Textbooks",
    condition: "Like New",
    image_urls: [placeholder(14)],
    pickup_location: "Greene Hall",
    sold: false,
  },
];

async function seed() {
  // Guard against accidental duplicate runs
  const { count, error: countError } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("seller_id", SEED_USER_ID);

  if (countError) {
    console.error("Failed to check existing listings:", countError.message);
    process.exit(1);
  }

  if (count && count > 0) {
    console.warn(
      `⚠ This user already has ${count} listing(s) in the database.\n` +
        "  Running the seed again will create duplicates.\n" +
        "  To proceed anyway, re-run with --force:\n\n" +
        "    SEED_USER_ID=<uuid> npx tsx scripts/seed-listings.ts --force\n"
    );
    if (!process.argv.includes("--force")) {
      process.exit(0);
    }
    console.log("--force flag detected, continuing…\n");
  }

  console.log(`Seeding ${listings.length} listings for user ${SEED_USER_ID}…`);

  const { data, error } = await supabase.from("listings").insert(listings).select("id, title");

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`\nInserted ${data.length} listings:`);
  data.forEach((l: { id: string; title: string }) => console.log(`  • ${l.title} (${l.id})`));
  console.log("\nDone! Browse /browse to see them.");
}

seed();
