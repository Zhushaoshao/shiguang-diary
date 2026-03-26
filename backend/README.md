# 拾光日记后端项目

## 项目结构

```
backend/
├── config/              # 配置文件
│   └── database.js      # 数据库连接配置
├── controllers/         # 控制器层
│   ├── auth.controller.js
│   ├── user.controller.js
│   └── diary.controller.js
├── middleware/          # 中间件
│   ├── auth.middleware.js
│   └── upload.middleware.js
├── routes/              # 路由层
│   ├── auth.routes.js
│   ├── user.routes.js
│   └── diary.routes.js
├── database/            # 数据库脚本
│   └── schema.sql
├── uploads/             # 文件上传目录
├── .env.example         # 环境变量示例
├── .gitignore
├── package.json
└── server.js            # 入口文件
```

## 技术栈

- Node.js + Express
- MySQL
- JWT 认证
- Multer 文件上传
- bcryptjs 密码加密

## 安装与运行

1. 安装依赖：
```bash
npm install
```

2. 配置环境变量：
```bash
# .env 文件已创建，请根据实际情况修改数据库配置
# 主要修改：DB_PASSWORD（数据库密码）
```

3. 初始化数据库：
```bash
# 方式一：使用脚本自动创建（推荐）
npm run init-db

# 方式二：手动导入 SQL
mysql -u root -p < database/schema.sql
```

4. 启动服务：
```bash
npm run dev  # 开发模式（自动重启）
npm start    # 生产模式
```

5. 测试接口：
服务启动后访问 http://localhost:3000/health 检查服务状态

## API 接口

### 认证接口
- POST /api/auth/register - 用户注册
- POST /api/auth/login - 用户登录

### 用户接口
- GET /api/users/profile - 获取个人信息（需认证）
- PUT /api/users/profile - 更新个人信息（需认证）

### 日记接口
- POST /api/diaries - 创建日记（需认证）
- GET /api/diaries - 获取日记列表
- GET /api/diaries/search - 搜索日记
- GET /api/diaries/:id - 获取日记详情
- PUT /api/diaries/:id - 更新日记（需认证）
- DELETE /api/diaries/:id - 删除日记（需认证）

