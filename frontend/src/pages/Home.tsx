import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDiaries, searchDiaries } from '../services/diaryService';
import type { Diary } from '../services/diaryService';
import DiaryCard from '../components/DiaryCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { ChevronUp, PenSquare, FileStack, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  console.log('Home component rendered');

  // 加载日记列表
  const loadDiaries = useCallback(async (pageNum: number, isSearch = false, keyword = '') => {
    if (loading) return;

    setLoading(true);
    setError(null);
    console.log('Loading diaries...', { pageNum, isSearch, keyword });

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
        const data = await getDiaries(pageNum, 10);
        console.log('Diaries loaded:', data);
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
      setLoading(false);
    }
  }, [loading]);

  // 初始加载
  useEffect(() => {
    loadDiaries(1);
  }, []);

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

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* 头部区域 - 新拟态风格 */}
      <header className="bg-neutral-card shadow-neu sticky top-0 z-10 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 顶部导航栏 */}
          <div className="flex items-center justify-between py-4">
            {/* Logo 和标题 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-neu-sm">
                <span className="text-white text-xl font-bold">拾</span>
              </div>
              <h1 className="text-2xl font-bold text-neutral-text">拾光日记</h1>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* 写日记按钮 */}
                  <button
                    onClick={() => navigate('/write')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl font-medium shadow-neu-sm hover:shadow-neu hover:bg-primary-600 transition-all duration-200"
                  >
                    <PenSquare size={18} strokeWidth={2} />
                    <span className="hidden sm:inline">写日记</span>
                  </button>

                  {/* 多篇导入按钮 */}
                  <button
                    onClick={() => navigate('/batch-import')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-neutral-card border-2 border-primary-500 text-primary-500 rounded-xl font-medium shadow-card hover:shadow-card-hover hover:bg-primary-50 transition-all duration-200"
                  >
                    <FileStack size={18} strokeWidth={2} />
                    <span className="hidden sm:inline">多篇导入</span>
                  </button>

                  {/* 个人中心 */}
                  <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-neutral-card border border-neutral-border text-neutral-text rounded-xl font-medium shadow-card hover:shadow-card-hover transition-all duration-200"
                  >
                    <User size={18} strokeWidth={2} />
                    <span className="hidden sm:inline">{user?.username}</span>
                  </button>

                  {/* 退出按钮 */}
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2.5 bg-neutral-card border border-neutral-border text-neutral-secondary rounded-xl font-medium shadow-card hover:shadow-card-hover hover:text-error transition-all duration-200"
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
                    className="flex items-center gap-2 px-5 py-2.5 bg-neutral-card border-2 border-primary-500 text-primary-500 rounded-xl font-medium shadow-card hover:shadow-card-hover hover:bg-primary-50 transition-all duration-200"
                  >
                    <LogIn size={18} strokeWidth={2} />
                    <span>登录</span>
                  </button>

                  {/* 注册按钮 */}
                  <button
                    onClick={() => navigate('/register')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl font-medium shadow-neu-sm hover:shadow-neu hover:bg-primary-600 transition-all duration-200"
                  >
                    <UserPlus size={18} strokeWidth={2} />
                    <span>注册</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 搜索栏 */}
          <div className="py-5 border-t border-neutral-border">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-xl mb-6 shadow-card animate-slide-up">
            <p className="font-semibold text-base">加载失败</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* 日记列表 */}
        {diaries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {diaries.map((diary) => (
              <DiaryCard key={diary.id} diary={diary} />
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
        {loading && <LoadingSpinner />}

        {/* 无限滚动触发器 */}
        <div ref={observerTarget} className="h-4" />

        {/* 没有更多数据提示 */}
        {!hasMore && diaries.length > 0 && (
          <p className="text-center text-neutral-secondary py-8 text-sm">
            已经到底了，没有更多日记了
          </p>
        )}
      </main>

      {/* 回到顶部按钮 - 新拟态风格 */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-14 h-14 bg-neutral-card rounded-xl shadow-neu hover:shadow-neu-lg transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 animate-scale-in"
          aria-label="回到顶部"
        >
          <ChevronUp size={24} strokeWidth={2} className="text-primary-500" />
        </button>
      )}
    </div>
  );
};

export default Home;

