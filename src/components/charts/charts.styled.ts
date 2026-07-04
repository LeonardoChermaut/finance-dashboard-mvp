import { Card } from '@/components/ui/card';
import { breakpoints } from '@/constants/breakpoints';
import styled from 'styled-components';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme: appTheme }) => appTheme.spacing(4)};
  max-width: 100%;
  overflow: hidden;

  @media (min-width: ${breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const FullWidthGrid = styled.div`
  grid-column: 1 / -1;
  min-width: 0;
`;

export const ChartCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme: appTheme }) => appTheme.spacing(4)};
  overflow: hidden;
  min-width: 0;
  max-width: 100%;
`;

export const ChartTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
`;

export const ChartDescription = styled.p`
  font-size: 13px;
  color: ${({ theme: appTheme }) => appTheme.colors.muted};
`;

export const ChartArea = styled.div`
  position: relative;
  height: 260px;
  width: 100%;
  min-width: 0;
  overflow: hidden;

  canvas {
    max-width: 100% !important;
    display: block;
  }

  @media (min-width: ${breakpoints.tablet}) {
    height: 320px;
  }
`;

export const DoughnutArea = styled.div`
  position: relative;
  height: 180px;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  canvas {
    max-width: 100% !important;
    display: block;
  }

  @media (min-width: ${breakpoints.tablet}) {
    height: 200px;
  }
`;

export const StatsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme: appTheme }) => appTheme.spacing(3)};
  min-width: 0;

  @media (min-width: ${breakpoints.tablet}) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${({ theme: appTheme }) => appTheme.spacing(4)};
  }
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme: appTheme }) => appTheme.spacing(1)};
  text-align: center;
`;

export const StatLabel = styled.span`
  font-size: 12px;
  color: ${({ theme: appTheme }) => appTheme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const StatValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme: appTheme }) => appTheme.colors.text};
`;

export const ClearFilterInline = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const ClearFilterInlineButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme: appTheme }) => appTheme.spacing(1)};
  padding: ${({ theme: appTheme }) => `${appTheme.spacing(1)} ${appTheme.spacing(3)}`};
  border-radius: 999px;
  border: 1px solid ${({ theme: appTheme }) => appTheme.colors.border};
  background-color: ${({ theme: appTheme }) => appTheme.colors.surface};
  color: ${({ theme: appTheme }) => appTheme.colors.textSecondary};
  font-size: 12px;
  font-weight: 600;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    border-color: ${({ theme: appTheme }) => appTheme.colors.primary};
    color: ${({ theme: appTheme }) => appTheme.colors.primary};
    background-color: ${({ theme: appTheme }) => appTheme.colors.primaryMuted};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme: appTheme }) => appTheme.colors.primary};
    outline-offset: 2px;
  }
`;
