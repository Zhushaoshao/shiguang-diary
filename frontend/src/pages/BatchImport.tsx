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
      <header className="bg-neutral-card shadow-neu sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-xl hover:bg-neutral-bg transition-all duration-200"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold text-neutral-text">多篇导入</h1>
            </div>

            {diaries.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-card border border-neutral-border text-neutral-secondary rounded-xl hover:shadow-card-hover transition-all duration-200"
                >
                  <X size={18} />
                  <span>重置</span>
                </button>
                <button
                  onClick={handleSubmitAll}
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 shadow-neu-sm hover:shadow-neu transition-all duration-200 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <LoadingSpinner size="sm" />
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {diaries.length === 0 ? (
          /* 输入区域 */
          <div className="max-w-4xl mx-auto">
            <div className="bg-neutral-card rounded-xl p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={20} className="text-primary-500" />
                <h2 className="text-lg font-semibold text-neutral-text">粘贴文本内容</h2>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="请粘贴包含多篇日记的文本，系统会自动识别日期并拆分...&#10;&#10;支持格式示例：&#10;2026年03月26日 08:26&#10;今天天气不错...&#10;&#10;2026-3-27 10:30&#10;去了公园散步..."
                className="w-full h-96 px-4 py-3 rounded-xl border-2 border-neutral-border focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all duration-200 resize-none"
              />

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || !inputText.trim()}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 shadow-neu-sm hover:shadow-neu transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {analyzing ? (
                    <>
                      <LoadingSpinner size="sm" />
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
          <div>
            <div className="mb-6 bg-primary-50 border-2 border-primary-200 rounded-xl p-4">
              <p className="text-primary-700 font-medium">
                已识别 {diaries.length} 篇日记，请核对后提交
              </p>
            </div>

            <div className="space-y-6">
              {diaries.map((diary, index) => (
                <div
                  key={index}
                  className="bg-neutral-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {editingIndex === index ? (
                        <input
                          type="text"
                          value={diary.title}
                          onChange={(e) => handleEdit(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border-2 border-primary-300 focus:border-primary-500 focus:outline-none"
                        />
                      ) : (
                        <h3 className="text-lg font-semibold text-neutral-text">{diary.title}</h3>
                      )}
                      <p className="text-sm text-neutral-secondary mt-1">
                        {diary.date.toLocaleString('zh-CN')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                        className="p-2 rounded-lg hover:bg-primary-50 text-primary-500 transition-all duration-200"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-all duration-200"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {editingIndex === index ? (
                    <textarea
                      value={diary.content}
                      onChange={(e) => handleEdit(index, 'content', e.target.value)}
                      className="w-full h-32 px-3 py-2 rounded-lg border-2 border-primary-300 focus:border-primary-500 focus:outline-none resize-none"
                    />
                  ) : (
                    <p className="text-neutral-text whitespace-pre-wrap">{diary.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BatchImport;

