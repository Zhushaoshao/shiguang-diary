const express = require('express');
const router = express.Router();
const diaryController = require('../controllers/diary.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// 创建日记
router.post('/', authMiddleware, upload.fields([
  { name: 'images', maxCount: 9 },
  { name: 'videos', maxCount: 3 },
  { name: 'cover', maxCount: 1 }
]), diaryController.createDiary);

// 获取日记列表
router.get('/', diaryController.getDiaries);

// 搜索日记
router.get('/search', diaryController.searchDiaries);

// 获取日记详情
router.get('/:id', diaryController.getDiaryById);

// 增加浏览次数
router.post('/:id/view', diaryController.incrementDiaryViews);

// 更新日记
router.put('/:id', authMiddleware, upload.fields([
  { name: 'images', maxCount: 9 },
  { name: 'videos', maxCount: 3 },
  { name: 'cover', maxCount: 1 }
]), diaryController.updateDiary);

// 删除日记
router.delete('/:id', authMiddleware, diaryController.deleteDiary);

module.exports = router;

