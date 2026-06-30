import type { User } from "@supabase/supabase-js";

export interface AppUser {
  email: string;
  displayName: string;
  initials: string;
}

export function getUserDisplay(user: User): AppUser {
  const email = user.email ?? "";
  const displayName =
    (user.user_metadata?.full_name as string | undefined) ||
    email.split("@")[0] ||
    "Student";

  const initials = displayName
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    email,
    displayName,
    initials: initials || "SS",
  };
}
