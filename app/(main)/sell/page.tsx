"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = [
  "Textbooks",
  "Electronics",
  "Furniture",
  "Clothing",
  "Other",
];
const CONDITIONS = ["New", "Like New", "Good", "Fair", "Poor"];

export default function SellPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in to create a listing.");
        setSubmitting(false);
        return;
      }

      // Upload images
      const imageUrls: string[] = [];
      for (const file of files) {
        const ext = file.name.split(".").pop();
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("listing-images")
          .upload(path, file);

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("listing-images").getPublicUrl(path);

        imageUrls.push(publicUrl);
      }

      // Insert listing
      const { error: insertError } = await supabase.from("listings").insert({
        seller_id: user.id,
        title,
        description,
        price: parseFloat(price),
        category: category || CATEGORIES[0],
        condition: condition || CONDITIONS[0],
        image_urls: imageUrls,
        pickup_location: pickupLocation,
        sold: false,
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      router.push("/browse");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sell an <span className="text-gold">Item</span>
        </h1>
        <p className="mt-1 text-sm text-muted">
          List something for sale to Wake Forest students.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Photos */}
        <section>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
            Photos
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          {previews.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {previews.map((url, i) => (
                <div
                  key={i}
                  className="relative h-24 w-24 overflow-hidden rounded-xl border border-border"
                >
                  <img
                    src={url}
                    alt={`Preview ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-24 w-24 items-center justify-center rounded-xl border border-dashed border-border text-muted transition-colors hover:border-gold/40 hover:text-gold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-surface py-10 transition-all hover:border-gold/40"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-gold">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Tap to add photos
              </span>
              <span className="text-xs text-muted">JPG, PNG up to 10MB</span>
            </button>
          )}
        </section>

        {/* Title & Description */}
        <section className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='e.g. "Organic Chemistry Textbook"'
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
              Description
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe condition, what's included, etc."
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
            />
          </div>
        </section>

        {/* Price & Pickup */}
        <section className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
              Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted">
                $
              </span>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border border-border bg-surface py-3 pl-8 pr-4 text-sm text-foreground outline-none placeholder:text-muted transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
              Pickup Location
            </label>
            <input
              type="text"
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="e.g. Student Union"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
            />
          </div>
        </section>

        {/* Category */}
        <section>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  category === cat
                    ? "bg-gold text-background shadow-lg shadow-gold/20"
                    : "border border-border bg-surface text-muted-foreground hover:border-gold/30 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Condition */}
        <section>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
            Condition
          </label>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map((cond) => (
              <button
                key={cond}
                type="button"
                onClick={() => setCondition(cond)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  condition === cond
                    ? "bg-gold text-background shadow-lg shadow-gold/20"
                    : "border border-border bg-surface text-muted-foreground hover:border-gold/30 hover:text-foreground"
                }`}
              >
                {cond}
              </button>
            ))}
          </div>
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3.5 text-sm font-bold uppercase tracking-wider text-background transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 disabled:opacity-50 active:scale-[0.98]"
        >
          {submitting ? (
            "Posting..."
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Post Listing
            </>
          )}
        </button>
      </form>
    </div>
  );
}
