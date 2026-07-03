'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import styled from 'styled-components';

const DashboardSkeletonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(5)};
`;

const HeaderSkeletonRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(4)};
`;

const HeaderTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const QuickFiltersSkeletonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const SummaryCardsSkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing(4)};

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const SummaryCardSkeleton = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const SummaryCardHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChartsSkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing(4)};

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FullWidthChartSkeleton = styled.div`
  grid-column: 1 / -1;
`;

const ChartCardSkeleton = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

const ChartSkeletonArea = styled.div`
  height: 320px;
`;

const DoughnutSkeletonArea = styled.div`
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatsSkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing(4)};
`;

const StatSkeletonItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const SUMMARY_CARDS_COUNT = 4;
const QUICK_FILTERS_COUNT = 4;
const STATS_COUNT = 3;

const SummaryCardSkeletonItem = () => (
  <SummaryCardSkeleton>
    <SummaryCardHeaderRow>
      <Skeleton.TextLine width="60px" />
      <Skeleton.Circle size="40px" />
    </SummaryCardHeaderRow>
    <Skeleton.Block height="28px" width="120px" />
    <Skeleton.TextLine width="100%" />
    <Skeleton.TextLine width="80px" />
  </SummaryCardSkeleton>
);

export const DashboardSkeleton = () => (
  <DashboardSkeletonWrapper>
    <HeaderSkeletonRow>
      <HeaderTextGroup>
        <Skeleton.Block height="32px" width="180px" />
        <Skeleton.TextLine width="280px" />
      </HeaderTextGroup>
      <Skeleton.TextLine width="80px" />
    </HeaderSkeletonRow>

    <Skeleton.Block height="36px" width="100px" />

    <QuickFiltersSkeletonRow>
      {Array.from({ length: QUICK_FILTERS_COUNT }).map((_unused, index) => (
        <Skeleton.Block key={index} height="32px" width="110px" borderRadius="999px" />
      ))}
    </QuickFiltersSkeletonRow>

    <Skeleton.Block height="48px" width="100%" />

    <SummaryCardsSkeletonGrid>
      {Array.from({ length: SUMMARY_CARDS_COUNT }).map((_unused, index) => (
        <SummaryCardSkeletonItem key={index} />
      ))}
    </SummaryCardsSkeletonGrid>

    <ChartsSkeletonGrid>
      <FullWidthChartSkeleton>
        <ChartCardSkeleton>
          <Skeleton.TextLine width="160px" />
          <Skeleton.TextLine width="220px" />
          <ChartSkeletonArea>
            <Skeleton.Block height="100%" />
          </ChartSkeletonArea>
        </ChartCardSkeleton>
      </FullWidthChartSkeleton>

      <ChartCardSkeleton>
        <Skeleton.TextLine width="140px" />
        <Skeleton.TextLine width="200px" />
        <ChartSkeletonArea>
          <Skeleton.Block height="100%" />
        </ChartSkeletonArea>
      </ChartCardSkeleton>

      <ChartCardSkeleton>
        <Skeleton.TextLine width="120px" />
        <Skeleton.TextLine width="180px" />
        <DoughnutSkeletonArea>
          <Skeleton.Circle size="160px" />
        </DoughnutSkeletonArea>
        <StatsSkeletonGrid>
          {Array.from({ length: STATS_COUNT }).map((_unused, index) => (
            <StatSkeletonItem key={index}>
              <Skeleton.TextLine width="60px" />
              <Skeleton.Block height="24px" width="80px" />
            </StatSkeletonItem>
          ))}
        </StatsSkeletonGrid>
      </ChartCardSkeleton>
    </ChartsSkeletonGrid>
  </DashboardSkeletonWrapper>
);
