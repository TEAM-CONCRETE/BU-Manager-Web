import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const COMPANY_PREFIX = "/company";
const MANAGER_PREFIX = "/manager";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasAccessToken = request.cookies.has("accessToken");

  if (hasAccessToken) {
    return NextResponse.next();
  }

  const nextParam = pathname + (search ?? "");

  if (pathname.startsWith(COMPANY_PREFIX)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login/company";
    if (nextParam && nextParam !== "/") {
      url.searchParams.set("next", nextParam);
    }
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith(MANAGER_PREFIX)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login/site-manager";
    if (nextParam && nextParam !== "/") {
      url.searchParams.set("next", nextParam);
    }
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/company/:path*", "/manager/:path*"],
};
