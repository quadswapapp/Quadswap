# QuadSwap V1 Beta Launch Checklist

Target: ~March 25, 2025 (Admitted Students Day)
Stack: Next.js + Supabase + Tailwind v4 + Framer Motion

---

## 1. Critical Bug Fixes

- [ ] Fix discover page hydration bug — replace `new Date().toISOString()` with static string in `app/(main)/discover/page.tsx` (4 occurrences)
- [ ] Add sign-out button to profile page — mobile users currently have no way to log out
- [x] Fix self-message bug — seller can no longer message themselves on their own listing
- [x] Fix browse page hydration bug — sample listings use static date strings
- [x] Mobile bottom nav shows "Sign In" when logged out (replaces Profile tab)

## 2. Core Marketplace Flow

- [x] Browse — search, category filters, sample fallback with Unsplash images
- [x] Listing detail — image gallery, seller card, contact button, owner guard
- [x] Sell — image upload to Supabase Storage, form submission to listings table
- [x] Mark as sold — button on My Listings page, updates Supabase, reflects in UI
- [x] Messages inbox — conversation list with last message preview
- [x] Chat thread — real-time via Supabase subscriptions
- [x] My Listings — grid of user's listings with sold/active management
- [x] My Profile — stats, active listings, nav to listings/messages
- [x] Seller profile — public view at `/seller/[id]` with stats and active listings

## 3. Trust & Safety

- [x] Auth restricted to `@wfu.edu` emails only
- [x] Terms & Community Rules page at `/terms`
- [x] "By continuing, you agree..." acknowledgment on login page
- [x] Terms link in landing page footer
- [x] Safety guidance — meet in public, inspect before paying
- [x] Prohibited items policy documented
- [ ] Consider adding safety reminder in chat (e.g. first-message banner)

## 4. Supabase Infrastructure

All items below must be verified manually in the Supabase dashboard:

- [ ] **profiles** table exists — columns: `id` (uuid PK), `email`, `full_name`, `school`, `verified` (bool, default false), `items_sold` (int, default 0), `created_at` (timestamptz, default now())
- [ ] **listings** table exists — columns: `id` (uuid PK), `seller_id` (FK → profiles.id), `title`, `description`, `price` (numeric), `category`, `condition`, `image_urls` (text[]), `pickup_location`, `sold` (bool, default false), `created_at` (timestamptz, default now())
- [ ] **conversations** table exists — columns: `id` (uuid PK), `listing_id` (FK → listings.id), `buyer_id` (FK → profiles.id), `seller_id` (FK → profiles.id), `created_at`
- [ ] **messages** table exists — columns: `id` (uuid PK), `conversation_id` (FK → conversations.id), `sender_id` (uuid), `content` (text), `created_at`
- [ ] FK constraint names match code: `conversations_buyer_id_fkey`, `conversations_seller_id_fkey`
- [ ] **listing-images** storage bucket exists and is set to Public
- [ ] Storage policy: authenticated users can upload to their own path
- [ ] RLS enabled on all 4 tables with appropriate policies
- [ ] Realtime enabled on `messages` table
- [ ] `http://localhost:3000/auth/callback` added to Auth redirect URLs
- [ ] Production domain added to Auth redirect URLs (when ready)
- [ ] End-to-end test: send magic link to a real `@wfu.edu` email and complete sign-in

## 5. Mobile Experience

- [x] Mobile bottom nav with Browse, Sell, Messages, Profile/Sign In
- [x] Auth-aware mobile nav — shows Sign In when logged out
- [ ] Add sign-out option accessible from mobile (profile page)
- [x] Chat input has extra bottom padding for mobile nav safe area
- [x] All pages use `pb-20 sm:pb-0` to clear mobile bottom nav
- [ ] Test all flows on iPhone Safari and Android Chrome
- [ ] Test landscape orientation on key pages (browse, chat)

## 6. Beta Launch Prep

- [ ] Seed 5–10 real listings from team members before inviting users
- [ ] Prepare a short invite message for initial testers (text/GroupMe)
- [ ] Set up a feedback channel (Google Form, GroupMe thread, or email)
- [ ] Decide on bug reporting method (GitHub Issues, form, or DM)
- [ ] Deploy to Vercel (or chosen host) and verify production build
- [ ] Set Supabase environment variables in production
- [ ] Smoke test full flow on production URL: landing → login → browse → sell → message → mark sold
- [ ] Remove or hide sample/fallback listings once real listings exist (optional)

## 7. Post-Beta Improvements

These can wait until after launch:

- Discover tab (swipe UI) — code exists at `/discover`, hidden from nav
- Ratings and reviews
- Delete listing functionality
- Edit listing after posting
- Push notifications or email alerts for new messages
- Image compression/optimization before upload
- Search by description (currently title-only)
- Seller response time or activity indicators
- Pagination on browse page for large listing counts
- Analytics/tracking for usage metrics
