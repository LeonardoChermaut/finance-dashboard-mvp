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
  description: 'Dashboard financeiro com filtros dinâmicos, cards de resumo e gráficos reativos.',
};

const themeScript = `
  (function() {
    try {
      var rawMode = localStorage.getItem('financial_dashboard_theme');
      var mode = rawMode ? rawMode.replace(/"/g, '') : null;
      var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
      var activeMode = (mode === 'dark' || (!mode && supportDarkMode)) ? 'dark' : 'light';
      document.documentElement.classList.add('theme-' + activeMode);
      document.documentElement.setAttribute('data-theme', activeMode);
      document.documentElement.style.colorScheme = activeMode;
    } catch (error) {
      document.documentElement.classList.add('theme-light');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.style.colorScheme = 'light';
    }
  })();
`;

type RootLayoutProps = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="pt-BR" className={geistSans.variable} suppressHydrationWarning>
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
