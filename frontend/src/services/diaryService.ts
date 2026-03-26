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

// 获取日记列表
export const getDiaries = async (page = 1, limit = 10): Promise<DiaryListResponse> => {
  const response = await api.get('/diaries', {
    params: { page, limit },
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

// 创建日记
export const createDiary = async (data: FormData | { title: string; content: string; diaryDate?: string }) => {
  const isFormData = data instanceof FormData;
  const response = await api.post('/diaries', data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
};

// 更新日记
export const updateDiary = async (id: number, formData: FormData) => {
  const response = await api.put(`/diaries/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// 删除日记
export const deleteDiary = async (id: number) => {
  const response = await api.delete(`/diaries/${id}`);
  return response.data;
};

