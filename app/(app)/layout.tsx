import { MainLayout } from "@/components/layout/main-layout";
import { getUserDisplay } from "@/lib/auth";
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

  return <MainLayout user={appUser}>{children}</MainLayout>;
}
