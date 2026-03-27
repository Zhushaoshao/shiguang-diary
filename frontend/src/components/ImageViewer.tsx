import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import MediaImage from './MediaImage';

interface ImageViewerProps {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

const ImageViewer = ({ images, initialIndex = 0, onClose }: ImageViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleWindowKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleWindowKeyDown);
    return () => window.removeEventListener('keydown', handleWindowKeyDown);
  }, [images.length, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') onClose();
  };

  const getImageUrl = (filename: string) => {
    return `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}/uploads/${filename}`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="dialog"
      aria-label="图片查看器"
    >
      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors duration-200"
        aria-label="关闭"
      >
        <X size={24} />
      </button>

      {/* 图片计数 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
        {currentIndex + 1} / {images.length}
      </div>

      {/* 主图片 */}
      <div
        className="relative w-full max-w-7xl max-h-[90vh] mx-auto px-4 sm:px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <MediaImage
          key={images[currentIndex]}
          src={getImageUrl(images[currentIndex])}
          alt={`图片 ${currentIndex + 1}`}
          loading="eager"
          className="mx-auto max-w-full max-h-[90vh] rounded-lg"
          imgClassName="max-w-full max-h-[90vh] object-contain rounded-lg"
        />
      </div>

      {/* 左右切换按钮 */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors duration-200"
            aria-label="上一张"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors duration-200"
            aria-label="下一张"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      {/* 缩略图导航 */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg max-w-[90vw] overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`w-16 h-16 rounded overflow-hidden flex-shrink-0 transition-all duration-200 ${
                index === currentIndex
                  ? 'ring-2 ring-white scale-110'
                  : 'opacity-60 hover:opacity-100'
              }`}
              aria-label={`查看图片 ${index + 1}`}
            >
              <MediaImage
                src={getImageUrl(image)}
                alt={`缩略图 ${index + 1}`}
                className="w-full h-full"
                imgClassName="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageViewer;

