import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Eye, User, Edit, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { getDiaryById, deleteDiary, incrementDiaryViews } from '../services/diaryService';
import type { Diary } from '../services/diaryService';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToastStore } from '../store/toastStore';
import ImageViewer from '../components/ImageViewer';
import VideoViewer from '../components/VideoViewer';
import DiaryContent from '../components/DiaryContent';
import MediaImage from '../components/MediaImage';

const DiaryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const showToast = useToastStore((state) => state.showToast);

  const [diary, setDiary] = useState<Diary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [showVideoViewer, setShowVideoViewer] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const loadedDiaryIdRef = useRef<string | null>(null);

  // 加载日记详情
  useEffect(() => {
    const loadDiary = async () => {
      if (!id || loadedDiaryIdRef.current === id) return;

      loadedDiaryIdRef.current = id;
      setLoading(true);
      setError(null);

      try {
        const data = await getDiaryById(Number(id));
        setDiary(data.diary);

        await incrementDiaryViews(Number(id));
        setDiary((prev) => (prev ? { ...prev, views: prev.views + 1 } : prev));
      } catch (err: any) {
        console.error('加载日记失败:', err);
        setError(err.response?.data?.message || '加载失败，请稍后重试');
        loadedDiaryIdRef.current = null;
      } finally {
        setLoading(false);
      }
    };

    loadDiary();
  }, [id]);

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 获取图片 URL
  const getImageUrl = (filename: string) => {
    return `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}/uploads/${filename}`;
  };

  // 删除日记
  const handleDelete = async () => {
    if (!diary) return;

    setDeleting(true);
    try {
      await deleteDiary(diary.id);
      showToast('日记删除成功', 'success');
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error('删除日记失败:', err);
      showToast(err.response?.data?.message || '删除失败，请稍后重试', 'error');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // 判断是否是作者
  const isAuthor = user && diary && user.id === diary.user_id;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !diary) {
    return (
      <div className="min-h-screen bg-neutral-bg flex items-center justify-center p-4">
        <div className="card-paper max-w-md w-full text-center">
          <h2 className="text-2xl font-display text-neutral-ink mb-3">
            {error || '日记不存在'}
          </h2>
          <p className="text-neutral-secondary text-sm mb-6">
            你可以返回首页，或立即重试当前内容加载。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="btn-paper-primary"
            >
              重试加载
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-paper"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* 顶部导航栏 - 玻璃纸质效果 */}
      <header className="glass-paper sticky top-0 z-10 border-b border-neutral-border/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => navigate(-1)}
              className="btn-back-compact lg:btn-back"
              aria-label="返回"
            >
              <ArrowLeft size={20} strokeWidth={2.25} />
              <span className="hidden lg:inline">返回</span>
            </button>

            {/* 操作按钮 */}
            {isAuthor && (
              <div className="flex items-center gap-2 lg:gap-3">
                <button
                  onClick={() => navigate(`/write?id=${diary.id}`)}
                  className="btn-paper border-2 border-primary-500 text-primary-500 hover:bg-primary-50 px-3 lg:px-6"
                  aria-label="编辑日记"
                >
                  <Edit size={18} strokeWidth={2} />
                  <span className="hidden sm:inline">编辑</span>
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="btn-paper border-2 border-error text-error hover:bg-red-50 px-3 lg:px-6"
                  aria-label="删除日记"
                >
                  <Trash2 size={18} strokeWidth={2} />
                  <span className="hidden sm:inline">删除</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 日记卡片 - 增强纸质质感 */}
        <article className="diary-paper-card rounded-2xl overflow-hidden animate-fade-in">
          {/* 封面图 */}
          {diary.cover && (
            <div className="w-full h-72 sm:h-80 md:h-96 overflow-hidden bg-gradient-to-br from-neutral-border to-neutral-bg relative">
              <MediaImage
                src={getImageUrl(diary.cover)}
                alt={diary.title}
                loading="eager"
                className="w-full h-full"
                imgClassName="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              {/* 封面渐变遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-card/80 via-transparent to-transparent pointer-events-none"></div>
            </div>
          )}

          <div className="p-8 md:p-12">
            {/* 标题 - 使用衬线字体 */}
            <h1 className="font-display text-4xl md:text-5xl font-bold text-neutral-ink mb-6 leading-tight animate-slide-up">
              {diary.title}
            </h1>

            {/* 元信息 - 优化样式 */}
            <div className="flex flex-wrap items-center gap-6 text-neutral-secondary pb-6 mb-8 border-b border-neutral-border/50 animate-slide-up stagger-1">
              <div className="flex items-center gap-2 group">
                <User size={18} className="text-primary-500 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">{diary.username}</span>
              </div>
              <div className="flex items-center gap-2 group">
                <Calendar size={18} className="text-sunset-amber group-hover:scale-110 transition-transform duration-300" />
                <span>{formatDate(diary.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 group">
                <Eye size={18} className="text-neutral-secondary/60 group-hover:scale-110 transition-transform duration-300" />
                <span>{diary.views} 次浏览</span>
              </div>
            </div>

            {/* 正文内容 - 优化排版 */}
            <div className="prose prose-lg max-w-none mt-8 animate-slide-up stagger-2">
              <DiaryContent content={diary.content} />
            </div>

            {/* 图片展示 - 方块状小图网格，无标题 */}
            {diary.images && diary.images.length > 0 && (
              <div className="mt-8">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {diary.images.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedImageIndex(index);
                        setShowImageViewer(true);
                      }}
                      className="relative aspect-square rounded-lg overflow-hidden bg-neutral-bg group cursor-pointer shadow-card hover:shadow-card-hover transition-all duration-300"
                    >
                      <MediaImage
                        src={getImageUrl(image)}
                        alt={`图片 ${index + 1}`}
                        className="w-full h-full"
                        imgClassName="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 视频展示 - 方块状缩略图，无标题 */}
            {diary.video && (() => {
              // 兼容处理：支持字符串或数组
              let videos: string[] = [];
              if (typeof diary.video === 'string') {
                try {
                  videos = JSON.parse(diary.video);
                  if (!Array.isArray(videos)) {
                    videos = [diary.video];
                  }
                } catch {
                  videos = [diary.video];
                }
              } else if (Array.isArray(diary.video)) {
                videos = diary.video;
              }

              return videos.length > 0 ? (
                <div className="mt-8">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {videos.map((videoFile, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setSelectedVideo(getImageUrl(videoFile));
                          setShowVideoViewer(true);
                        }}
                        className="relative aspect-square rounded-lg overflow-hidden bg-neutral-bg shadow-card hover:shadow-card-hover transition-all duration-300 group text-left"
                        aria-label={`查看视频 ${index + 1}`}
                      >
                        <video
                          src={getImageUrl(videoFile)}
                          className="w-full h-full object-cover pointer-events-none"
                          preload="metadata"
                          muted
                        >
                          您的浏览器不支持视频播放
                        </video>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 pointer-events-none" />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-12 h-12 bg-black/55 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 px-3 py-2 bg-gradient-to-t from-black/65 to-transparent pointer-events-none">
                          <p className="text-[11px] sm:text-xs text-white/90">点击打开大窗口播放视频</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            {/* 更新时间 */}
            {diary.updated_at !== diary.created_at && (
              <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
                最后更新于 {formatDate(diary.updated_at)}
              </div>
            )}
          </div>
        </article>
      </main>

      {/* 图片查看器 */}
      {showImageViewer && diary.images && diary.images.length > 0 && (
        <ImageViewer
          images={diary.images}
          initialIndex={selectedImageIndex}
          onClose={() => setShowImageViewer(false)}
        />
      )}


      {/* 视频查看器 */}
      {showVideoViewer && selectedVideo && (
        <VideoViewer
          src={selectedVideo}
          title={diary.title}
          onClose={() => {
            setShowVideoViewer(false);
            setSelectedVideo(null);
          }}
        />
      )}
      {/* 删除确认模态框 */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => !deleting && setShowDeleteModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <h3
              id="delete-dialog-title"
              className="text-2xl font-heading font-semibold text-text mb-4"
            >
              确认删除
            </h3>
            <p id="delete-dialog-description" className="text-gray-600 mb-6">
              确定要删除这篇日记吗？此操作无法撤销。
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    删除中...
                  </>
                ) : (
                  '确认删除'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiaryDetail;

