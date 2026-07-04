import { Card } from '@/components/ui/card';
import { breakpoints } from '@/constants/breakpoints';
import styled from 'styled-components';

export const Wrapper = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

export const ClearAllButton = styled.button`
  align-self: flex-end;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.danger};
  padding: ${({ theme }) => `${theme.spacing(1)} 0`};

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.danger};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

export const AccordionHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(1)}`};
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

export const HeaderLeft = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 ${({ theme }) => theme.spacing(2)};
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.surface};
  font-size: 11px;
  font-weight: 700;
`;

export const ChevronIcon = styled.span<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

export const AccordionContent = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  padding-bottom: ${({ theme }) => theme.spacing(3)};
`;

export const DateRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};

  @media (min-width: ${breakpoints.mobile}) {
    flex-direction: row;
  }
`;

export const DateField = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  flex: 1;
`;

export const DateInput = styled.input`
  padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(3)}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.input};
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryMuted};
    outline: none;
  }

  &::-webkit-calendar-picker-indicator {
    filter: ${({ theme }) => (theme.colorScheme === 'dark' ? 'invert(1)' : 'none')};
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const SearchIcon = styled.span`
  position: absolute;
  left: ${({ theme }) => theme.spacing(3)};
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.muted};
  pointer-events: none;
`;

export const SearchInput = styled.input`
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

  &::-webkit-calendar-picker-indicator {
    filter: ${({ theme }) => (theme.colorScheme === 'dark' ? 'invert(1)' : 'none')};
  }
`;

export const ClearSearchButton = styled.button`
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

export const SelectActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const SelectAllButton = styled.button`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => `${theme.spacing(1)} 0`};
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

export const ClearSelectionButton = styled.button`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.danger};
  padding: ${({ theme }) => `${theme.spacing(1)} 0`};

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.danger};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

export const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const Chip = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(3)}`};
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  border-radius: 999px;
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.surface};
  color: ${({ theme, $active }) => ($active ? theme.colors.surface : theme.colors.text)};
  font-size: 13px;
  font-weight: 500;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme, $active }) =>
      $active ? theme.colors.primaryHover : theme.colors.primaryMuted};
    color: ${({ theme, $active }) => ($active ? theme.colors.surface : theme.colors.primary)};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const ChipRemove = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 10px;
  margin-left: ${({ theme }) => theme.spacing(1)};
  flex-shrink: 0;
`;

export const ClearDateButton = styled.button`
  align-self: flex-start;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.danger};
  padding: ${({ theme }) => `${theme.spacing(1)} 0`};

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.danger};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

export const EmptyState = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  padding: ${({ theme }) => `${theme.spacing(2)} 0`};
`;
