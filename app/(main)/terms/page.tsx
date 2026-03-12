export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Terms &amp; <span className="text-gold">Community Rules</span>
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated March 2025 &middot; QuadSwap Beta
      </p>

      <div className="mt-8 space-y-8">
        {/* Beta notice */}
        <div className="rounded-xl bg-surface px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold/60" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              QuadSwap is currently in beta. Things will evolve as we grow.
              Thanks for being one of the first &mdash; your feedback is
              shaping the future of this platform for Wake Forest.
            </p>
          </div>
        </div>

        {/* Who can use */}
        <section>
          <h2 className="text-lg font-bold text-foreground">Who this is for</h2>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
            <li className="flex gap-2.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
              <span>QuadSwap is exclusively for Wake Forest students. You need a valid <span className="font-medium text-foreground">@wfu.edu</span> email to create an account.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
              <span>One account per person. Keep your sign-in link private.</span>
            </li>
          </ul>
        </section>

        {/* Safety */}
        <section>
          <h2 className="text-lg font-bold text-foreground">Staying safe</h2>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
            <li className="flex gap-2.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
              <span>Meet in public, well-lit spots on campus &mdash; the Quad, ZSR&nbsp;Library lobby, Benson, or any other high-traffic area.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
              <span>Always inspect an item in person before you pay. Once a transaction is complete, it&apos;s between buyer and seller.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
              <span>Trust your judgment. If a deal doesn&apos;t feel right, it&apos;s okay to walk away.</span>
            </li>
          </ul>
        </section>

        {/* Prohibited */}
        <section>
          <h2 className="text-lg font-bold text-foreground">What&apos;s not allowed</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Weapons, drugs, alcohol, tobacco, stolen property, counterfeit
            goods, and anything that violates Wake Forest&apos;s{" "}
            <span className="font-medium text-foreground">Student Code of Conduct</span>{" "}
            are strictly prohibited. We&apos;ll remove listings that break these
            rules and may suspend the account behind them.
          </p>
        </section>

        {/* Your responsibility */}
        <section>
          <h2 className="text-lg font-bold text-foreground">How QuadSwap works</h2>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
            <li className="flex gap-2.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
              <span>We connect buyers and sellers. QuadSwap does not handle payments, hold funds, or guarantee any transaction.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
              <span>List items honestly and complete transactions in good faith. You&apos;re accountable for what you post and what you promise.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
              <span>Keep conversations respectful. Harassment, spam, and scam attempts are grounds for immediate removal.</span>
            </li>
          </ul>
        </section>

        {/* Closing */}
        <section>
          <h2 className="text-lg font-bold text-foreground">Feedback welcome</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            QuadSwap is built by students, for students. If something&apos;s
            broken, confusing, or could be better &mdash; we want to hear it.
          </p>
        </section>
      </div>
    </div>
  );
}
