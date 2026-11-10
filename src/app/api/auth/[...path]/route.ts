import { getAuth } from "@/lib/auth/server";

type Context = { params: Promise<{ path: string[] }> };

// Proxies auth requests (sign-in, sign-up, session refresh, sign-out) to Neon Auth.
export function GET(request: Request, context: Context) {
  return getAuth().handler().GET(request, context);
}

export function POST(request: Request, context: Context) {
  return getAuth().handler().POST(request, context);
}
