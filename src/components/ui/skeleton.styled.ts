import styled, { css, keyframes } from 'styled-components';

export const shimmerAnimation = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const shimmerBase = css`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.skeleton} 25%,
    ${({ theme }) => theme.colors.border} 50%,
    ${({ theme }) => theme.colors.skeleton} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmerAnimation} 1.5s infinite ease-in-out;
  border-radius: ${({ theme }) => theme.radius.input};
`;

export const SkeletonBlockElement = styled.div<{
  $width?: string;
  $height?: string;
  $borderRadius?: string;
}>`
  ${shimmerBase}
  width: ${({ $width }) => $width ?? '100%'};
  height: ${({ $height }) => $height ?? '20px'};
  border-radius: ${({ $borderRadius, theme }) => $borderRadius ?? theme.radius.input};
`;

export const SkeletonCircleElement = styled.div<{
  $size?: string;
}>`
  ${shimmerBase}
  width: ${({ $size }) => $size ?? '40px'};
  height: ${({ $size }) => $size ?? '40px'};
  border-radius: 50%;
  flex-shrink: 0;
`;

export const SkeletonTextLineElement = styled.div<{
  $width?: string;
}>`
  ${shimmerBase}
  width: ${({ $width }) => $width ?? '100%'};
  height: 14px;
  border-radius: 4px;
`;
