import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Next.js 16 proxy (successor to middleware). Guards Raalhu AI surfaces only —
 * the matcher must never widen to SkillPips routes, which handle their own auth.
 */
export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    if (request.nextUrl.pathname.startsWith("/api/raalhu")) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }
    const login = new URL("/raalhu/login", request.url);
    login.searchParams.set(
      "callbackUrl",
      request.nextUrl.pathname + request.nextUrl.search
    );
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/raalhu/dashboard/:path*",
    "/raalhu/onboarding/:path*",
    "/api/raalhu/:path*",
  ],
};
