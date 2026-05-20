import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Auth middleware placeholder — integrate Supabase auth when configured
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  if (isDashboard && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
