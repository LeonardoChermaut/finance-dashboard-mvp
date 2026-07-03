import { Card } from '@/components/ui/card';
import styled from 'styled-components';

export const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const Grid = styled.div<{ $isMobile: boolean }>`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing(4)};

  ${({ $isMobile }) =>
    $isMobile &&
    `
    grid-template-columns: 1fr;
  `}

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at 50% 0%,
      ${({ theme }) => theme.colors.primaryMuted} 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.25s ease;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow:
      ${({ theme }) => theme.colors.cardHoverShadow},
      0 0 20px ${({ theme }) => theme.colors.primaryMuted};

    &::before {
      opacity: 0.35;
    }
  }

  &:active {
    transform: translateY(-1px);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CardIcon = styled.div<{
  readonly $tone: 'income' | 'expense' | 'pending' | 'balance';
  readonly $balanceVariant?: 'positive' | 'negative' | 'zero';
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: ${({ theme, $tone, $balanceVariant }) => {
    if ($tone === 'income') {
      return theme.colors.incomeMuted;
    }
    if ($tone === 'expense') {
      return theme.colors.expenseMuted;
    }
    if ($tone === 'pending') {
      return theme.colors.warningMuted;
    }
    if ($balanceVariant === 'negative') {
      return theme.colors.dangerMuted;
    }
    if ($balanceVariant === 'zero') {
      return theme.colors.warningMuted;
    }

    return theme.colors.successMuted;
  }};

  color: ${({ theme, $tone, $balanceVariant }) => {
    if ($tone === 'income') {
      return theme.colors.income;
    }
    if ($tone === 'expense') {
      return theme.colors.expense;
    }
    if ($tone === 'pending') {
      return theme.colors.warning;
    }
    if ($balanceVariant === 'negative') {
      return theme.colors.danger;
    }
    if ($balanceVariant === 'zero') {
      return theme.colors.warning;
    }

    return theme.colors.success;
  }};
`;

export const CardLabel = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const TotalLabel = styled(CardLabel)`
  padding: 2px 8px;
  border-radius: 4px;
`;

export const CardValue = styled.p`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.2;
`;

export const CardDescription = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.4;
`;

export const CardVariation = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

export const NavigationButton = styled.button<{ readonly $direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $direction }) => ($direction === 'left' ? 'left: -12px;' : 'right: -12px;')}
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${({ theme }) => theme.colors.sectionDivider};
    transform: translateY(-50%) scale(1.05);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: translateY(-50%);
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

export const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: ${({ theme }) => theme.spacing(3)};

  @media (min-width: 1024px) {
    display: none;
  }
`;

export const Dot = styled.button<{ readonly $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.border};

  &:hover {
    transform: scale(1.2);
  }
`;

export const MobileCardContainer = styled.div`
  display: block;

  @media (min-width: 480px) {
    display: none;
  }
`;

export const TabletCardContainer = styled.div`
  display: none;

  @media (min-width: 480px) and (max-width: 1023px) {
    display: block;
  }
`;

export const DesktopCardContainer = styled.div`
  display: none;

  @media (min-width: 1024px) {
    display: block;
  }
`;
