'use client';

import { Sidebar } from '@/components/sidebar/sidebar';
import { Layout } from './dashboard.styled';
import type { ReactNode } from 'react';

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
