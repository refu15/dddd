
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !NEXTAUTH_SECRET) {
  throw new Error("Missing NextAuth or Supabase environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NEXTAUTH_SECRET).")
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // Supabaseクライアントを作成してユーザーをサインイン
        const supabaseAdmin = createClient(
          SUPABASE_URL,
          SUPABASE_SERVICE_ROLE_KEY
        );

        // Supabase Authでユーザーをサインイン
        const { data: userData, error } = await supabaseAdmin.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error) {
          console.error("Supabase sign-in error:", error.message);
          return null; // 認証失敗
        }

        if (!userData.user) {
          return null;
        }

        // Supabaseでの認証成功後、publicの`users`テーブルからユーザープロファイルを取得
        // ここで役割(role)を取得します
        const { data: user, error: userError } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("id", userData.user.id)
          .maybeSingle();

        if (userError) {
          console.error("Error fetching user profile:", userError.message);
          return null;
        }

        // NextAuthのためにユーザーオブジェクトを返す
        return user;
      },
    }),
  ],

  // セッションに役割(role)を永続化するためのコールバック
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  secret: NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
