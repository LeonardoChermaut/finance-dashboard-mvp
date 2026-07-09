import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

export type LinksContainerProps = {
  $justify?: 'center' | 'space-between' | 'flex-start';
};

export const LinksContainer = styled.div<LinksContainerProps>`
  display: flex;
  justify-content: ${({ $justify }) => $justify ?? 'space-between'};
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

export const LinkButton = styled.button`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: color 0.15s ease;
  cursor: pointer;
  border: none;
  background: none;
  padding: ${({ theme }) => `${theme.spacing(1)} 0`};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

export type SuccessMessageProps = {
  $padding?: boolean;
};

export const SuccessMessage = styled.p<SuccessMessageProps>`
  color: ${({ theme }) => theme.colors.success};
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  padding: ${({ $padding, theme }) => ($padding ? `${theme.spacing(3)} 0` : '0')};
`;
