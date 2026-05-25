import React from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { GlobalFilterBar } from './GlobalFilterBar';

interface Props {
  children: React.ReactNode;
}

export function AppLayout({ children }: Props) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F7FA' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <TopHeader />
        <GlobalFilterBar />
        <main style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          padding: '28px 28px',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
