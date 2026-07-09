import styled, { keyframes } from 'styled-components';
import { breakpoints } from '@/constants/breakpoints';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing(4)} ${theme.spacing(4)}`};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${({ theme }) => `${theme.spacing(5)} ${theme.spacing(6)}`};
  }
`;

export const NavLogo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const LogoText = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing(10)} ${theme.spacing(4)}`};
  max-width: 800px;
  margin: 0 auto;
  animation: ${fadeInUp} 0.6s ease;

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${({ theme }) => `${theme.spacing(16)} ${theme.spacing(6)}`};
  }
`;

export const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(3)}`};
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.primaryMuted};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

export const HeroTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-bottom: ${({ theme }) => theme.spacing(4)};

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 44px;
  }
`;

export const HeroHighlight = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

export const HeroDescription = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  max-width: 560px;
  margin-bottom: ${({ theme }) => theme.spacing(8)};

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 17px;
  }
`;

export const HeroActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  width: 100%;

  @media (min-width: 480px) {
    flex-direction: row;
    justify-content: center;
  }
`;

export const SectionDivider = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    ${({ theme }) => theme.colors.border},
    transparent
  );
`;

export const StatsSection = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => `${theme.spacing(10)} ${theme.spacing(4)}`};
  max-width: 800px;
  margin: 0 auto;
  width: 100%;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(4, 1fr);
    padding: ${({ theme }) => `${theme.spacing(12)} ${theme.spacing(6)}`};
  }
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

export const StatValue = styled.p`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 36px;
  }
`;

export const StatLabel = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 500;
`;

export const FeaturesSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
  padding: ${({ theme }) => `${theme.spacing(12)} ${theme.spacing(4)}`};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.sectionDivider};

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${({ theme }) => `${theme.spacing(16)} ${theme.spacing(6)}`};
  }
`;

export const SectionLabel = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

export const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  letter-spacing: -0.02em;

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 32px;
  }
`;

export const SectionDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.6;
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing(4)};
  margin-top: ${({ theme }) => theme.spacing(6)};

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${({ theme }) => theme.spacing(5)};
  }
`;

export const CtaSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing(14)} ${theme.spacing(4)}`};
  max-width: 700px;
  margin: 0 auto;
  width: 100%;

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${({ theme }) => `${theme.spacing(20)} ${theme.spacing(6)}`};
  }
`;

export const CtaTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.02em;
  margin-bottom: ${({ theme }) => theme.spacing(3)};

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 32px;
  }
`;

export const CtaDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing(6)};
`;

export const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => `${theme.spacing(8)} ${theme.spacing(4)}`};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: auto;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const FooterText = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;
