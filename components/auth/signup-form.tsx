"use client";

import { AuthField, AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-state";
import { signUpWithEmail } from "@/lib/actions/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignupForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const result = await signUpWithEmail(email, password);

      if (!result.ok) {
        console.error("Signup failed:", result.message);
        setError(result.message);
        setLoading(false);
        return;
      }

      if (result.needsEmailConfirmation) {
        setNotice(
          "Check your email to confirm your account, then sign in.",
        );
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      console.error("Signup error:", err);
      setError(message);
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Start organizing your semester"
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary-hover"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="w-full min-w-0 space-y-4">
        {notice && (
          <div
            role="status"
            className="rounded-[var(--radius)] border border-primary/20 bg-primary-muted px-3 py-2.5 text-sm text-primary"
          >
            {notice}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-[var(--radius)] border border-error/30 bg-error/5 px-3 py-2.5 text-sm text-error"
          >
            {error}
          </div>
        )}

        <AuthField label="Email" id="email">
          <Input
            id="email"
            type="email"
            placeholder="you@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading}
            error={!!error}
          />
        </AuthField>

        <AuthField label="Password" id="password">
          <Input
            id="password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            disabled={loading}
            error={!!error}
          />
        </AuthField>

        <AuthField label="Confirm password" id="confirm-password">
          <Input
            id="confirm-password"
            type="password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            disabled={loading}
            error={!!error}
          />
        </AuthField>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="border-white/30 border-t-white" />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
