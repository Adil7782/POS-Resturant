import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // ⚠️ must match your login API
  const { pathname } = req.nextUrl;

  // console.log("TOKEN:", token);

  // If no token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If token exists → allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // protect whole dashboard
};