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
      className="card-paper group cursor-pointer overflow-hidden transition-all duration-500 hover:-translate-y-2"
    >
      {/* 封面图片 */}
      {coverImage && (
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-neutral-border to-neutral-bg -m-6 mb-0">
          <img
            src={coverImage}
            alt={diary.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-card via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
          {/* 墨水晕染效果 */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-sunset-lavender/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      )}

      {/* 内容区域 */}
      <div className={coverImage ? 'p-6 pt-5' : 'p-6'}>
        {/* 标题 - 衬线字体 */}
        <h2 className="font-display text-xl font-semibold text-neutral-ink mb-3 line-clamp-2 group-hover:text-gradient-sunset transition-all duration-300">
          {diary.title}
        </h2>

        {/* 内容预览 - 优化排版 */}
        <p className="text-sm text-neutral-secondary mb-4 line-clamp-3 leading-relaxed font-body">
          {diary.content}
        </p>

        {/* 元信息 - 优化图标和间距 */}
        <div className="flex items-center justify-between text-xs text-neutral-secondary pt-4 border-t border-neutral-border/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 group/item">
              <User size={14} strokeWidth={2} className="text-primary-500 group-hover/item:scale-110 transition-transform duration-300" />
              <span className="font-medium">{diary.username}</span>
            </div>
            <div className="flex items-center gap-1.5 group/item">
              <Calendar size={14} strokeWidth={2} className="text-sunset-amber group-hover/item:scale-110 transition-transform duration-300" />
              <span>{formatDate(diary.created_at)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 group/item">
            <Eye size={14} strokeWidth={2} className="text-neutral-secondary/60 group-hover/item:scale-110 transition-transform duration-300" />
            <span>{diary.views}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default DiaryCard;

