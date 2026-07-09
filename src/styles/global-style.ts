import { mediaQuery } from '@/constants/breakpoints';
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    -webkit-text-size-adjust: 100%;
  }

  html,
  body {
    height: 100%;
    overflow-x: hidden;
  }

  body.theme-light {
    --color-background: #f8fafc;
    --color-text: #0f172a;
  }

  body.theme-dark {
    --color-background: #0f172a;
    --color-text: #f1f5f9;
  }

  html {
    background-color: var(--color-background, #f8fafc);
  }

  body {
    background-color: var(--color-background, #f8fafc);
    color: var(--color-text, #0f172a);
    font-family: var(--font-sans), system-ui, -apple-system, sans-serif;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color-scheme: ${({ theme }) => theme.colorScheme};
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
  }

  input,
  select,
  textarea {
    font-family: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  @media ${mediaQuery.tablet} {
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    ::-webkit-scrollbar-track {
      background: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background-color: ${({ theme }) => theme.colors.border};
      border-radius: 3px;
    }
  }
`;
