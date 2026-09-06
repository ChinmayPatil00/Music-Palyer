'use client';

import React, { useState, useEffect } from 'react';

interface FallbackImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string;
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK =
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80';

export default function FallbackImage({
  src,
  alt = 'Adventure destination',
  fallbackSrc = DEFAULT_FALLBACK,
  className = '',
  ...props
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
    setFailed(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!failed) {
      setFailed(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc || fallbackSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
}
