import { useMemo, useState } from 'react';
import { Calendar, User } from 'lucide-react';
import DiaryContent from './DiaryContent';
import VideoViewer from './VideoViewer';

interface DiaryPreviewProps {
  title: string;
  content: string;
  cover: File | null;
  images: File[];
  video: File[];
  // 已有文件（编辑模式）
  existingCover?: string | null;
  existingImages?: string[];
  existingVideos?: string[];
}

const DiaryPreview = ({
  title,
  content,
  cover,
  images,
  video,
  existingCover,
  existingImages = [],
  existingVideos = []
}: DiaryPreviewProps) => {
  const [showVideoViewer, setShowVideoViewer] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const previewVideoUrls = useMemo(
    () => video.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [video]
  );

  const getPreviewUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  const getFileUrl = (filename: string) => {
    return `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}/uploads/${filename}`;
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="bg-neutral-card rounded-xl shadow-paper overflow-hidden h-full border border-neutral-border">
        <div className="p-6 overflow-y-auto scrollbar-paper" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {/* 封面图 */}
          {(cover || existingCover) && (
            <div className="w-full h-64 rounded-lg overflow-hidden bg-gradient-to-br from-neutral-border to-neutral-bg mb-6">
              <img
                src={cover ? getPreviewUrl(cover) : getFileUrl(existingCover!)}
                alt="封面"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* 标题 */}
          <h1 className="font-display text-3xl font-bold text-neutral-ink mb-6">
            {title || '无标题'}
          </h1>

          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-6 text-neutral-secondary pb-6 border-b border-neutral-border/50 mb-6">
            <div className="flex items-center gap-2">
              <User size={18} className="text-primary-500" />
              <span>我</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-sunset-amber" />
              <span>{formatDate()}</span>
            </div>
          </div>

          {/* 正文内容 */}
          <div className="prose prose-lg max-w-none mb-8">
            {content ? (
              <DiaryContent content={content} />
            ) : (
              <div className="text-neutral-secondary">开始写下你的故事...</div>
            )}
          </div>

          {/* 图片展示 */}
          {(images.length > 0 || existingImages.length > 0) && (
            <div className="mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {existingImages.map((image, index) => (
                  <div
                    key={`existing-${index}`}
                    className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-primary-300"
                  >
                    <img
                      src={getFileUrl(image)}
                      alt={`已有图片 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                      已有
                    </div>
                  </div>
                ))}
                {images.map((image, index) => (
                  <div
                    key={`new-${index}`}
                    className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                  >
                    <img
                      src={getPreviewUrl(image)}
                      alt={`新图片 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 视频展示 */}
          {(video.length > 0 || existingVideos.length > 0) && (
            <div className="mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {existingVideos.map((v, index) => (
                  <button
                    key={`existing-${index}`}
                    type="button"
                    onClick={() => {
                      setSelectedVideo(getFileUrl(v));
                      setShowVideoViewer(true);
                    }}
                    className="relative aspect-video rounded-xl overflow-hidden bg-neutral-bg border border-primary-200 shadow-paper-sm group text-left"
                  >
                    <video
                      src={getFileUrl(v)}
                      className="w-full h-full object-cover pointer-events-none"
                      preload="metadata"
                      muted
                    />
                    <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                      已有
                    </div>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 bg-black/55 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}

                {previewVideoUrls.map(({ file, url }, index) => (
                  <button
                    key={`new-${file.name}-${index}`}
                    type="button"
                    onClick={() => {
                      setSelectedVideo(url);
                      setShowVideoViewer(true);
                    }}
                    className="relative aspect-video rounded-xl overflow-hidden bg-neutral-bg border border-neutral-border shadow-paper-sm group text-left"
                  >
                    <video
                      src={url}
                      className="w-full h-full object-cover pointer-events-none"
                      preload="metadata"
                      muted
                    />
                    <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">
                      新增
                    </div>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 bg-black/55 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 空状态提示 */}
          {!title && !content && !cover && !existingCover &&
           images.length === 0 && existingImages.length === 0 &&
           video.length === 0 && existingVideos.length === 0 && (
            <div className="text-center py-12 text-neutral-secondary">
              <p>在左侧编辑器中输入内容，这里会实时预览</p>
            </div>
          )}
        </div>
      </div>

      {showVideoViewer && selectedVideo && (
        <VideoViewer
          src={selectedVideo}
          title={title || '视频预览'}
          onClose={() => {
            setShowVideoViewer(false);
            setSelectedVideo(null);
          }}
        />
      )}
    </>
  );
};

export default DiaryPreview;

