import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-[100dvh] w-full flex-col bg-background">
      <Header />
      <main className="flex-1 overflow-y-auto scroll-smooth-ios">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
