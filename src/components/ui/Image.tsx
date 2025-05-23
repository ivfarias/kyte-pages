import { type FC } from 'react';

type ImageSize = 'xsmall' | 'small' | 'large' | 'auto';

interface ImageProps {
  src: string;
  alt: string;
  size?: ImageSize;
  className?: string;
}

const sizeClasses: Record<ImageSize, string> = {
  xsmall: 'w-[120px] h-auto md:w-[160px] md:h-auto mx-auto my-6 md:my-12',
  small: 'w-[160px] h-auto md:w-[240px] md:h-auto mx-auto my-6 md:my-12',
  large: 'w-[340px] h-auto md:w-[414px] md:h-auto mx-auto my-6 md:my-12',
  auto: 'w-full my-6'
};

const Image: FC<ImageProps> = ({ src, alt, size = 'auto', className = '' }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-md object-cover ${sizeClasses[size]} ${className}`}
    />
  );
};

export default Image;