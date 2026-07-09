import { Skeleton } from '@/components/ui/skeleton';

import {
  DashboardSkeletonWrapper,
  HeaderSkeletonRow,
  HeaderTextGroup,
  QuickFiltersSkeletonRow,
  SummaryCardsSkeletonGrid,
  SummaryCardSkeleton,
  SummaryCardHeaderRow,
  ChartsSkeletonGrid,
  FullWidthChartSkeleton,
  ChartCardSkeleton,
  ChartSkeletonArea,
  DoughnutSkeletonArea,
  StatsSkeletonGrid,
  StatSkeletonItem,
} from './dashboard-skeleton.styled';

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
