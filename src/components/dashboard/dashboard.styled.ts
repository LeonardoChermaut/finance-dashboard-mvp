import { breakpoints } from '@/constants/breakpoints';
import styled from 'styled-components';

export const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  overflow-x: hidden;
`;

export const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow-x: hidden;

  @media (min-width: ${breakpoints.tablet}) {
    margin-left: 64px;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(5)};
  padding: ${({ theme }) => theme.spacing(3)};
  padding-top: ${({ theme }) => theme.spacing(16)};
  max-width: 100%;
  overflow-x: hidden;

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing(6)};
    padding-top: ${({ theme }) => theme.spacing(6)};
  }
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

export const SectionDescription = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;
