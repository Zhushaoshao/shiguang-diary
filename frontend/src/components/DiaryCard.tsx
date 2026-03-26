import { useNavigate } from 'react-router-dom';
import { Calendar, Eye, User } from 'lucide-react';
import type { Diary } from '../services/diaryService';

interface DiaryCardProps {
  diary: Diary;
}

const DiaryCard = ({ diary }: DiaryCardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCoverImage = () => {
    // 只使用用户上传的封面，不使用图片作为替代
    if (diary.cover) {
      return `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}/uploads/${diary.cover}`;
    }
    return null;
  };

  const coverImage = getCoverImage();

  return (
    <article
      onClick={() => navigate(`/post/${diary.id}`)}
      className="group cursor-pointer bg-neutral-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1 border border-neutral-border"
    >
      {/* 封面图片 */}
      {coverImage && (
        <div className="relative h-48 overflow-hidden bg-neutral-bg">
          <img
            src={coverImage}
            alt={diary.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      {/* 内容区域 */}
      <div className="p-5">
        {/* 标题 */}
        <h2 className="text-xl font-semibold text-neutral-text mb-3 line-clamp-2 group-hover:text-primary-500 transition-colors duration-200">
          {diary.title}
        </h2>

        {/* 内容预览 */}
        <p className="text-sm text-neutral-secondary mb-4 line-clamp-3 leading-relaxed">
          {diary.content}
        </p>

        {/* 元信息 */}
        <div className="flex items-center justify-between text-xs text-neutral-secondary pt-4 border-t border-neutral-border">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <User size={14} strokeWidth={2} className="text-primary-500" />
              <span className="font-medium">{diary.username}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} strokeWidth={2} className="text-primary-500" />
              <span>{formatDate(diary.created_at)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye size={14} strokeWidth={2} className="text-primary-500" />
            <span>{diary.views}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default DiaryCard;

