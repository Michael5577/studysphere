"use client";

import { CommandMenu } from "@/components/layout/command-menu";
import { NotificationPopover } from "@/components/layout/notification-popover";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AppUser } from "@/lib/auth";
import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { allNavItems } from "@/types/navigation";

interface TopNavProps {
  user: AppUser;
  className?: string;
}

export function TopNav({ user, className }: TopNavProps) {
  const pathname = usePathname();
  const [commandOpen, setCommandOpen] = useState(false);

  const currentPage = allNavItems.find(
    (item) =>
      pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  return (
    <>
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
          <Button
            variant="ghost"
            size="sm"
            aria-label="Search"
            onClick={() => setCommandOpen(true)}
          >
            <Search className="h-4 w-4" />
          </Button>
          <NotificationPopover />
          <UserMenu user={user} />
        </div>
      </header>

      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
