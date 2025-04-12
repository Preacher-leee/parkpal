
import React from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

const Image: React.FC<ImageProps> = ({ className, ...props }) => {
  return <img className={className} {...props} />;
};

export default Image;
