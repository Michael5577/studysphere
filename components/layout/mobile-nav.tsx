"use client";

import { cn } from "@/lib/utils";
import { primaryNavItems } from "@/types/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn(className)} aria-label="Mobile navigation">
      {primaryNavItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            className={cn(
              "relative flex min-h-[44px] flex-1 touch-manipulation flex-col items-center justify-center gap-1 rounded-full px-1 py-1.5 transition-all duration-300 focus-ring active:scale-95",
              isActive ? "text-primary" : "text-muted",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {isActive && (
              <span
                className="absolute inset-x-2 top-0 h-0.5 rounded-full bg-primary transition-all duration-300"
                aria-hidden
              />
            )}
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300",
                isActive && "scale-110 bg-primary-muted shadow-[var(--shadow-subtle)]",
              )}
            >
              <item.icon
                className="h-5 w-5 shrink-0"
                strokeWidth={isActive ? 2 : 1.5}
              />
            </span>
            <span className="max-w-full truncate text-[10px] font-semibold leading-none">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
