const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// 获取个人信息
router.get('/profile', authMiddleware, userController.getProfile);

// 更新个人信息
router.put('/profile', authMiddleware, userController.updateProfile);

// 修改密码
router.put('/password', authMiddleware, userController.updatePassword);

module.exports = router;

