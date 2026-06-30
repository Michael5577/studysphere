import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import type { AppUser } from "@/lib/auth";

interface MainLayoutProps {
  children: React.ReactNode;
  user: AppUser;
}

export function MainLayout({ children, user }: MainLayoutProps) {
  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <Sidebar user={user} className="hidden lg:flex" />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopNav user={user} />
        <main className="flex-1 overflow-y-auto pb-[var(--mobile-nav-height)] lg:pb-0">
          {children}
        </main>
      </div>

      <MobileNav className="lg:hidden" />
    </div>
  );
}
