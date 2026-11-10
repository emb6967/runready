import "server-only";
import { redirect } from "next/navigation";
import { getAuth } from "./auth/server";

/** Returns the signed-in user, or sends the visitor to the log-in page. */
export async function requireUser() {
  const { data: session } = await getAuth().getSession();
  if (!session?.user) redirect("/auth/sign-in");
  return session.user;
}
