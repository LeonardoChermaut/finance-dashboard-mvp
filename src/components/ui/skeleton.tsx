import {
  SkeletonBlockElement,
  SkeletonCircleElement,
  SkeletonTextLineElement,
} from './skeleton.styled';

type SkeletonBlockProps = {
  width?: string;
  height?: string;
  borderRadius?: string;
};

type SkeletonCircleProps = {
  size?: string;
};

type SkeletonTextLineProps = {
  width?: string;
};

export const Skeleton = {
  Block: ({ width, height, borderRadius }: SkeletonBlockProps) => (
    <SkeletonBlockElement $width={width} $height={height} $borderRadius={borderRadius} />
  ),
  Circle: ({ size }: SkeletonCircleProps) => <SkeletonCircleElement $size={size} />,
  TextLine: ({ width }: SkeletonTextLineProps) => <SkeletonTextLineElement $width={width} />,
};
