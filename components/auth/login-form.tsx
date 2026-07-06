"use client";

import { AuthField, AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-state";
import { signInWithEmail } from "@/lib/actions/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signInWithEmail(email, password);

    if (!result.ok) {
      setError(result.message);
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to your academic workspace"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary hover:text-primary-hover"
          >
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="w-full min-w-0 space-y-4">
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
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={loading}
            error={!!error}
          />
        </AuthField>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="border-white/30 border-t-white" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
