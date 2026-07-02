'use client';

import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'ghost' | 'danger';

type ButtonProps = {
  readonly $variant?: ButtonVariant;
};

const variantStyles = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.surface};

    &:hover {
      background-color: ${({ theme }) => theme.colors.primaryHover};
    }

    &:active {
      transform: scale(0.98);
    }

    &:disabled {
      background-color: ${({ theme }) => theme.colors.muted};
    }
  `,
  ghost: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.text};

    &:hover {
      background-color: ${({ theme }) => theme.colors.sidebarHover};
    }

    &:active {
      background-color: ${({ theme }) => theme.colors.border};
    }
  `,
  danger: css`
    background-color: ${({ theme }) => theme.colors.expense};
    color: #ffffff;

    &:hover {
      opacity: 0.9;
    }

    &:active {
      transform: scale(0.98);
    }
  `,
};

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(5)}`};
  border: none;
  border-radius: ${({ theme }) => theme.radius.button};
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  transition: background-color 0.15s ease, transform 0.1s ease, opacity 0.15s ease;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${({ $variant = 'primary' }) => variantStyles[$variant]}
`;
