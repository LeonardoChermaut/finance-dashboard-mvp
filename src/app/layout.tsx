import { StyledRegistry } from '@/styles/styled-registry';
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

const themeScript = `
  (function() {
    try {
      var stored = localStorage.getItem('financial_dashboard_theme');
      var theme = stored === 'dark' || stored === 'light' ? stored : 'light';
      if (theme === 'dark') {
        document.documentElement.style.backgroundColor = '#0a0a0f';
        document.documentElement.style.color = '#e5e5e5';
      }
    } catch(e) {}
  })();
`;

type RootLayoutProps = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="pt-BR" className={geistSans.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <StyledRegistry>{children}</StyledRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
