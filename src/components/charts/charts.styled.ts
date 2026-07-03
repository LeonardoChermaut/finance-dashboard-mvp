import { Card } from '@/components/ui/card';
import styled from 'styled-components';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme: appTheme }) => appTheme.spacing(4)};

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const FullWidthGrid = styled.div`
  grid-column: 1 / -1;
`;

export const ChartCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme: appTheme }) => appTheme.spacing(4)};
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
  height: 320px;
`;

export const DoughnutArea = styled.div`
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme: appTheme }) => appTheme.spacing(4)};
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
