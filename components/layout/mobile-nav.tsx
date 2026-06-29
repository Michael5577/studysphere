"use client";

import { cn } from "@/lib/utils";
import { primaryNavItems } from "@/types/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 flex h-[var(--mobile-nav-height)] items-stretch border-t border-border bg-surface",
        className,
      )}
      aria-label="Mobile navigation"
    >
      {primaryNavItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 transition-default focus-ring",
              isActive ? "text-primary" : "text-muted",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <item.icon
              className="h-5 w-5"
              strokeWidth={isActive ? 2 : 1.5}
            />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
