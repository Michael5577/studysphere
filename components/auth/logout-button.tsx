"use client";

import { signOut } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { useTransition, type ReactNode } from "react";

interface LogoutButtonProps {
  variant?: "default" | "menu";
  className?: string;
  children?: ReactNode;
}

export function LogoutButton({
  variant = "default",
  className,
  children,
}: LogoutButtonProps) {
  const [pending, startTransition] = useTransition();

  if (variant === "menu") {
    return (
      <button
        type="button"
        role="menuitem"
        disabled={pending}
        onClick={(event) => {
          event.stopPropagation();
          startTransition(() => signOut());
        }}
        className={cn(
          "flex w-full items-center text-left text-text transition-default hover:bg-background focus-visible:bg-background focus-ring disabled:opacity-50",
          className,
        )}
      >
        {pending ? "Signing out…" : children}
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("w-full justify-start text-muted", className)}
      disabled={pending}
      onClick={() => startTransition(() => signOut())}
    >
      <LogOut className="h-4 w-4" />
      {pending ? "Signing out…" : "Sign out"}
    </Button>
  );
}
