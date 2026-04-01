# 拾光日记

![1775030109490](image/README/1775030109490.png)

一个基于 React + Express + MySQL 的全栈日记应用，支持账户隔离、多媒体上传、批量导入与 NAS 部署。

## 当前版本能力

- 仅登录用户可访问首页、详情、写日记、批量导入、个人中心
- 日记列表、搜索、详情仅可查看当前账号自己的内容
- 支持封面图、图片、视频上传
- 支持头像上传、持久化与回显
- 支持批量导入与自定义日记日期
- 已提供群晖 NAS 的 Docker 部署方案

## 技术栈

### 前端

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- React Router
- Axios

### 后端

- Node.js
- Express
- MySQL 8
- JWT
- Multer

## 本地开发

### 环境要求

- Node.js >= 20
- MySQL >= 8

### 后端启动

```bash
cd backend
npm install
npm run init-db
npm run dev
```

后端需自行准备 `.env`，核心项包括：

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

前端默认访问：

- `http://localhost:5173`

如需自定义 API 地址，可配置：

- `VITE_API_BASE_URL`

## 项目结构

```text
shiguang-diary/
├── backend/      # Express + MySQL 后端
├── frontend/     # React 前端
├── nas_setup/    # 群晖 NAS / Docker 部署文件
└── README.md
```

## 核心功能

### 日记系统

- 创建、编辑、删除日记
- 搜索自己的日记
- 详情页仅本人可见
- 支持封面、图片、视频
- 支持自定义日记时间

### 用户系统

- 注册 / 登录
- JWT 认证
- 个人中心
- 修改密码
- 头像上传与展示

### 批量导入

- 粘贴长文本拆分多篇日记
- 智能识别日期
- 批量提交

## 权限说明

- 未登录：不可访问日记内容
- 已登录：只能查看当前账号自己的日记
- 日记浏览次数更新同样受本人权限限制

## NAS 部署

群晖部署相关文件已单独放在：

- [`nas_setup/`](./nas_setup)

建议阅读：

- [`nas_setup/README.md`](./nas_setup/README.md)

## 说明

- 当前 NAS 方案为 Docker / Container Manager 部署路径
- 首次部署需确保 MySQL 数据目录为空，或按文档重新初始化
- 若变更 Dockerfile、schema.sql、init-db.js，需重新构建镜像
