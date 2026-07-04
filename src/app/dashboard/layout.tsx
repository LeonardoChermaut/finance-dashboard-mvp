'use client';

import { Sidebar } from '@/components/sidebar/sidebar';
import type { ReactNode } from 'react';
import { Layout } from './dashboard.styled';

type DashboardLayoutProps = {
  readonly children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => (
  <Layout>
    <Sidebar />
    {children}
  </Layout>
);

export default DashboardLayout;
