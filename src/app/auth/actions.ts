"use server";

import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth/server";

export type AuthFormState = {
  error?: string;
  message?: string;
  email?: string;
  name?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function signUpAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const name = field(formData, "name");
  const email = field(formData, "email").toLowerCase();
  const password = formData.get("password");
  const keep = { name, email };

  if (!name) return { ...keep, error: "Please enter your name." };
  if (!EMAIL_RE.test(email)) return { ...keep, error: "Please enter a valid email address." };
  if (typeof password !== "string" || password.length < 8) {
    return { ...keep, error: "Password must be at least 8 characters." };
  }

  let signedIn = false;
  try {
    // Neon Auth hashes the password and stores the account in your Neon database.
    const { data, error } = await getAuth().signUp.email({ name, email, password });
    if (error) {
      return { ...keep, error: error.message || "Could not create your account." };
    }
    // No session token means the project requires email verification first.
    signedIn = Boolean(data?.token);
  } catch (err) {
    console.error("Sign-up failed:", err instanceof Error ? err.message : err);
    return { ...keep, error: "Sign-up is unavailable right now. Please try again." };
  }

  if (!signedIn) {
    return {
      email,
      message: "Account created! Check your email for a verification link, then log in.",
    };
  }
  redirect("/dashboard");
}

export async function signInAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = field(formData, "email").toLowerCase();
  const password = formData.get("password");

  if (!EMAIL_RE.test(email) || typeof password !== "string" || !password) {
    return { email, error: "Please enter your email and password." };
  }

  try {
    const { error } = await getAuth().signIn.email({ email, password });
    if (error) {
      if (error.code === "EMAIL_NOT_VERIFIED") {
        return { email, error: "Please verify your email first. Check your inbox for the link." };
      }
      // Same message for wrong email or wrong password, so accounts can't be guessed.
      return { email, error: "Incorrect email or password." };
    }
  } catch (err) {
    console.error("Sign-in failed:", err instanceof Error ? err.message : err);
    return { email, error: "Log-in is unavailable right now. Please try again." };
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  try {
    await getAuth().signOut();
  } catch (err) {
    console.error("Sign-out failed:", err instanceof Error ? err.message : err);
  }
  redirect("/");
}
