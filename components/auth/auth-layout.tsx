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
    <div className="flex min-h-full flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <Link
          href="/"
          className="mb-6 flex items-center gap-2.5 focus-ring rounded-[var(--radius)]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius)] bg-primary text-sm font-semibold text-white">
            S
          </span>
          <span className="text-lg font-semibold tracking-tight text-text">
            StudySphere
          </span>
        </Link>
        <h1 className="text-title text-xl">{title}</h1>
        <p className="mt-1.5 text-caption">{description}</p>
      </div>

      <Card padding="lg" className="w-full max-w-sm">
        {children}
      </Card>

      <p className="mt-6 text-center text-caption">{footer}</p>
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
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-label">
        {label}
      </label>
      {children}
    </div>
  );
}

export { AuthField };
