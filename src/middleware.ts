import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/login",
  "/forgot-password",
  "/forgot-password/otp",
  "/forgot-password/reset-password",
  "/favicon.ico",
  "/api",
  "/_next/static",
  "/_next/image",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // console.log(token);
  // console.log(token?.role);

  if (!token || token?.role !== "admin") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!favicon.ico|api|_next/static|_next/image).*)"],
};
