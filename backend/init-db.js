const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
  let connection;

  try {
    // 先连接到 MySQL（不指定数据库）
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.MYSQL_ROOT_USER || 'root',
      password: process.env.MYSQL_ROOT_PASSWORD || process.env.DB_PASSWORD
    });

    console.log('✅ 已连接到 MySQL 服务器');

    // 读取 SQL 文件
    const sqlFile = path.join(__dirname, 'database', 'schema.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // 分割 SQL 语句并执行
    const statements = sql.split(';').filter(stmt => stmt.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }

    const [avatarColumns] = await connection.query(
      `SELECT COLUMN_NAME
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'avatar'`,
      [process.env.DB_NAME]
    );

    if (avatarColumns.length === 0) {
      await connection.query('ALTER TABLE users ADD COLUMN avatar VARCHAR(255) DEFAULT NULL');
      console.log('✅ 已补齐 users.avatar 字段');
    }

    console.log('✅ 数据库初始化成功');
    console.log(`✅ 数据库名称: ${process.env.DB_NAME}`);
    console.log('✅ 数据表已创建: users, diaries');

  } catch (error) {
    console.error('❌ 数据库初始化失败:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();

