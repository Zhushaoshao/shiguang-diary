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
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
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

    await connection.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS avatar VARCHAR(255) DEFAULT NULL
    `);


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

