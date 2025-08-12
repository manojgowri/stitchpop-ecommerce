import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Handle auth callback
  if (request.nextUrl.pathname === "/auth/callback") {
    const code = request.nextUrl.searchParams.get("code")
    if (code) {
      await supabase.auth.exchangeCodeForSession(code)
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Refresh session if expired
  await supabase.auth.getSession()

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
