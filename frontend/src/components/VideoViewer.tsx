import { useEffect } from 'react';
import { X } from 'lucide-react';

interface VideoViewerProps {
  src: string;
  title?: string;
  onClose: () => void;
}

const VideoViewer = ({ src, title = '视频预览', onClose }: VideoViewerProps) => {
  useEffect(() => {
    const handleWindowKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleWindowKeyDown);
    return () => window.removeEventListener('keydown', handleWindowKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-label="视频查看器"
    >
      <div
        className="w-full max-w-5xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 mb-3 px-1 sm:px-0">
          <div className="min-w-0">
            <div className="text-white/90 text-sm sm:text-base font-medium truncate">{title}</div>
            <div className="text-white/55 text-xs sm:text-sm mt-1">在此窗口中播放与控制视频</div>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 flex-shrink-0 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors duration-200"
            aria-label="关闭视频查看器"
          >
            <X size={22} />
          </button>
        </div>

        <div className="rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10">
          <video
            src={src}
            controls
            playsInline
            preload="metadata"
            autoPlay
            className="w-full max-h-[78vh] bg-black"
          >
            您的浏览器不支持视频播放
          </video>
        </div>
      </div>
    </div>
  );
};

export default VideoViewer;

