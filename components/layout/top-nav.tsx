"use client";

import { AppLogo } from "@/components/layout/app-logo";
import { AssistantTrigger } from "@/components/assistant/assistant-trigger";
import { useAssistant } from "@/components/assistant/assistant-provider";
import { CommandMenu } from "@/components/layout/command-menu";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { NotificationPopover } from "@/components/layout/notification-popover";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AppUser } from "@/lib/auth";
import { Menu, Search } from "lucide-react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { openAssistant } = useAssistant();

  const currentPage = allNavItems.find(
    (item) =>
      pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  return (
    <>
      <header
        className={cn(
          "app-topbar safe-area-top safe-area-x relative z-50 flex h-[var(--topnav-height)] shrink-0 items-center justify-between gap-2 px-3 sm:px-4 lg:justify-end lg:px-6",
          className,
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 lg:gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 lg:hidden"
            aria-label="Open navigation menu"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link
            href="/dashboard"
            className="flex shrink-0 items-center gap-2 focus-ring rounded-full lg:hidden"
          >
            <AppLogo size={28} />
          </Link>

          <div className="min-w-0 lg:hidden">
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

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <Button
            variant="ghost"
            size="sm"
            aria-label="Search"
            onClick={() => setCommandOpen(true)}
          >
            <Search className="h-4 w-4" />
          </Button>
          <AssistantTrigger />
          <NotificationPopover />
          <ThemeToggle />
          <UserMenu user={user} />
        </div>
      </header>

      <MobileSidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        user={user}
      />
      <CommandMenu
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onOpenAssistant={openAssistant}
      />
    </>
  );
}
