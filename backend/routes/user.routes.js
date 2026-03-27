const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// 获取个人信息
router.get('/profile', authMiddleware, userController.getProfile);

// 更新个人信息
router.put('/profile', authMiddleware, userController.updateProfile);

// 上传头像
router.post('/avatar', authMiddleware, upload.single('avatar'), userController.uploadAvatar);

// 修改密码
router.put('/password', authMiddleware, userController.updatePassword);

module.exports = router;

