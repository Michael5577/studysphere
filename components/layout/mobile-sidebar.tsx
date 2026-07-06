"use client";

import { LogoutButton } from "@/components/auth/logout-button";
import { AppLogo } from "@/components/layout/app-logo";
import { cn } from "@/lib/utils";
import type { AppUser } from "@/lib/auth";
import {
  primaryNavItems,
  secondaryNavItems,
  type NavItem,
} from "@/types/navigation";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/body-scroll-lock";

function DrawerNavLink({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex min-h-[44px] items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-default focus-ring touch-manipulation",
        isActive
          ? "bg-primary-muted text-primary"
          : "text-muted hover:bg-muted-surface hover:text-text",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <item.icon className="h-5 w-5 shrink-0" strokeWidth={isActive ? 2 : 1.5} />
      <span>{item.label}</span>
    </Link>
  );
}

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AppUser;
}

export function MobileSidebar({ open, onOpenChange, user }: MobileSidebarProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    }

    lockBodyScroll();
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      unlockBodyScroll();
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) {
    return null;
  }

  const close = () => onOpenChange(false);

  return (
    <div className="fixed inset-0 z-[80] lg:hidden">
      <button
        type="button"
        aria-label="Close menu"
        className="absolute inset-0 bg-black/40 touch-manipulation"
        onClick={close}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="absolute inset-y-0 left-0 flex w-[min(18rem,85vw)] flex-col border-r border-border bg-surface shadow-[var(--shadow-float)] safe-area-top safe-area-bottom safe-area-x"
      >
        <div className="flex h-[var(--topnav-height)] shrink-0 items-center justify-between border-b border-border px-4">
          <Link
            href="/dashboard"
            onClick={close}
            className="flex items-center gap-2.5 focus-ring rounded-full"
          >
            <AppLogo size={28} />
            <span className="text-sm font-semibold text-text">StudySphere</span>
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted transition-default hover:bg-muted-surface hover:text-text focus-ring touch-manipulation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          <p className="px-4 py-1 text-label">Workspace</p>
          {primaryNavItems.map((item) => (
            <DrawerNavLink key={item.href} item={item} onNavigate={close} />
          ))}

          <div className="my-2 border-t border-border" />

          <p className="px-4 py-1 text-label">Account</p>
          {secondaryNavItems.map((item) => (
            <DrawerNavLink key={item.href} item={item} onNavigate={close} />
          ))}
        </nav>

        <div className="shrink-0 space-y-2 border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-full px-4 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-muted text-xs font-semibold text-primary">
              {user.initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-text">
                {user.displayName}
              </p>
              <p className="truncate text-caption">{user.email}</p>
            </div>
          </div>
          <LogoutButton className="w-full" />
        </div>
      </aside>
    </div>
  );
}
