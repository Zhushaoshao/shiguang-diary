const { pool } = require('../config/database');

const parseVideoField = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string') return [];

  const trimmed = value.trim();
  if (!trimmed) return [];

  const firstChar = trimmed[0];
  const looksLikeJson = firstChar === '[' || firstChar === '{' || firstChar === '"';

  if (looksLikeJson) {
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [trimmed];
    }
  }

  return [trimmed];
};

const buildDiaryDetail = (rawDiary) => {
  let images = [];
  let videos = [];

  try {
    if (rawDiary.images) {
      if (Array.isArray(rawDiary.images)) {
        images = rawDiary.images;
      } else if (typeof rawDiary.images === 'string') {
        images = JSON.parse(rawDiary.images);
      }
    }
  } catch (error) {
    console.error('解析图片 JSON 失败:', rawDiary.id, rawDiary.images, error.message);
    images = [];
  }

  videos = parseVideoField(rawDiary.video);

  return {
    ...rawDiary,
    images,
    video: videos,
  };
};


// 创建日记
exports.createDiary = async (req, res) => {
  try {
    console.log('=== 创建日记请求 ===');
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    console.log('User ID:', req.userId);

    const { title, content, diaryDate } = req.body;
    const userId = req.userId;

    if (!title || !content) {
      return res.status(400).json({ message: '标题和内容不能为空' });
    }

    // 处理日记日期
    const createdAt = diaryDate ? new Date(diaryDate) : new Date();

    // 处理上传的文件
    const images = req.files?.images?.map(file => file.filename) || [];
    const videos = req.files?.videos?.map(file => file.filename) || [];
    const cover = req.files?.cover?.[0]?.filename || null;

    console.log('处理后的文件:');
    console.log('- 封面:', cover);
    console.log('- 图片:', images);
    console.log('- 视频:', videos);
    console.log('- 日记日期:', createdAt);

    // 视频字段存储为 JSON 数组
    const videoField = videos.length > 0 ? JSON.stringify(videos) : null;

    const [result] = await pool.query(
      'INSERT INTO diaries (user_id, title, content, images, video, cover, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, title, content, JSON.stringify(images), videoField, cover, createdAt]
    );

    console.log('日记创建成功, ID:', result.insertId);

    res.status(201).json({
      message: '日记创建成功',
      diaryId: result.insertId
    });
  } catch (error) {
    console.error('创建日记错误:', error);
    console.error('错误堆栈:', error.stack);
    res.status(500).json({
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取日记列表
exports.getDiaries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [diaries] = await pool.query(
      `SELECT d.*, u.username
       FROM diaries d
       JOIN users u ON d.user_id = u.id
       ORDER BY d.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM diaries');
    const total = countResult[0].total;

    // 安全解析 JSON
    const parseDiaries = diaries.map(diary => {
      let images = [];
      let videos = [];

      try {
        if (diary.images) {
          // 如果已经是数组，直接使用
          if (Array.isArray(diary.images)) {
            images = diary.images;
          } else if (typeof diary.images === 'string') {
            // 如果是字符串，尝试解析
            images = JSON.parse(diary.images);
          }
        }
      } catch (error) {
        console.error('解析图片 JSON 失败:', diary.id, diary.images, error.message);
        images = [];
      }

      videos = parseVideoField(diary.video);

      return {
        ...diary,
        images,
        video: videos
      };
    });

    res.json({
      diaries: parseDiaries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('获取日记列表错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 搜索日记
exports.searchDiaries = async (req, res) => {
  try {
    const { keyword } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    if (!keyword) {
      return res.status(400).json({ message: '搜索关键词不能为空' });
    }

    const searchPattern = `%${keyword}%`;
    const [diaries] = await pool.query(
      `SELECT d.*, u.username
       FROM diaries d
       JOIN users u ON d.user_id = u.id
       WHERE d.title LIKE ? OR d.content LIKE ?
       ORDER BY d.created_at DESC
       LIMIT ? OFFSET ?`,
      [searchPattern, searchPattern, limit, offset]
    );

    // 安全解析 JSON
    const parseDiaries = diaries.map(diary => {
      let images = [];
      let videos = [];

      try {
        if (diary.images) {
          if (Array.isArray(diary.images)) {
            images = diary.images;
          } else if (typeof diary.images === 'string') {
            images = JSON.parse(diary.images);
          }
        }
      } catch (error) {
        console.error('解析图片 JSON 失败:', diary.id, diary.images, error.message);
        images = [];
      }

      videos = parseVideoField(diary.video);

      return {
        ...diary,
        images,
        video: videos
      };
    });

    res.json({
      diaries: parseDiaries
    });
  } catch (error) {
    console.error('搜索日记错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取日记详情
exports.getDiaryById = async (req, res) => {
  try {
    const { id } = req.params;

    const [diaries] = await pool.query(
      `SELECT d.*, u.username
       FROM diaries d
       JOIN users u ON d.user_id = u.id
       WHERE d.id = ?`,
      [id]
    );

    if (diaries.length === 0) {
      return res.status(404).json({ message: '日记不存在' });
    }

    const diary = buildDiaryDetail(diaries[0]);

    res.json({ diary });
  } catch (error) {
    console.error('获取日记详情错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 增加浏览次数
exports.incrementDiaryViews = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('UPDATE diaries SET views = views + 1 WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '日记不存在' });
    }

    res.json({ message: '浏览次数更新成功' });
  } catch (error) {
    console.error('更新浏览次数错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 更新日记
exports.updateDiary = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, diaryDate, keepCover, keepImages, keepVideos } = req.body;
    const userId = req.userId;

    // 检查日记是否存在且属于当前用户
    const [diaries] = await pool.query(
      'SELECT * FROM diaries WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (diaries.length === 0) {
      return res.status(404).json({ message: '日记不存在或无权限' });
    }

    // 处理封面
    let cover = req.files?.cover?.[0]?.filename || keepCover || diaries[0].cover;

    // 处理图片 - 合并保留的和新上传的
    let finalImages = [];

    // 添加保留的图片
    if (keepImages) {
      try {
        const keptImages = JSON.parse(keepImages);
        if (Array.isArray(keptImages)) {
          finalImages = [...keptImages];
        }
      } catch (error) {
        console.error('解析保留图片失败:', error);
      }
    }

    // 添加新上传的图片
    if (req.files?.images) {
      const newImages = req.files.images.map(file => file.filename);
      finalImages = [...finalImages, ...newImages];
    }

    // 处理视频 - 合并保留的和新上传的
    let finalVideos = [];

    // 添加保留的视频
    if (keepVideos) {
      try {
        const keptVideos = JSON.parse(keepVideos);
        if (Array.isArray(keptVideos)) {
          finalVideos = [...keptVideos];
        }
      } catch (error) {
        console.error('解析保留视频失败:', error);
      }
    }

    // 添加新上传的视频
    if (req.files?.videos) {
      const newVideos = req.files.videos.map(file => file.filename);
      finalVideos = [...finalVideos, ...newVideos];
    }

    // 兼容旧的单视频字段
    const videoField = finalVideos.length > 0 ? JSON.stringify(finalVideos) : null;

    // 处理日记日期
    const createdAt = diaryDate ? new Date(diaryDate) : diaries[0].created_at;

    console.log('更新日记文件:');
    console.log('- 封面:', cover);
    console.log('- 图片:', finalImages);
    console.log('- 视频:', finalVideos);
    console.log('- 日记日期:', createdAt);

    await pool.query(
      'UPDATE diaries SET title = ?, content = ?, images = ?, video = ?, cover = ?, created_at = ? WHERE id = ?',
      [title, content, JSON.stringify(finalImages), videoField, cover, createdAt, id]
    );

    res.json({ message: '日记更新成功' });
  } catch (error) {
    console.error('更新日记错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 删除日记
exports.deleteDiary = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // 检查日记是否存在且属于当前用户
    const [diaries] = await pool.query(
      'SELECT * FROM diaries WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (diaries.length === 0) {
      return res.status(404).json({ message: '日记不存在或无权限' });
    }

    await pool.query('DELETE FROM diaries WHERE id = ?', [id]);

    res.json({ message: '日记删除成功' });
  } catch (error) {
    console.error('删除日记错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

