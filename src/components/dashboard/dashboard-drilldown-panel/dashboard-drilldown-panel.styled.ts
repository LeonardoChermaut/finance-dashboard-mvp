import styled from 'styled-components';

export const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
`;

export const DrilldownOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: ${({ theme }) => theme.colors.overlay};
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(4)};
`;

export const DrilldownPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.card};
  padding: ${({ theme }) => theme.spacing(6)};
  overflow-y: auto;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
`;

export const DrilldownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const DrilldownTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const DrilldownActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const DrilldownExportBtn = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(3)}`};
  border-radius: ${({ theme }) => theme.radius.button};
  background-color: ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.surface};
  font-size: 12px;
  font-weight: 600;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.success};
    outline-offset: 2px;
  }
`;

export const DrilldownClose = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.muted};
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.sidebarHover};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const DrilldownSearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const DrilldownSearchIcon = styled.span`
  position: absolute;
  left: ${({ theme }) => theme.spacing(3)};
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.muted};
  pointer-events: none;
`;

export const DrilldownSearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) =>
    `${theme.spacing(2)} ${theme.spacing(3)} ${theme.spacing(2)} ${theme.spacing(10)}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.input};
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryMuted};
    outline: none;
  }
`;

export const DrilldownClearSearch = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing(2)};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.muted};
  transition:
    color 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.sidebarHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const DrilldownTotal = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(4)}`};
  background-color: ${({ theme }) => theme.colors.sidebarHover};
  border-radius: ${({ theme }) => theme.radius.input};
`;

export const DrilldownTotalLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const DrilldownTotalValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const TransactionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(4)}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.input};
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const TransactionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const TransactionAccount = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const TransactionMeta = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

export const TransactionValue = styled.span<{ $type: 'deposit' | 'withdraw' }>`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme, $type }) =>
    $type === 'deposit' ? theme.colors.income : theme.colors.expense};
`;

export const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${({ theme }) => theme.spacing(3)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const PaginationInfo = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

export const PaginationButtons = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

export const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.sidebarHover};
    color: ${({ theme }) => theme.colors.text};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const PaginationPageButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme, $active }) => ($active ? theme.colors.surface : theme.colors.textSecondary)};
  background-color: ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme, $active }) =>
      $active ? theme.colors.primaryHover : theme.colors.sidebarHover};
    color: ${({ theme, $active }) => ($active ? theme.colors.surface : theme.colors.text)};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;
