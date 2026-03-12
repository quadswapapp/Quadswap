"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { href: "/browse", label: "Browse", icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" },
  { href: "/sell", label: "Sell", icon: "M12 4.5v15m7.5-7.5h-15" },
  { href: "/messages", label: "Messages", icon: "M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" },
  { href: "/profile", label: "Profile", icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u ? { id: u.id } : null);
      setChecked(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id } : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/browse");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav bar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/browse" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10">
              <span className="text-sm font-black text-gold">Q</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Quad<span className="text-gold">Swap</span>
            </span>
          </Link>
          <div className="hidden items-center gap-1 sm:flex">
            {NAV_LINKS.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gold/10 text-gold"
                      : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                  </svg>
                  {link.label}
                </Link>
              );
            })}
            {checked && (
              user ? (
                <button
                  onClick={handleLogout}
                  className="ml-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-surface-hover hover:text-foreground"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="ml-2 rounded-lg bg-gold/10 px-3 py-2 text-sm font-semibold text-gold transition-all hover:bg-gold/20"
                >
                  Sign In
                </Link>
              )
            )}
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 backdrop-blur-xl sm:hidden">
        <div className="flex h-16 items-center justify-around px-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] font-medium transition-colors ${
                  isActive ? "text-gold" : "text-muted"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                </svg>
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="pb-20 sm:pb-0">{children}</div>
    </div>
  );
}
