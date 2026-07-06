import { AppLogo } from "@/components/layout/app-logo";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { type ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthLayout({
  title,
  description,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-x-hidden px-4 py-8 safe-area-x safe-area-top safe-area-bottom sm:py-12">
      <div
        className="organic-blob pointer-events-none absolute -left-24 top-16 h-64 w-64 bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div
        className="organic-blob pointer-events-none absolute -right-20 bottom-24 h-56 w-56 bg-secondary/15 blur-3xl"
        aria-hidden
      />

      <div className="relative mb-6 flex w-full min-w-0 max-w-sm flex-col items-center text-center sm:mb-8">
        <Link
          href="/"
          className="mb-5 flex items-center gap-2.5 rounded-full focus-ring sm:mb-6"
        >
          <AppLogo size={36} />
          <span className="font-serif text-lg font-semibold tracking-tight text-text">
            StudySphere
          </span>
        </Link>
        <h1 className="text-title text-xl">{title}</h1>
        <p className="mt-2 text-caption">{description}</p>
      </div>

      <Card padding="lg" className="relative w-full min-w-0 max-w-sm surface-card">
        {children}
      </Card>

      <p className="relative mt-5 w-full min-w-0 max-w-sm text-center text-caption sm:mt-6">
        {footer}
      </p>
    </div>
  );
}

function AuthField({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-2">
      <label htmlFor={id} className="text-label">
        {label}
      </label>
      {children}
    </div>
  );
}

export { AuthField };
