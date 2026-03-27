import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Sparkles, Save, X, Edit2 } from 'lucide-react';
import { splitTextIntoDiaries } from '../utils/dateParser';
import type { DiaryEntry } from '../utils/dateParser';
import { createDiary } from '../services/diaryService';
import LoadingSpinner from '../components/LoadingSpinner';

const BatchImport = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // 分析文本
  const handleAnalyze = () => {
    if (!inputText.trim()) {
      alert('请输入要导入的文本');
      return;
    }

    setAnalyzing(true);
    setTimeout(() => {
      const parsed = splitTextIntoDiaries(inputText);
      setDiaries(parsed);
      setAnalyzing(false);
    }, 500);
  };

  // 编辑单篇日记
  const handleEdit = (index: number, field: 'title' | 'content' | 'date', value: string | Date) => {
    const updated = [...diaries];
    if (field === 'date' && value instanceof Date) {
      updated[index].date = value;
    } else if (typeof value === 'string') {
      updated[index][field] = value;
    }
    setDiaries(updated);
  };

  // 删除单篇
  const handleDelete = (index: number) => {
    setDiaries(diaries.filter((_, i) => i !== index));
  };

  // 一键提交所有
  const handleSubmitAll = async () => {
    if (diaries.length === 0) {
      alert('没有可提交的日记');
      return;
    }

    setSubmitting(true);
    try {
      let successCount = 0;
      for (const diary of diaries) {
        try {
          await createDiary({
            title: diary.title,
            content: diary.content,
            diaryDate: diary.date.toISOString(),
          });
          successCount++;
        } catch (error) {
          console.error('提交失败:', diary.title, error);
        }
      }

      alert(`成功导入 ${successCount} 篇日记`);
      navigate('/');
    } catch (error) {
      console.error('批量导入失败:', error);
      alert('导入失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 重置
  const handleReset = () => {
    setInputText('');
    setDiaries([]);
    setEditingIndex(null);
  };

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* 头部 */}
      <header className="glass-paper sticky top-0 z-10 border-b border-neutral-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => navigate('/')}
                className="btn-back-compact lg:btn-back-icon lg:btn-back"
                aria-label="返回首页"
              >
                <ArrowLeft size={22} strokeWidth={2.4} />
              </button>
              <h1 className="text-lg lg:text-2xl font-display font-bold text-neutral-ink truncate">多篇导入</h1>
            </div>

            {diaries.length > 0 && (
              <div className="hidden lg:flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="btn-paper flex items-center gap-2"
                >
                  <X size={18} />
                  <span>重置</span>
                </button>
                <button
                  onClick={handleSubmitAll}
                  disabled={submitting}
                  className="btn-paper-primary flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <LoadingSpinner size="sm" inline />
                      <span>提交中...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>一键提交全部</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">
        {diaries.length === 0 ? (
          /* 输入区域 */
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="card-paper p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={20} className="text-primary-500" />
                <h2 className="text-lg font-display font-semibold text-neutral-ink">粘贴文本内容</h2>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="请粘贴包含多篇日记的文本，系统会自动识别日期并拆分...&#10;&#10;支持格式示例：&#10;2026年03月26日 08:26&#10;今天天气不错...&#10;&#10;2026-3-27 10:30&#10;去了公园散步..."
                className="textarea-paper w-full h-[55vh] min-h-[320px] lg:h-96 font-display scrollbar-paper"
              />

              <div className="mt-4 hidden lg:flex justify-end">
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || !inputText.trim()}
                  className="btn-paper-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {analyzing ? (
                    <>
                      <LoadingSpinner size="sm" inline />
                      <span>分析中...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>分析拆分</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* 分析结果 */
          <div className="animate-fade-in">
            <div className="mb-6 card-paper bg-primary-50 border-2 border-primary-200 p-4">
              <p className="text-primary-700 font-medium">
                已识别 {diaries.length} 篇日记，请核对后提交
              </p>
            </div>

            <div className="space-y-6 lg:max-h-[calc(100vh-300px)] lg:overflow-y-auto scrollbar-paper lg:pr-2">
              {diaries.map((diary, index) => (
                <div
                  key={index}
                  className="card-paper p-6 hover:-translate-y-1 transition-all duration-300 animate-fade-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {editingIndex === index ? (
                        <input
                          type="text"
                          value={diary.title}
                          onChange={(e) => handleEdit(index, 'title', e.target.value)}
                          className="input-paper w-full font-display"
                        />
                      ) : (
                        <h3 className="text-lg font-display font-semibold text-neutral-ink">{diary.title}</h3>
                      )}
                      <p className="text-sm text-neutral-secondary mt-1">
                        {diary.date.toLocaleString('zh-CN')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                        className="icon-action-btn text-primary-500 hover:bg-primary-50 hover:scale-105"
                        aria-label="编辑这篇日记"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="icon-action-btn text-error hover:bg-red-50 hover:scale-105"
                        aria-label="删除这篇日记"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {editingIndex === index ? (
                    <textarea
                      value={diary.content}
                      onChange={(e) => handleEdit(index, 'content', e.target.value)}
                      className="textarea-paper w-full h-32 font-display"
                    />
                  ) : (
                    <p className="text-neutral-text whitespace-pre-wrap font-display leading-relaxed">{diary.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 移动端底部操作栏 */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 bg-neutral-bg/85 backdrop-blur-md border-t border-neutral-border/50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-3">
          {diaries.length === 0 ? (
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={analyzing || !inputText.trim()}
              className="col-span-2 btn-paper-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {analyzing ? (
                <>
                  <LoadingSpinner size="sm" inline />
                  <span>分析中</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>分析拆分</span>
                </>
              )}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleReset}
                className="btn-paper w-full justify-center"
              >
                <X size={18} />
                <span>重置内容</span>
              </button>
              <button
                type="button"
                onClick={handleSubmitAll}
                disabled={submitting}
                className="btn-paper-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size="sm" inline />
                    <span>提交中</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>提交全部</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchImport;

