'use client';

import {
  CurrentDate,
  HeaderActions,
  HeaderText,
  HeaderTop,
  PageDescription,
  PageHeader,
  PageTitle,
} from './dashboard-header.styled';

type DashboardHeaderProps = {
  currentDate: string;
};

export const DashboardHeader = ({ currentDate }: DashboardHeaderProps) => (
  <PageHeader>
    <HeaderTop>
      <HeaderText>
        <PageTitle>Visão Geral</PageTitle>
        <PageDescription>
          Resumo financeiro atualizado conforme os filtros selecionados.
        </PageDescription>
      </HeaderText>
      <CurrentDate>{currentDate}</CurrentDate>
    </HeaderTop>
    <HeaderActions></HeaderActions>
  </PageHeader>
);
