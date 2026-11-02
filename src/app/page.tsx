import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "Tell us how you ski",
    body: "Answer a short questionnaire about your experience, how many days you ski each season, and what kind of skiing you love.",
  },
  {
    number: "02",
    title: "Map your comfort zone",
    body: "Share the terrain you feel confident on today, from green groomers to blue cruisers, moguls, glades, and steeps.",
  },
  {
    number: "03",
    title: "Get your progression plan",
    body: "Set your goals and RunReady lays out the next runs, drills, and skills to work on so you can level up safely.",
  },
];

const features = [
  {
    title: "Personalized skill profile",
    body: "A clear snapshot of where your skiing is today, built from your own answers instead of a generic level chart.",
    icon: (
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" />
    ),
  },
  {
    title: "Terrain-based progression",
    body: "Step-by-step paths from the terrain you know to the terrain you want, with each step a little more challenging.",
    icon: <path d="m3 20 6-10 4 6 3-4 5 8H3Z" />,
  },
  {
    title: "Goal-focused drills",
    body: "Practice ideas matched to your goals, whether that is linking parallel turns, handling ice, or skiing your first black.",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="0.5" />
      </>
    ),
  },
  {
    title: "Safety first",
    body: "Plans are built around steady progress and staying within your limits, so improving never means skiing beyond your ability.",
    icon: <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />,
  },
];

const comingSoon = [
  {
    title: "AI progression plans",
    body: "Plans generated from your profile and updated as you improve.",
  },
  {
    title: "Skier accounts",
    body: "Save your profile, track your ski days, and pick up your plan on any device.",
  },
  {
    title: "Progress tracking",
    body: "Log the runs you have conquered and watch your terrain map grow.",
  },
  {
    title: "Premium coaching",
    body: "Deeper plans and video-based technique tips for dedicated skiers.",
  },
];

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight">
      <span className="grid size-9 place-items-center rounded-lg bg-ice-400 text-navy-950">
        <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
          <path d="m2 20 7-12 4 6 3-4 6 10H2Z" />
        </svg>
      </span>
      <span className="text-lg">
        Run<span className="text-ice-300">Ready</span>
      </span>
    </a>
  );
}

export default function Home() {
  return (
    <div id="top" className="min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <header className="absolute inset-x-0 top-0 z-20 text-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <Logo />
          <div className="hidden items-center gap-8 text-sm text-ice-100 md:flex">
            <a href="#about" className="hover:text-white">About</a>
            <a href="#how-it-works" className="hover:text-white">How It Works</a>
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#coming-soon" className="hover:text-white">Coming Soon</a>
          </div>
          <a
            href="#coming-soon"
            className="rounded-full border border-ice-200/40 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            What&apos;s next
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative isolate flex min-h-[92vh] items-center bg-navy-950 text-white">
        <Image
          src="/images/hero-mountains.svg"
          alt="Snowy mountain range with a skier carving down a groomed run"
          fill
          priority
          unoptimized
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-navy-950/60 md:bg-transparent md:bg-gradient-to-r md:from-navy-950/90 md:via-navy-950/60 md:to-transparent" />
        <div className="mx-auto w-full max-w-6xl px-4 pt-28 pb-20 sm:px-6">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-widest text-ice-200 uppercase ring-1 ring-white/15 backdrop-blur">
              AI-powered ski progression
            </p>
            <h1 className="text-4xl leading-tight font-bold tracking-tight sm:text-6xl">
              Ski your next run <span className="text-ice-300">with confidence.</span>
            </h1>
            <p className="mt-6 text-lg text-ice-100 sm:text-xl">
              RunReady turns your experience, comfort terrain, and goals into a
              personalized plan for becoming a stronger, more confident skier.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#how-it-works"
                className="rounded-full bg-ice-400 px-6 py-3 text-center font-semibold text-navy-950 shadow-lg shadow-ice-400/20 hover:bg-ice-300"
              >
                See how it works
              </a>
              <a
                href="#features"
                className="rounded-full border border-white/30 px-6 py-3 text-center font-semibold text-white hover:bg-white/10"
              >
                Explore features
              </a>
            </div>
            <p className="mt-10 text-sm text-ice-200">
              Created by{" "}
              <span className="font-semibold text-white">Emerson Brown Saville</span>
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-8 bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold tracking-widest text-ice-500 uppercase">
              What is RunReady?
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
              A smarter path from the bunny hill to the summit.
            </h2>
          </div>
          <div className="space-y-5 text-lg text-slate-600">
            <p>
              Most skiers improve by guessing: trying a harder run, hoping it
              goes well, and sticking with the same habits season after season.
              RunReady replaces the guesswork with a plan.
            </p>
            <p>
              Skiers answer a few questions about their experience, the terrain
              they are comfortable on, and what they want to improve. RunReady
              will use AI to build a personalized progression plan that shows
              exactly what to work on next.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-8 bg-ice-50 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold tracking-widest text-ice-500 uppercase">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
              Three steps to your personal plan
            </h2>
          </div>
          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <li
                key={step.number}
                className="relative rounded-2xl border border-ice-100 bg-white p-8 shadow-sm"
              >
                <span className="text-5xl font-bold text-ice-200">{step.number}</span>
                <h3 className="mt-4 text-xl font-semibold text-navy-900">{step.title}</h3>
                <p className="mt-3 text-slate-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-8 bg-navy-900 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-widest text-ice-300 uppercase">
              Features
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Built for skiers who want to keep getting better
            </h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-navy-800/60 p-8"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-ice-400/15 text-ice-300">
                  <svg
                    viewBox="0 0 24 24"
                    className="size-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {feature.icon}
                  </svg>
                </span>
                <h3 className="mt-5 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-ice-100/80">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming soon */}
      <section id="coming-soon" className="scroll-mt-8 bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold tracking-widest text-ice-500 uppercase">
              Coming soon
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
              Fresh tracks ahead
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              RunReady is in early development. Here is what we are building
              next.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {comingSoon.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-dashed border-ice-300 bg-ice-50 p-6"
              >
                <span className="inline-block rounded-full bg-navy-900 px-3 py-1 text-xs font-semibold tracking-wide text-ice-200">
                  Coming soon
                </span>
                <h3 className="mt-4 text-lg font-semibold text-navy-900">{item.title}</h3>
                <p className="mt-2 text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-950 text-ice-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-12 text-center sm:px-6 md:flex-row md:text-left">
          <div className="text-white">
            <Logo />
          </div>
          <p className="text-base">
            Created by{" "}
            <span className="font-semibold text-white">Emerson Brown Saville</span>
          </p>
          <p className="text-sm text-ice-200/70">
            &copy; {new Date().getFullYear()} RunReady. Penn State class project.
          </p>
        </div>
      </footer>
    </div>
  );
}
