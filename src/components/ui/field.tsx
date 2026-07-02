'use client';

import type { InputHTMLAttributes } from 'react';
import styled from 'styled-components';

const FieldWrapper = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Input = styled.input`
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(4)}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.input};
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;
  font-weight: 400;
  line-height: 1.5;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryMuted};
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  readonly label: string;
};

export const Field = ({ label, id, ...inputProps }: FieldProps) => {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <FieldWrapper htmlFor={fieldId}>
      {label}
      <Input id={fieldId} {...inputProps} />
    </FieldWrapper>
  );
};
