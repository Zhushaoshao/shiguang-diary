const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

const buildUserResponse = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  avatar: user.avatar || null,
  created_at: user.created_at,
});

// 获取个人信息
exports.getProfile = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, username, email, avatar, created_at FROM users WHERE id = ?',
      [req.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json({ user: buildUserResponse(users[0]) });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 更新个人信息
exports.updateProfile = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: '邮箱不能为空' });
    }

    // 检查邮箱是否被其他用户使用
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND id != ?',
      [email, req.userId]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: '邮箱已被使用' });
    }

    // 更新用户信息
    await pool.query(
      'UPDATE users SET email = ? WHERE id = ?',
      [email, req.userId]
    );

    res.json({ message: '更新成功' });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 上传头像
exports.uploadAvatar = async (req, res) => {
  try {
    const avatar = req.file?.filename;

    if (!avatar) {
      return res.status(400).json({ message: '请选择头像图片' });
    }

    await pool.query(
      'UPDATE users SET avatar = ? WHERE id = ?',
      [avatar, req.userId]
    );

    const [users] = await pool.query(
      'SELECT id, username, email, avatar, created_at FROM users WHERE id = ?',
      [req.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json({
      message: '头像上传成功',
      user: buildUserResponse(users[0])
    });
  } catch (error) {
    console.error('上传头像错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 修改密码
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: '密码不能为空' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: '新密码至少6个字符' });
    }

    // 获取用户当前密码
    const [users] = await pool.query(
      'SELECT password FROM users WHERE id = ?',
      [req.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 验证旧密码
    const isMatch = await bcrypt.compare(oldPassword, users[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: '当前密码错误' });
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, req.userId]
    );

    res.json({ message: '密码修改成功' });
  } catch (error) {
    console.error('修改密码错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

