import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDiaries, searchDiaries } from '../services/diaryService';
import type { Diary } from '../services/diaryService';
import DiaryCard from '../components/DiaryCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import HomeSkeleton from '../components/HomeSkeleton';
import { ChevronUp, PenSquare, FileStack, LogOut, UserPlus, User, DoorOpen } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const initialLoadedRef = useRef(false);
  const loadingRef = useRef(false);

  // 加载日记列表
  const loadDiaries = useCallback(async (pageNum: number, isSearch = false, keyword = '') => {
    if (loadingRef.current) return;

    const isFirstPage = pageNum === 1;

    loadingRef.current = true;
    setLoading(true);
    setLoadingMore(!isFirstPage);
    if (isFirstPage) {
      setShowSkeleton(true);
    }
    setError(null);

    try {
      if (isSearch && keyword) {
        const data = await searchDiaries(keyword, pageNum, 10);
        if (pageNum === 1) {
          setDiaries(data.diaries);
        } else {
          setDiaries((prev) => [...prev, ...data.diaries]);
        }
        setHasMore(data.diaries.length === 10);
      } else {
        const data = await getDiaries(pageNum, 10, isFirstPage);
        if (pageNum === 1) {
          setDiaries(data.diaries);
        } else {
          setDiaries((prev) => [...prev, ...data.diaries]);
        }
        setHasMore(pageNum < data.pagination.totalPages);
      }
    } catch (error: any) {
      console.error('加载日记失败:', error);
      setError(error.response?.data?.message || error.message || '加载失败');
    } finally {
      loadingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
      setShowSkeleton(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    if (initialLoadedRef.current) return;
    initialLoadedRef.current = true;
    loadDiaries(1);
  }, [loadDiaries]);

  // 搜索处理
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setPage(1);
    setHasMore(true);
    loadDiaries(1, !!keyword, keyword);
  };

  // 无限滚动
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          loadDiaries(nextPage, !!searchKeyword, searchKeyword);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, page, searchKeyword, loadDiaries]);

  // 监听滚动显示回到顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 回到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const avatarUrl = user?.avatar
    ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}/uploads/${user.avatar}`
    : null;

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* 头部区域 - Editorial Magazine 风格 */}
      <header className="glass-paper sticky top-0 z-10 border-b border-neutral-border/30 animate-slide-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 顶部导航栏 */}
          <div className="flex items-center justify-between py-4">
            {/* Logo 和标题 */}
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-12 h-12 rounded-lg bg-gradient-sunset flex items-center justify-center shadow-paper-sm group-hover:shadow-glow transition-all duration-500 group-hover:rotate-6">
                <span className="text-white text-xl font-display font-bold">拾</span>
              </div>
              <h1 className="text-2xl font-display font-bold text-gradient-sunset">拾光日记</h1>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* 写日记按钮 */}
                  <button
                    onClick={() => navigate('/write')}
                    className="btn-paper-primary flex items-center gap-2"
                  >
                    <PenSquare size={18} strokeWidth={2} />
                    <span className="hidden sm:inline">写日记</span>
                  </button>

                  {/* 多篇导入按钮 */}
                  <button
                    onClick={() => navigate('/batch-import')}
                    className="btn-paper border-2 border-primary-500 text-primary-500 hover:bg-primary-50 flex items-center gap-2"
                  >
                    <FileStack size={18} strokeWidth={2} />
                    <span className="hidden sm:inline">多篇导入</span>
                  </button>

                  {/* 个人中心 */}
                  <button
                    onClick={() => navigate('/profile')}
                    className="btn-paper flex items-center gap-2"
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={user?.username || '用户头像'}
                        className="w-7 h-7 rounded-md object-cover border border-neutral-border/60"
                      />
                    ) : (
                      <User size={18} strokeWidth={2} />
                    )}
                    <span className="hidden sm:inline">{user?.username}</span>
                  </button>

                  {/* 退出按钮 */}
                  <button
                    onClick={logout}
                    className="btn-paper text-neutral-secondary hover:text-error hover:border-error flex items-center gap-2"
                  >
                    <LogOut size={18} strokeWidth={2} />
                    <span className="hidden sm:inline">退出</span>
                  </button>
                </>
              ) : (
                <>
                  {/* 登录按钮 */}
                  <button
                    onClick={() => navigate('/login')}
                    className="btn-paper border-2 border-primary-500 text-primary-500 hover:bg-primary-50 flex items-center gap-2"
                  >
                    <DoorOpen size={18} strokeWidth={2} />
                    <span>登录</span>
                  </button>

                  {/* 注册按钮 */}
                  <button
                    onClick={() => navigate('/register')}
                    className="btn-paper-primary flex items-center gap-2"
                  >
                    <UserPlus size={18} strokeWidth={2} />
                    <span>注册</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 搜索栏 */}
          <div className="py-5 border-t border-neutral-border/30">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 错误提示 */}
        {error && (
          <div className="card-paper bg-red-50 border-2 border-error/30 text-error px-5 py-4 mb-6 animate-slide-up">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-display font-semibold text-base">加载失败</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
              <button
                type="button"
                onClick={() => loadDiaries(1, !!searchKeyword, searchKeyword)}
                className="btn-paper border-error/30 text-error hover:bg-red-100 self-start sm:self-auto"
              >
                重试加载
              </button>
            </div>
          </div>
        )}

        {/* 日记列表 - 错落揭示动画 */}
        {showSkeleton ? (
          <HomeSkeleton />
        ) : diaries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diaries.map((diary, index) => (
              <div
                key={diary.id}
                className={`animate-fade-in stagger-${Math.min(index % 5 + 1, 5)}`}
              >
                <DiaryCard diary={diary} />
              </div>
            ))}
          </div>
        ) : (
          !loading && !error && (
            <div className="animate-scale-in">
              <EmptyState
                message={searchKeyword ? '未找到相关日记' : '暂无日记'}
                description={
                  searchKeyword
                    ? '试试其他关键词吧'
                    : '开始记录你的生活点滴吧'
                }
              />
            </div>
          )
        )}

        {/* 加载更多指示器 */}
        {loadingMore && <LoadingSpinner size="md" />}

        {/* 无限滚动触发器 */}
        <div ref={observerTarget} className="h-4" />

        {/* 没有更多数据提示 */}
        {!hasMore && diaries.length > 0 && (
          <div className="text-center py-8">
            <div className="divider-ink"></div>
            <p className="text-neutral-secondary text-sm font-display italic mt-4">
              已经到底了，没有更多日记了
            </p>
          </div>
        )}
      </main>

      {/* 回到顶部按钮 - 纸质风格 */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-xl bg-gradient-sunset text-white shadow-paper-xl hover:shadow-glow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center focus:outline-none animate-scale-in z-30 border border-white/20"
          aria-label="回到顶部"
        >
          <ChevronUp size={28} strokeWidth={3} className="text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.28)]" />
        </button>
      )}
    </div>
  );
};

export default Home;

