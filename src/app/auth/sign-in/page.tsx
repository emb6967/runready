import type { Metadata } from "next";
import { AuthForm } from "../auth-form";
import { AuthShell } from "../auth-shell";

export const metadata: Metadata = { title: "Log in | RunReady" };

export default function SignInPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Log in to your RunReady account.">
      <AuthForm mode="sign-in" />
    </AuthShell>
  );
}
