"use client";

import { LogoutButton } from "@/components/auth/logout-button";
import { Popover, PopoverLink } from "@/components/ui/popover";
import type { AppUser } from "@/lib/auth";
import { LogOut, Settings, User } from "lucide-react";

interface UserMenuProps {
  user: AppUser;
}

export function UserMenu({ user }: UserMenuProps) {
  return (
    <Popover
      label="Account menu"
      align="right"
      contentClassName="w-52"
      trigger={({ open, onToggle, panelId }) => (
        <button
          type="button"
          className="ml-1 flex h-8 w-8 items-center justify-center rounded-[var(--radius)] bg-primary-muted text-xs font-semibold text-primary transition-default hover:bg-primary/10 focus-ring"
          aria-label="Account menu"
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls={panelId}
          onClick={onToggle}
        >
          {user.initials}
        </button>
      )}
    >
      <div className="border-b border-border px-3 py-2.5">
        <p className="truncate text-sm font-medium text-text">
          {user.displayName}
        </p>
        <p className="truncate text-caption">{user.email}</p>
      </div>

      <PopoverLink href="/profile">
        <User className="h-4 w-4 text-muted" />
        Profile
      </PopoverLink>

      <PopoverLink href="/settings">
        <Settings className="h-4 w-4 text-muted" />
        Settings
      </PopoverLink>

      <div className="border-t border-border p-1">
        <LogoutButton variant="menu" className="gap-2 px-3 py-2 text-sm">
          <LogOut className="h-4 w-4 text-muted" />
          Sign out
        </LogoutButton>
      </div>
    </Popover>
  );
}
