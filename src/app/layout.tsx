import { StyledRegistry } from '@/lib/styled-registry';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import type { ReactNode } from 'react';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Dashboard Financeiro',
  description: 'Dashboard financeiro com filtros dinamicos, cards de resumo e graficos reativos.',
};

type RootLayoutProps = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="pt-BR" className={geistSans.variable}>
      <body>
        <StyledRegistry>{children}</StyledRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
