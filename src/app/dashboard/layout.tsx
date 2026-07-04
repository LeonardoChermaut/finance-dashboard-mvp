'use client';

import { Sidebar } from '@/components/sidebar/sidebar';
import { useAuthStore } from '@/modules/auth';
import type { ReactNode } from 'react';
import { Layout } from './dashboard.styled';

type DashboardLayoutProps = {
  readonly children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <Sidebar />
      {children}
    </Layout>
  );
};

export default DashboardLayout;
