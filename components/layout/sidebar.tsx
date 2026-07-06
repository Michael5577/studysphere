"use client";

import { AppLogo } from "@/components/layout/app-logo";
import { AssistantTrigger } from "@/components/assistant/assistant-trigger";
import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils";
import type { AppUser } from "@/lib/auth";
import {
  type NavItem,
  primaryNavItems,
  secondaryNavItems,
} from "@/types/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-2.5 rounded-full px-3 py-2 text-sm font-medium transition-default focus-ring",
        isActive
          ? "bg-primary-muted text-primary"
          : "text-muted hover:bg-background hover:text-text",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <item.icon
        className={cn(
          "h-4 w-4 shrink-0",
          isActive ? "text-primary" : "text-muted group-hover:text-text",
        )}
        strokeWidth={isActive ? 2 : 1.5}
      />
      <span>{item.label}</span>
    </Link>
  );
}

interface SidebarProps {
  user: AppUser;
  className?: string;
}

export function Sidebar({ user, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex w-[var(--sidebar-width)] shrink-0 flex-col border-r border-border bg-surface",
        className,
      )}
    >
      <div className="flex h-[var(--topnav-height)] items-center border-b border-border px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 focus-ring rounded-[var(--radius)]"
        >
          <AppLogo size={28} />
          <span className="text-sm font-semibold tracking-tight text-text">
            StudySphere
          </span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2.5">
        <p className="mb-1 px-2.5 text-label">Workspace</p>
        {primaryNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        <div className="my-2.5 border-t border-border" />

        <p className="mb-1 px-2.5 text-label">Account</p>
        {secondaryNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      <AssistantTrigger variant="sidebar" />

      <div className="space-y-1 border-t border-border p-2.5">
        <div className="flex items-center gap-2.5 rounded-[var(--radius)] px-2.5 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius)] bg-primary-muted text-xs font-semibold text-primary">
            {user.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text">
              {user.displayName}
            </p>
            <p className="truncate text-caption">{user.email}</p>
          </div>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
