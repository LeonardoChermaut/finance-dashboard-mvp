'use client';

import { GlobalStyle } from '@/styles/global-style';
import { ThemeProvider } from '@/theme/theme-provider';
import { useServerInsertedHTML } from 'next/navigation';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

type StyledRegistryProps = {
  children: ReactNode;
};

export const StyledRegistry = ({ children }: StyledRegistryProps) => {
  const [styledComponentsStyleSheet, __] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      <ThemeProvider>
        <GlobalStyle />
        <Toaster richColors position="top-right" expand={false} visibleToasts={1} duration={1500} />
        {children}
      </ThemeProvider>
    </StyleSheetManager>
  );
};
