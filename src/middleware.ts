import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  // Define protected routes
  const protectedRoutes = ["/dashboard", "/analytics"];
  const url = req.nextUrl.pathname;
  console.log("in middleware")
  // Check if the route is protected
  if (protectedRoutes.some((route) => url.startsWith(route))) {
    // Validate session using getToken (compatible with edge runtime)
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Redirect to login if the token is invalid
    if (!token) {
      const loginUrl = new URL("/auth/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow the request to continue if no redirection is needed
  return NextResponse.next();
}

// Configure middleware for specific routes
export const config = {
  matcher: ["/dashboard/:path*", "/analytics/:path*"], // Protect nested routes too
};
