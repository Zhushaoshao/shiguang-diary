import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import { createDiary, updateDiary, getDiaryById } from '../services/diaryService';
import { useAuthStore } from '../store/authStore';
import FileUpload from '../components/FileUpload';
import DiaryPreview from '../components/DiaryPreview';
import DateTimePicker from '../components/DateTimePicker';
import LoadingSpinner from '../components/LoadingSpinner';

const WriteDiary = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const diaryId = searchParams.get('id');
  const isEditMode = !!diaryId;

  // 表单状态
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [diaryDate, setDiaryDate] = useState<Date>(new Date());
  const [cover, setCover] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File[]>([]);

  // 已有文件（编辑模式）
  const [existingCover, setExistingCover] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingVideos, setExistingVideos] = useState<string[]>([]);

  // UI 状态
  const [loading, setLoading] = useState(false);
  const [loadingDiary, setLoadingDiary] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  // 加载已有日记（编辑模式）
  useEffect(() => {
    if (isEditMode && diaryId) {
      loadDiary(Number(diaryId));
    }
  }, [isEditMode, diaryId]);

  const loadDiary = async (id: number) => {
    setLoadingDiary(true);
    try {
      const data = await getDiaryById(id);
      const diary = data.diary;

      // 检查权限
      if (diary.user_id !== user?.id) {
        alert('无权编辑此日记');
        navigate('/');
        return;
      }

      setTitle(diary.title);
      setContent(diary.content);

      // 设置日记日期
      if (diary.created_at) {
        const date = new Date(diary.created_at);
        setDiaryDate(date);
      }

      // 加载已有文件
      if (diary.cover) {
        setExistingCover(diary.cover);
      }
      if (diary.images && diary.images.length > 0) {
        setExistingImages(diary.images);
      }
      if (diary.video) {
        console.log('原始 video 数据:', diary.video);
        console.log('video 类型:', typeof diary.video);

        // 兼容旧数据：如果是字符串，转为数组
        let videos: string[] = [];

        if (typeof diary.video === 'string') {
          try {
            // 尝试解析 JSON
            const parsed = JSON.parse(diary.video);
            videos = Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            // 如果不是 JSON，直接作为单个视频
            videos = [diary.video];
          }
        } else if (Array.isArray(diary.video)) {
          videos = diary.video;
        }

        console.log('解析后的 videos:', videos);
        setExistingVideos(videos);
      }

      console.log('已加载日记:', {
        cover: diary.cover,
        images: diary.images,
        video: diary.video
      });
    } catch (error: any) {
      console.error('加载日记失败:', error);
      alert(error.response?.data?.message || '加载失败');
      navigate('/');
    } finally {
      setLoadingDiary(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('请输入标题');
      return;
    }

    if (!content.trim()) {
      alert('请输入内容');
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('content', content.trim());
      formData.append('diaryDate', diaryDate.toISOString()); // 转换为 ISO 字符串

      console.log('=== 准备提交日记 ===');
      console.log('标题:', title.trim());
      console.log('内容长度:', content.trim().length);
      console.log('日记日期:', diaryDate.toISOString());
      console.log('封面:', cover.length > 0 ? cover[0].name : '无');
      console.log('图片数量:', images.length);
      console.log('视频数量:', video.length);

      // 编辑模式：传递保留的已有文件
      if (isEditMode) {
        // 保留的封面
        if (cover.length === 0 && existingCover) {
          formData.append('keepCover', existingCover);
        }
        // 保留的图片
        if (existingImages.length > 0) {
          formData.append('keepImages', JSON.stringify(existingImages));
        }
        // 保留的视频
        if (existingVideos.length > 0) {
          formData.append('keepVideos', JSON.stringify(existingVideos));
        }
      }

      // 添加封面
      if (cover.length > 0) {
        console.log('添加封面:', cover[0].name, cover[0].size, 'bytes');
        formData.append('cover', cover[0]);
      }

      // 添加图片
      images.forEach((image, index) => {
        console.log(`添加图片 ${index + 1}:`, image.name, image.size, 'bytes');
        formData.append('images', image);
      });

      // 添加视频
      video.forEach((v, index) => {
        console.log(`添加视频 ${index + 1}:`, v.name, v.size, 'bytes');
        formData.append('videos', v);
      });

      console.log('开始上传...');

      if (isEditMode && diaryId) {
        await updateDiary(Number(diaryId), formData);
        alert('日记更新成功');
        // 使用 replace 替换当前历史记录，避免返回时回到编辑页
        navigate(`/post/${diaryId}`, { replace: true });
      } else {
        const result = await createDiary(formData);
        console.log('创建成功:', result);
        alert('日记发布成功');
        navigate(`/post/${result.diaryId}`, { replace: true });
      }
    } catch (error: any) {
      console.error('保存日记失败:', error);
      console.error('错误响应:', error.response);

      const errorMessage = error.response?.data?.message || error.message || '保存失败，请稍后重试';
      const errorDetail = error.response?.data?.error || '';

      alert(`${errorMessage}${errorDetail ? '\n' + errorDetail : ''}`);
    } finally {
      setSaving(false);
    }
  };

  if (loadingDiary) {
    return (
      <div className="min-h-screen bg-neutral-bg">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* 顶部导航栏 - 玻璃纸质效果 */}
      <header className="glass-paper sticky top-0 z-20 border-b border-neutral-border/30 animate-slide-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => navigate(-1)}
                className="btn-back-compact lg:btn-back"
                aria-label="返回"
              >
                <ArrowLeft size={20} strokeWidth={2.25} />
                <span className="hidden lg:inline">返回</span>
              </button>
              <h1 className="text-lg lg:text-2xl font-display font-semibold text-neutral-ink truncate">
                {isEditMode ? '编辑日记' : '写日记'}
              </h1>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              {/* 桌面端预览切换按钮 */}
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="btn-paper flex items-center gap-2"
              >
                {showPreview ? (
                  <>
                    <EyeOff size={18} strokeWidth={2} />
                    <span>编辑</span>
                  </>
                ) : (
                  <>
                    <Eye size={18} strokeWidth={2} />
                    <span>预览</span>
                  </>
                )}
              </button>

              {/* 桌面端发布/更新按钮 */}
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="btn-paper-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isEditMode ? '更新中...' : '发布中...'}</span>
                  </>
                ) : (
                  <>
                    <Save size={18} strokeWidth={2} />
                    <span>{isEditMode ? '更新' : '发布'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧编辑器 */}
          <div className={`${showPreview ? 'hidden lg:block' : 'block'} animate-fade-in`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 标题输入 */}
              <div>
                <label
                  htmlFor="title"
                  className="label-paper"
                >
                  标题 <span className="text-error">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="给你的日记起个标题..."
                  className="input-paper w-full text-lg font-display"
                  required
                />
              </div>

              {/* 日期选择 */}
              <DateTimePicker
                value={diaryDate}
                onChange={setDiaryDate}
                label="日记日期"
                required
              />

              {/* 封面上传 */}
              <FileUpload
                label="封面图（可选）"
                accept="image/*"
                maxFiles={1}
                maxSize={10}
                value={cover}
                onChange={setCover}
                existingFiles={existingCover ? [existingCover] : []}
                onRemoveExisting={() => setExistingCover(null)}
              />

              {/* 内容输入 */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <label
                    htmlFor="content"
                    className="label-paper mb-0"
                  >
                    内容 <span className="text-error">*</span>
                  </label>
                  <span className="text-xs text-neutral-secondary whitespace-nowrap">
                    {content.length} 字
                  </span>
                </div>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="记录你的生活点滴..."
                  rows={12}
                  className="textarea-paper w-full font-display"
                  required
                />
              </div>

              {/* 图片上传 */}
              <FileUpload
                label="图片（可选，最多9张）"
                accept="image/*"
                multiple
                maxFiles={9}
                maxSize={10}
                value={images}
                onChange={setImages}
                existingFiles={existingImages}
                onRemoveExisting={(filename) => {
                  setExistingImages(existingImages.filter(img => img !== filename));
                }}
              />

              {/* 视频上传 */}
              <FileUpload
                label="视频（可选，最多3个）"
                accept="video/*"
                multiple
                maxFiles={3}
                maxSize={50}
                value={video}
                onChange={setVideo}
                preview={true}
                existingFiles={existingVideos}
                onRemoveExisting={(filename) => {
                  setExistingVideos(existingVideos.filter(v => v !== filename));
                }}
              />
            </form>
          </div>

          {/* 右侧预览 */}
          <div className={`${showPreview ? 'block' : 'hidden lg:block'} animate-fade-in stagger-1`}>
            <div className="sticky top-24">
              <div className="card-paper p-6">
                <h3 className="font-display text-lg font-semibold text-neutral-ink mb-4 flex items-center gap-2">
                  <Eye size={20} className="text-primary-500" />
                  实时预览
                </h3>
                <DiaryPreview
                  title={title}
                  content={content}
                  cover={cover[0] || null}
                  images={images}
                  video={video}
                  existingCover={existingCover}
                  existingImages={existingImages}
                  existingVideos={existingVideos}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 移动端底部操作栏 */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 bg-neutral-bg/85 backdrop-blur-md border-t border-neutral-border/50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="btn-paper w-full justify-center"
          >
            {showPreview ? (
              <>
                <EyeOff size={18} strokeWidth={2} />
                <span>编辑内容</span>
              </>
            ) : (
              <>
                <Eye size={18} strokeWidth={2} />
                <span>查看预览</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="btn-paper-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{isEditMode ? '更新中' : '发布中'}</span>
              </>
            ) : (
              <>
                <Save size={18} strokeWidth={2} />
                <span>{isEditMode ? '更新日记' : '发布日记'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WriteDiary;

