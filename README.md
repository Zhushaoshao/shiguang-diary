# 拾光日记

一个基于 React + Node.js 的全栈日记应用，支持多媒体内容、智能日期识别和批量导入。

## ✨ 功能特点

- 📝 **日记管理**：创建、编辑、删除、搜索日记
- 🖼️ **多媒体支持**：支持封面图、多图片、多视频上传
- 📅 **自定义日期**：可自定义日记日期时间
- 📦 **批量导入**：智能识别日期，一键导入多篇日记
- 🔐 **用户认证**：JWT 认证，安全可靠
- 🎨 **现代设计**：Neumorphism 风格，简洁优雅
- 📱 **响应式布局**：完美适配桌面和移动端

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- MySQL >= 5.7

### 安装步骤

#### 1. 克隆项目
```bash
git clone https://github.com/你的用户名/shiguang-diary.git
cd shiguang-diary
```

#### 2. 配置后端
```bash
cd backend
npm install

# 配置数据库
cp .env.example .env
# 编辑 .env 文件，填入数据库信息

# 初始化数据库
npm run init-db

# 启动后端
npm run dev
```

#### 3. 配置前端
```bash
cd frontend
npm install

# 启动前端
npm run dev
```

#### 4. 访问应用
打开浏览器访问 `http://localhost:5173`

## 📁 项目结构

```
shiguang-diary/
├── backend/              # 后端服务
│   ├── config/          # 配置文件
│   ├── controllers/     # 控制器
│   ├── middleware/      # 中间件
│   ├── routes/          # 路由
│   └── uploads/         # 上传文件目录
├── frontend/            # 前端应用
│   ├── src/
│   │   ├── components/  # 组件
│   │   ├── pages/       # 页面
│   │   ├── services/    # API 服务
│   │   ├── store/       # 状态管理
│   │   └── utils/       # 工具函数
│   └── public/          # 静态资源
└── README.md
```

## 🛠️ 技术栈

### 后端
- Node.js + Express
- MySQL
- JWT 认证
- Multer 文件上传

### 前端
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand 状态管理
- React Router
- Axios

## 📖 主要功能

### 日记管理
- 创建日记（支持标题、内容、封面、图片、视频）
- 编辑日记（保留已有文件）
- 删除日记
- 搜索日记
- 自定义日记日期

### 批量导入
- 粘贴长文本
- 智能识别日期时间（支持多种格式）
- 自动拆分成多篇日记
- 可编辑标题和内容
- 一键批量提交

### 用户系统
- 用户注册
- 用户登录
- 个人中心
- 修改密码

## 🎨 设计风格

采用 Neumorphism（新拟态）设计风格：
- 轻量弥散阴影
- 柔和凸起质感
- 暖橙色主色调
- 大圆角设计
- 平滑过渡动画

## 📝 开发日志

详见 [QUICK_START.md](./QUICK_START.md)

## 📄 许可证

MIT License

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题，请提交 Issue。

