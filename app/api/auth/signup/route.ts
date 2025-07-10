import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing Supabase environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).");
}

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const supabaseAdmin = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { data, error } = await supabaseAdmin.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Supabase sign-up error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Optionally, you can insert user profile into a 'users' table here if needed
    // For example:
    const { error: insertError } = await supabaseAdmin.from('users').insert({ id: data.user.id, email: data.user.email });
    if (insertError) {
      if (insertError.code === '23505') {
        console.error('profile insert fail (duplicate):', insertError.message, insertError);
        return NextResponse.json({ message: 'User registered (or already existed)' }, { status: 200 });
      }
      console.error("profile insert fail:", insertError.message, insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "User registered successfully. Please check your email for verification if email confirmation is enabled." }, { status: 200 });
  } catch (error: any) {
    console.error("Unexpected error during sign-up:", error.message);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
