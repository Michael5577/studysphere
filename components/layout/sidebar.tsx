"use client";

import { cn } from "@/lib/utils";
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
        "group flex items-center gap-3 rounded-[var(--radius)] px-3 py-2 text-sm font-medium transition-default focus-ring",
        isActive
          ? "bg-primary-muted text-primary"
          : "text-muted hover:bg-background hover:text-text",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <item.icon
        className={cn(
          "h-[18px] w-[18px] shrink-0",
          isActive ? "text-primary" : "text-muted group-hover:text-text",
        )}
        strokeWidth={isActive ? 2 : 1.5}
      />
      <span>{item.label}</span>
    </Link>
  );
}

export function Sidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "flex w-[var(--sidebar-width)] shrink-0 flex-col border-r border-border bg-surface",
        className,
      )}
    >
      <div className="flex h-[var(--topnav-height)] items-center border-b border-border px-5">
        <Link href="/dashboard" className="flex items-center gap-2.5 focus-ring rounded-[var(--radius)]">
          <span className="flex h-7 w-7 items-center justify-center rounded-[var(--radius)] bg-primary text-xs font-semibold text-white">
            S
          </span>
          <span className="text-sm font-semibold tracking-tight text-text">
            StudySphere
          </span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        <p className="mb-1.5 px-3 text-label">Workspace</p>
        {primaryNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        <div className="my-3 border-t border-border" />

        <p className="mb-1.5 px-3 text-label">Account</p>
        {secondaryNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-[var(--radius)] px-3 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius)] bg-primary-muted text-xs font-semibold text-primary">
            MS
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text">
              Michael Serbeh
            </p>
            <p className="truncate text-caption">Computer Science</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
