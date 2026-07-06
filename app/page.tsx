import { AppLogo } from "@/components/layout/app-logo";
import { Header } from "@/components/layout/header";
import { LandingPage } from "@/components/landing/landing-page";
import { LandingSectionProvider } from "@/components/landing/landing-section-context";
import Link from "next/link";

export default function Home() {
  return (
    <LandingSectionProvider>
      <div className="flex min-h-full flex-col">
        <Header />
        <LandingPage />

        <footer className="border-t border-border bg-surface">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
            <div className="flex items-center gap-2.5">
              <AppLogo size={28} />
              <span className="text-sm font-semibold text-text">
                StudySphere
              </span>
            </div>

            <p className="font-mono text-xs text-muted">
              © {new Date().getFullYear()} StudySphere. Built for students.
            </p>

            <nav className="flex gap-6">
              <Link
                href="#features"
                className="text-sm text-muted transition-colors hover:text-text"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm text-muted transition-colors hover:text-text"
              >
                How it works
              </Link>
              <Link
                href="#pricing"
                className="text-sm text-muted transition-colors hover:text-text"
              >
                Pricing
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </LandingSectionProvider>
  );
}
