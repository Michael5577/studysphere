"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { allNavItems } from "@/types/navigation";

export function TopNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const currentPage = allNavItems.find(
    (item) =>
      pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  return (
    <header
      className={cn(
        "flex h-[var(--topnav-height)] shrink-0 items-center justify-between border-b border-border bg-surface px-4 lg:px-6",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 lg:hidden focus-ring rounded-[var(--radius)]"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-[var(--radius)] bg-primary text-xs font-semibold text-white">
            S
          </span>
        </Link>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-text">
            {currentPage?.label ?? "StudySphere"}
          </h1>
          {currentPage?.description && (
            <p className="hidden truncate text-caption sm:block">
              {currentPage.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" aria-label="Search">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <Link
          href="/profile"
          className="ml-1 hidden h-8 w-8 items-center justify-center rounded-[var(--radius)] bg-primary-muted text-xs font-semibold text-primary transition-default hover:bg-primary/10 sm:flex focus-ring"
          aria-label="Profile"
        >
          MS
        </Link>
      </div>
    </header>
  );
}
