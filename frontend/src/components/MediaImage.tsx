import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface MediaImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  onClick?: () => void;
  loading?: 'lazy' | 'eager';
}

const MediaImage = ({
  src,
  alt,
  className = '',
  imgClassName = '',
  onClick,
  loading = 'lazy',
}: MediaImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-neutral-border/70 to-neutral-bg ${className}`}
      onClick={onClick}
    >
      {!loaded && !failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-border/40 to-white/60 animate-pulse">
          <LoadingSpinner size="md" inline />
        </div>
      )}

      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-neutral-secondary bg-neutral-bg/90">
          <ImageOff size={22} className="opacity-70" />
          <span className="text-xs sm:text-sm">图片加载失败</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`w-full h-full transition-all duration-500 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'} ${imgClassName}`}
        />
      )}
    </div>
  );
};

export default MediaImage;

