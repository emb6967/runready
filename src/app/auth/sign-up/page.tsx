import type { Metadata } from "next";
import { AuthForm } from "../auth-form";
import { AuthShell } from "../auth-shell";

export const metadata: Metadata = { title: "Create account | RunReady" };

export default function SignUpPage() {
  return (
    <AuthShell title="Create your account" subtitle="Start building your ski progression plan.">
      <AuthForm mode="sign-up" />
    </AuthShell>
  );
}
