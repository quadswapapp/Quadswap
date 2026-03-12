"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.endsWith("@wfu.edu")) {
      setError("Please use your @wfu.edu email address.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(
        authError.message.toLowerCase().includes("rate limit")
          ? "Too many sign-in attempts. Please wait a few minutes and try again."
          : authError.message
      );
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/browse" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
              <span className="text-lg font-black text-gold">Q</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              Quad<span className="text-gold">Swap</span>
            </span>
          </Link>
          <p className="mt-2 text-sm text-muted">
            Wake Forest&apos;s student marketplace
          </p>
        </div>

        {sent ? (
          /* Success state */
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-7 w-7 text-gold">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-foreground">Check your email</h2>
            <p className="mt-2 text-sm text-muted">
              We sent a sign-in link to{" "}
              <span className="font-medium text-gold">{email}</span>
            </p>
            <p className="mt-1 text-xs text-muted">
              Click the link in the email to sign in. You can close this tab.
            </p>
            <button
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
              className="mt-6 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Use a different email
            </button>
          </div>
        ) : (
          /* Email form */
          <>
            {error && (
              <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                  WFU Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@wfu.edu"
                  autoFocus
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gold py-3.5 text-sm font-bold uppercase tracking-wider text-background transition-all hover:bg-gold-light disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? "Sending..." : "Continue with Wake Email"}
              </button>
            </form>

            <p className="mt-6 text-center text-xs leading-relaxed text-muted">
              We&apos;ll email you a secure sign-in link. No password needed.
              <br />
              By continuing, you agree to QuadSwap&apos;s{" "}
              <Link href="/terms" className="text-gold/70 underline decoration-gold/30 underline-offset-2 transition-colors hover:text-gold">
                Terms &amp; Community Rules
              </Link>.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
