'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { AppStateProvider } from '@/lib/app-state';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMarketingPage = pathname === '/';

  return (
    <AppStateProvider>
      {isMarketingPage ? (
        <div className="min-h-screen bg-slate-950 text-slate-50">{children}</div>
      ) : (
        <div className="grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-[290px_1fr]">
          <Sidebar />
          <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),_transparent_35%),linear-gradient(to_bottom,_#f8fafc,_#eef2ff)] p-5 lg:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      )}
    </AppStateProvider>
  );
}
