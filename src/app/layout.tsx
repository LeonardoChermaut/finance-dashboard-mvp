import { THEME_STORAGE_KEY } from '@/constants/config';
import { StyledRegistry } from '@/styles/styled-registry';
import type { ThemeMode } from '@/theme/theme-provider';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { cookies } from 'next/headers';
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
      var supportDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches === true;
      var activeMode = (mode === 'dark' || (!mode && supportDarkMode)) ? 'dark' : 'light';
      document.documentElement.classList.add('theme-' + activeMode);
      document.documentElement.setAttribute('data-theme', activeMode);
      document.documentElement.style.colorScheme = activeMode;
      document.cookie = 'financial_dashboard_theme=' + activeMode + '; path=/; max-age=31536000; SameSite=Lax';
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

const RootLayout = async ({ children }: RootLayoutProps) => {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get(THEME_STORAGE_KEY)?.value;
  const initialTheme: ThemeMode = themeCookie === 'dark' ? 'dark' : 'light';

  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} theme-${initialTheme}`}
      data-theme={initialTheme}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`theme-${initialTheme}`} suppressHydrationWarning>
        <StyledRegistry initialTheme={initialTheme}>{children}</StyledRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
