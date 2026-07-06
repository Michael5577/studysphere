"use client";

import { AssistantPanel } from "@/components/assistant/assistant-panel";
import { AssistantProvider } from "@/components/assistant/assistant-provider";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import type { AppUser } from "@/lib/auth";

interface MainLayoutProps {
  children: React.ReactNode;
  user: AppUser;
  compactMode?: boolean;
}

function MainLayoutInner({
  children,
  user,
  compactMode = false,
}: MainLayoutProps) {
  return (
    <div className="app-shell" data-compact={compactMode ? "true" : undefined}>
      <Sidebar user={user} className="hidden lg:flex" />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopNav user={user} />
        <main className="app-main-scroll">
          <div className="app-page-inner">{children}</div>
        </main>
      </div>

      <MobileNav className="app-mobile-nav lg:hidden" />
      <AssistantPanel />
    </div>
  );
}

export function MainLayout(props: MainLayoutProps) {
  return (
    <AssistantProvider>
      <MainLayoutInner {...props} />
    </AssistantProvider>
  );
}
