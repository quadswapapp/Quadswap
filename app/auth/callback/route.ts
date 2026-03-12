import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/browse";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
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

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
