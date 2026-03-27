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
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors duration-200"
        aria-label="关闭视频查看器"
      >
        <X size={24} />
      </button>

      <div
        className="w-full max-w-5xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-white/85 text-sm mb-3 px-1">{title}</div>
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

