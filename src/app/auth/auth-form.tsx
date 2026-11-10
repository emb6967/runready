"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInAction, signUpAction, type AuthFormState } from "./actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-navy-900 placeholder:text-slate-400 focus:border-ice-500 focus:ring-2 focus:ring-ice-200 focus:outline-none";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const isSignUp = mode === "sign-up";
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    isSignUp ? signUpAction : signInAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {isSignUp && (
        <label className="block text-sm font-medium text-navy-900">
          Name
          <input
            name="name"
            type="text"
            autoComplete="name"
            required
            defaultValue={state.name}
            className={inputClass}
            placeholder="Your name"
          />
        </label>
      )}
      <label className="block text-sm font-medium text-navy-900">
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.email}
          className={inputClass}
          placeholder="you@example.com"
        />
      </label>
      <label className="block text-sm font-medium text-navy-900">
        Password
        <input
          name="password"
          type="password"
          autoComplete={isSignUp ? "new-password" : "current-password"}
          required
          minLength={isSignUp ? 8 : undefined}
          className={inputClass}
          placeholder={isSignUp ? "At least 8 characters" : "Your password"}
        />
      </label>

      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state.message && (
        <p role="status" className="rounded-lg bg-ice-100 px-3 py-2 text-sm text-navy-800">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-navy-900 px-6 py-3 font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
      >
        {pending ? "Please wait…" : isSignUp ? "Create account" : "Log in"}
      </button>

      <p className="text-center text-sm text-slate-600">
        {isSignUp ? "Already have an account? " : "New to RunReady? "}
        <Link
          href={isSignUp ? "/auth/sign-in" : "/auth/sign-up"}
          className="font-semibold text-ice-500 hover:underline"
        >
          {isSignUp ? "Log in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
