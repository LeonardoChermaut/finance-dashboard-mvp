'use client';

import { GlobalStyle } from '@/styles/global-style';
import { ThemeProvider } from '@/theme/theme-provider';
import { useServerInsertedHTML } from 'next/navigation';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import { Toaster } from 'sonner';

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
        <Toaster richColors position="top-right" />
        {children}
      </ThemeProvider>
    </StyleSheetManager>
  );
};
