const mysql = require('mysql2/promise');
require('dotenv').config();

// 创建数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试数据库连接
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ 数据库连接成功');
    connection.release();
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    process.exit(1);
  }
};

const ensureUserAvatarColumn = async () => {
  try {
    const [columns] = await pool.query(
      `SELECT COLUMN_NAME
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'avatar'`,
      [process.env.DB_NAME]
    );

    if (columns.length === 0) {
      await pool.query('ALTER TABLE users ADD COLUMN avatar VARCHAR(255) NULL AFTER email');
      console.log('✅ 已自动补齐 users.avatar 字段');
    }
  } catch (error) {
    console.error('❌ 检查/补齐 avatar 字段失败:', error.message);
    throw error;
  }
};

module.exports = { pool, testConnection, ensureUserAvatarColumn };

