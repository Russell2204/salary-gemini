import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

export default NextAuth(authConfig).auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req
  const isOnDashboard = nextUrl.pathname === "/"
  const isOnAuthPage = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register")

  if (isOnDashboard && !isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl))
  }

  if (isOnAuthPage && isLoggedIn) {
    return Response.redirect(new URL("/", nextUrl))
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
