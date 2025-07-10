import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing Supabase environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).");
}

export async function POST(request: Request) {
  const { email } = await request.json();

  const supabaseAdmin = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXTAUTH_URL}/auth/update-password`,
    });

    if (error) {
      console.error("Supabase password reset error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Password reset email sent. Please check your inbox." }, { status: 200 });
  } catch (error: any) {
    console.error("Unexpected error during password reset:", error.message);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
