import { Calendar, User } from 'lucide-react';
import DiaryContent from './DiaryContent';

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
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden h-full">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
        <h3 className="text-lg font-heading font-semibold text-text">预览</h3>
      </div>

      <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {/* 封面图 */}
        {(cover || existingCover) && (
          <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100 mb-6">
            <img
              src={cover ? getPreviewUrl(cover) : getFileUrl(existingCover!)}
              alt="封面"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 标题 */}
        <h1 className="text-4xl font-heading font-bold text-text mb-6">
          {title || '无标题'}
        </h1>

        {/* 元信息 */}
        <div className="flex flex-wrap items-center gap-6 text-gray-600 pb-6 border-b border-gray-200 mb-6">
          <div className="flex items-center gap-2">
            <User size={18} className="text-primary" />
            <span>我</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            <span>{formatDate()}</span>
          </div>
        </div>

        {/* 正文内容 */}
        <div className="prose prose-lg max-w-none mb-8">
          {content ? (
            <DiaryContent content={content} />
          ) : (
            <div className="text-neutral-secondary">
              开始写下你的故事...
            </div>
          )}
        </div>

        {/* 图片展示 */}
        {(images.length > 0 || existingImages.length > 0) && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* 已有图片 */}
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
              {/* 新上传图片 */}
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
            <div className="grid grid-cols-1 gap-4">
              {/* 已有视频 */}
              {existingVideos.map((v, index) => (
                <div key={`existing-${index}`} className="relative">
                  <video
                    src={getFileUrl(v)}
                    controls
                    className="w-full rounded-lg shadow-card border-2 border-primary-300"
                  >
                    您的浏览器不支持视频播放
                  </video>
                  <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                    已有
                  </div>
                </div>
              ))}
              {/* 新上传视频 */}
              {video.map((v, index) => (
                <video
                  key={`new-${index}`}
                  src={getPreviewUrl(v)}
                  controls
                  className="w-full rounded-lg shadow-card"
                >
                  您的浏览器不支持视频播放
                </video>
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
  );
};

export default DiaryPreview;

