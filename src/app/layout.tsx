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
      var mode = localStorage.getItem('financial_dashboard_theme');
      var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
      if (!mode && supportDarkMode) {
        document.body.classList.add('theme-dark');
      } else if (mode === 'dark') {
        document.body.classList.add('theme-dark');
      } else {
        document.body.classList.add('theme-light');
      }
    } catch(e) {
      document.body.classList.add('theme-light');
    }
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
