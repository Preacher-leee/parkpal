
import React, { useState } from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
  fallback?: string;
  blur?: boolean;
}

const Image: React.FC<ImageProps> = ({ 
  className, 
  fallback = '/placeholder.svg',
  blur = false,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
  };

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && !error && blur && (
        <div className="absolute inset-0 animate-pulse bg-gray-200 rounded" />
      )}
      <img 
        className={`${className} ${blur && !isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`} 
        onLoad={handleLoad} 
        onError={handleError}
        src={error ? fallback : props.src} 
        alt={props.alt || 'Image'} 
        {...props} 
      />
    </div>
  );
};

export default Image;
