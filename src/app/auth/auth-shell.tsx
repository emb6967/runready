import Link from "next/link";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800 px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-semibold text-white">
          <span className="grid size-9 place-items-center rounded-lg bg-ice-400 text-navy-950">
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
              <path d="m2 20 7-12 4 6 3-4 6 10H2Z" />
            </svg>
          </span>
          <span className="text-lg">
            Run<span className="text-ice-300">Ready</span>
          </span>
        </Link>
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-navy-900">{title}</h1>
          <p className="mt-1 mb-6 text-slate-600">{subtitle}</p>
          {children}
        </div>
      </div>
    </main>
  );
}
