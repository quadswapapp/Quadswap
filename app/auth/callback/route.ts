import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/browse";

  if (code) {
    // Create the redirect response FIRST so we can attach session cookies to it.
    // Using the shared createClient() from lib/supabase/server.ts writes cookies
    // via cookieStore.set(), but NextResponse.redirect() creates a separate
    // response that doesn't carry those cookies — causing the session to be lost.
    const response = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Server-side enforcement: only @wfu.edu emails allowed
      if (!data.user.email?.endsWith("@wfu.edu")) {
        await supabase.auth.signOut();
        return NextResponse.redirect(`${origin}/login?error=invalid_email`);
      }

      // Ensure a profile row exists (auto-create on first magic-link login)
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .single();

      if (!existing) {
        const email = data.user.email ?? "";
        // Derive a display name from the email (e.g. "janedoe" from "janedoe@wfu.edu")
        const namePart = email.split("@")[0] ?? "";

        await supabase.from("profiles").insert({
          id: data.user.id,
          email,
          full_name: data.user.user_metadata?.full_name ?? namePart,
          school: "Wake Forest University",
          verified: false,
          items_sold: 0,
        });
      }

      return response;
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
