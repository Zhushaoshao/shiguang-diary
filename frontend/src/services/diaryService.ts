import api from '../lib/api';

export interface Diary {
  id: number;
  user_id: number;
  username: string;
  title: string;
  content: string;
  images: string[];
  video: string | null;
  cover: string | null;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface DiaryListResponse {
  diaries: Diary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const diaryListCache = new Map<string, { timestamp: number; data: DiaryListResponse }>();
const DIARY_LIST_CACHE_TTL = 30 * 1000;

export const clearDiaryListCache = () => {
  diaryListCache.clear();
};

// 获取日记列表
export const getDiaries = async (page = 1, limit = 10, useCache = false): Promise<DiaryListResponse> => {
  const cacheKey = `${page}-${limit}`;
  const cached = diaryListCache.get(cacheKey);

  if (useCache && cached && Date.now() - cached.timestamp < DIARY_LIST_CACHE_TTL) {
    return cached.data;
  }

  const response = await api.get('/diaries', {
    params: { page, limit },
  });

  diaryListCache.set(cacheKey, {
    timestamp: Date.now(),
    data: response.data,
  });

  return response.data;
};

// 搜索日记
export const searchDiaries = async (keyword: string, page = 1, limit = 10): Promise<{ diaries: Diary[] }> => {
  const response = await api.get('/diaries/search', {
    params: { keyword, page, limit },
  });
  return response.data;
};

// 获取日记详情
export const getDiaryById = async (id: number): Promise<{ diary: Diary }> => {
  const response = await api.get(`/diaries/${id}`);
  return response.data;
};

// 增加浏览次数
export const incrementDiaryViews = async (id: number) => {
  const response = await api.post(`/diaries/${id}/view`);
  return response.data;
};

// 创建日记
export const createDiary = async (data: FormData | { title: string; content: string; diaryDate?: string }) => {
  const isFormData = data instanceof FormData;
  const response = await api.post('/diaries', data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  clearDiaryListCache();
  return response.data;
};

// 更新日记
export const updateDiary = async (id: number, formData: FormData) => {
  const response = await api.put(`/diaries/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  clearDiaryListCache();
  return response.data;
};

// 删除日记
export const deleteDiary = async (id: number) => {
  const response = await api.delete(`/diaries/${id}`);
  clearDiaryListCache();
  return response.data;
};

