import type { NextRequest } from "next/server";
import { getAuth } from "@/lib/auth/server";

// Runs before protected pages: redirects signed-out visitors to the sign-in
// page and refreshes the session cookie when needed.
export default function proxy(request: NextRequest) {
  return getAuth().middleware({ loginUrl: "/auth/sign-in" })(request);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
