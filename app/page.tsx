import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Nav */}
      <nav className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10">
              <span className="text-sm font-black text-gold">Q</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Quad<span className="text-gold">Swap</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/browse"
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Browse
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-gold px-4 py-2 text-sm font-bold text-background transition-all hover:bg-gold-light"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
            Wake Forest Only
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl">
            Buy and sell
            <br />
            <span className="text-gold">on the Quad.</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            The student marketplace built exclusively for Wake Forest.
            <br className="hidden sm:block" />
            Textbooks, furniture, electronics — no fees, just Deacs helping Deacs.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="w-full rounded-xl bg-gold px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-background transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 active:scale-[0.98] sm:w-auto"
            >
              Get Started
            </Link>
            <Link
              href="/browse"
              className="w-full rounded-xl border border-border px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-muted-foreground transition-all hover:border-gold/30 hover:text-foreground sm:w-auto"
            >
              Browse Listings
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 flex gap-12 border-t border-border pt-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-gold">WFU</p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted">
              Verified Students
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">$0</p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted">
              Seller Fees
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">DM</p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted">
              Direct Messages
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted">
        QuadSwap &middot; Built for Wake Forest University
        <span className="mx-1.5">&middot;</span>
        <Link href="/terms" className="text-muted-foreground underline decoration-border underline-offset-2 transition-colors hover:text-gold">
          Terms
        </Link>
      </footer>
    </div>
  );
}
