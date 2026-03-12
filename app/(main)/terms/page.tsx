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
              QuadSwap is in beta. Features may change, and we&apos;re actively
              improving the platform. Thanks for being an early user &mdash;
              your feedback helps us build something great for the Wake Forest
              community.
            </p>
          </div>
        </div>

        {/* Who can use */}
        <section>
          <h2 className="text-lg font-bold text-foreground">Who can use QuadSwap</h2>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
            <li className="flex gap-2.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
              QuadSwap is exclusively for current Wake Forest University students with a valid <span className="font-medium text-foreground">@wfu.edu</span> email.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
              One account per student. Don&apos;t share your sign-in link with others.
            </li>
          </ul>
        </section>

        {/* Safety */}
        <section>
          <h2 className="text-lg font-bold text-foreground">Safety first</h2>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
            <li className="flex gap-2.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
              Always meet in well-lit, public locations on campus &mdash; the Quad, ZSR Library lobby, Benson Center, or another busy area.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
              Inspect items in person before completing payment. Once you pay, the transaction is between you and the seller.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
              Use your best judgment. If something feels off, trust your instincts and walk away.
            </li>
          </ul>
        </section>

        {/* Prohibited */}
        <section>
          <h2 className="text-lg font-bold text-foreground">Prohibited items</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Do not list weapons, drugs, alcohol, tobacco, stolen goods, counterfeit
            items, or anything that violates Wake Forest&apos;s{" "}
            <span className="font-medium text-foreground">Student Code of Conduct</span>.
            Listings that violate these rules will be removed, and accounts may be
            suspended.
          </p>
        </section>

        {/* Your responsibility */}
        <section>
          <h2 className="text-lg font-bold text-foreground">Your responsibility</h2>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
            <li className="flex gap-2.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
              QuadSwap connects buyers and sellers &mdash; we don&apos;t process payments, hold funds, or guarantee transactions.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
              You&apos;re responsible for the accuracy of your listings and for completing transactions honestly.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
              Be respectful in messages. Harassment, spam, or scam attempts will result in account removal.
            </li>
          </ul>
        </section>

        {/* Closing */}
        <section>
          <h2 className="text-lg font-bold text-foreground">Questions?</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            QuadSwap is a student-built project. If you have questions, concerns,
            or feedback, reach out to us &mdash; we&apos;re students too and we
            want to get this right.
          </p>
        </section>
      </div>
    </div>
  );
}
