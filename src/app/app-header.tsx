import Link from "next/link";
import { signOutAction } from "./auth/actions";

/** Header for signed-in pages. */
export function AppHeader({ isPaid }: { isPaid: boolean }) {
  return (
    <header className="bg-navy-950 text-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          Run<span className="text-ice-300">Ready</span>
          {isPaid && (
            <span className="rounded-full bg-ice-400 px-2 py-0.5 text-xs font-bold text-navy-950">PRO</span>
          )}
        </Link>
        <form action={signOutAction}>
          <button
            type="submit"
            className="rounded-full border border-white/30 px-4 py-2 text-sm font-medium hover:bg-white/10"
          >
            Log out
          </button>
        </form>
      </div>
    </header>
  );
}
