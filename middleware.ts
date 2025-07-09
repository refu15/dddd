import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const pathname = req.nextUrl.pathname

      // /admin で始まるパスにアクセスしようとしている場合
      if (pathname.startsWith("/admin")) {
        // ユーザーの役割が 'admin' であることを要求
        // @ts-ignore
        return token?.role === "admin"
      }

      // その他の保護されたルートについては、ログインしていることだけを確認
      return !!token
    },
  },
})

export const config = {
  matcher: [
    // ログインページと静的アセットを除く、保護対象の全ルート
    "/",
    "/admin/:path*",
    "/delivery/:path*",
    "/documents/:path*",
    "/notifications/:path*",
    "/profile/:path*",
    "/shift/:path*",
  ],
}
