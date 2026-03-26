# 拾光日记 - 快速启动指南

## 项目结构

```
shiguang-diary V2/
├── backend/          # Node.js + Express 后端
└── frontend/         # React + TypeScript 前端
```

## 启动步骤

### 1. 启动后端服务

```bash
# 进入后端目录
cd backend

# 安装依赖（首次运行）
npm install

# 配置数据库
# 编辑 .env 文件，确保数据库配置正确

# 初始化数据库
npm run init-db

# 启动开发服务器
npm run dev
```

后端服务将运行在 http://localhost:3000

### 2. 启动前端服务

```bash
# 打开新终端，进入前端目录
cd frontend

# 安装依赖（首次运行）
npm install

# 启动开发服务器
npm run dev
```

前端服务将运行在 http://localhost:5173

### 3. 访问应用

打开浏览器访问: http://localhost:5173

## 功能测试

### 已实现功能

#### 后端 (v1.1.0)
- ✅ 用户注册和登录
- ✅ JWT 认证
- ✅ 日记 CRUD 接口
- ✅ 文件上传支持
- ✅ 日记搜索和分页

#### 前端 (v1.3.0)
- ✅ 日记列表展示
- ✅ 无限滚动加载
- ✅ 关键词搜索
- ✅ 日记详情页
- ✅ 图片查看器
- ✅ 编辑和删除功能（权限控制）
- ✅ 写日记功能
- ✅ 文件上传（封面、图片、视频）
- ✅ 实时预览（响应式）
- ✅ 响应式设计

### 测试用例

1. **查看日记列表**
   - 访问首页查看日记卡片
   - 向下滚动测试无限加载

2. **搜索日记**
   - 在搜索框输入关键词
   - 查看搜索结果

3. **跳转详情**
   - 点击任意日记卡片
   - 查看日记详情页

4. **图片查看器**
   - 在详情页点击图片
   - 使用左右箭头或键盘切换
   - 按 ESC 关闭

5. **编辑和删除**（需要登录）
   - 查看自己的日记
   - 点击编辑或删除按钮

6. **写日记**（需要登录）
   - 点击写日记按钮
   - 输入标题和内容
   - 上传封面、图片、视频
   - 查看实时预览
   - 点击发布

## API 测试

可以使用 Postman 或 cURL 测试后端接口：

### 注册用户
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"123456"}'
```

### 登录
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"123456"}'
```

### 获取日记列表
```bash
curl http://localhost:3000/api/diaries?page=1&limit=10
```

## 常见问题

### 1. 后端启动失败
- 检查 MySQL 是否已启动
- 检查 .env 文件中的数据库配置
- 运行 `npm run init-db` 初始化数据库

### 2. 前端无法连接后端
- 确保后端服务已启动
- 检查 frontend/.env 中的 API 地址配置
- 检查浏览器控制台是否有 CORS 错误

### 3. 图片无法显示
- 确保后端 uploads 目录存在
- 检查图片路径是否正确
- 确认后端静态文件服务已配置

## 下一步开发

### 待实现功能
- ⏳ 用户登录/注册界面
- ⏳ 个人中心
- ⏳ 日记分类和标签

## 技术栈

### 后端
- Node.js + Express
- MySQL + mysql2
- JWT 认证
- Multer 文件上传
- bcryptjs 密码加密

### 前端
- React 18 + TypeScript
- Vite
- React Router v6
- Zustand 状态管理
- Tailwind CSS
- Axios
- Lucide React 图标

## 版本信息

- 后端: v1.1.0
- 前端: v1.3.0

## Git 版本管理

### 打标签
```bash
# 后端
cd backend
git tag v1.1.0

# 前端
cd frontend
git tag v1.3.0
```

### 推送到 GitHub
```bash
# 添加远程仓库（首次）
git remote add origin <你的GitHub仓库地址>

# 推送代码和标签
git push origin master --tags
```

