"use client";

import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";
import { Bell } from "lucide-react";

export function NotificationPopover() {
  return (
    <Popover
      label="Notifications"
      align="right"
      contentClassName="w-72 p-0"
      trigger={({ open, onToggle, panelId }) => (
        <Button
          variant="ghost"
          size="sm"
          aria-label="Notifications"
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls={panelId}
          onClick={onToggle}
        >
          <Bell className="h-4 w-4" />
        </Button>
      )}
    >
      <div
        className="px-4 py-6 text-center"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-[var(--radius)] bg-background text-muted">
          <Bell className="h-4 w-4" strokeWidth={1.5} />
        </div>
        <p className="text-sm font-semibold text-text">No notifications yet</p>
        <p className="mt-1 text-caption">
          Assignment reminders will appear here.
        </p>
      </div>
    </Popover>
  );
}
