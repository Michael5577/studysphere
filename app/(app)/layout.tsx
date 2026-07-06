import { MainLayout } from "@/components/layout/main-layout";
import { ThemeSync } from "@/components/theme/theme-sync";
import { getUserDisplay } from "@/lib/auth";
import {
  ensureUserPreferences,
  getUserPreferences,
} from "@/lib/db/preferences";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const appUser = getUserDisplay(user);
  const preferences =
    (await getUserPreferences()) ??
    (await ensureUserPreferences(user.id));

  return (
    <>
      <ThemeSync
        colorScheme={preferences.color_scheme ?? "system"}
        backgroundStyle={preferences.background_style ?? "vivid"}
      />
      <MainLayout user={appUser} compactMode={preferences.compact_mode}>
        {children}
      </MainLayout>
    </>
  );
}
