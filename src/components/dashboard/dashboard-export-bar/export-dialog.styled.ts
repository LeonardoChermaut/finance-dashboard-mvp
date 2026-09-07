import styled from 'styled-components';

export const Overlay = styled.div`
  inset: 0;
  z-index: 50;
  display: flex;
  position: fixed;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  padding: ${({ theme }) => theme.spacing(4)};
`;

export const Dialog = styled.div`
  width: 100%;
  overflow: hidden;
  max-width: 400px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.input};
  box-shadow: ${({ theme }) => theme.colors.cardHoverShadow};
`;

export const DialogHeader = styled.div`
  padding: ${({ theme }) => `${theme.spacing(5)} ${theme.spacing(5)} ${theme.spacing(2)}`};
`;

export const DialogTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const DialogDescription = styled.p`
  font-size: 13px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

export const DialogBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(5)}`};
`;

export const DialogOption = styled.button`
  display: flex;
  width: 100%;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radius.input};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(4)}`};
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.sidebarHover};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(5)} ${theme.spacing(5)}`};
`;

export const DialogCancelButton = styled.button`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  border-radius: ${({ theme }) => theme.radius.button};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(4)}`};
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.sidebarHover};
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;
