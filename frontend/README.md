# 拾光日记 - 前端项目

基于 React + TypeScript + Vite 构建的现代化日记应用前端。

## 版本信息

**当前版本**: v1.3.0

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **路由**: React Router v6
- **状态管理**: Zustand
- **样式**: Tailwind CSS
- **HTTP客户端**: Axios
- **图标**: Lucide React

## 设计系统

### 配色方案
- Primary: #2563EB (蓝色)
- Secondary: #3B82F6 (浅蓝)
- CTA: #F97316 (橙色)
- Background: #F8FAFC (浅灰)
- Text: #1E293B (深灰)

### 字体
- 标题: Caveat (手写风格)
- 正文: Quicksand (圆润友好)

### 设计风格
- Soft UI Evolution
- 内容优先
- 温暖、个人化
- WCAG AA+ 无障碍标准

## 路由配置

- `/` - 首页（日记列表）
- `/post/:id` - 日记详情
- `/write` - 写日记（需登录）
- `/profile` - 个人中心（需登录）
- `/login` - 登录
- `/register` - 注册

## 功能特性

### 已实现 ✅

#### v1.0.0 - 项目初始化
- 项目脚手架搭建
- Tailwind CSS 配置
- 路由系统配置
- 状态管理（Zustand）
- API 请求封装
- 认证状态管理
- 受保护路由

#### v1.1.0 - 日记列表
- 日记卡片展示（标题、封面、作者、时间、浏览量）
- 无限滚动加载（每次10条）
- 关键词搜索
- 点击跳转详情
- 回到顶部按钮
- 空状态提示
- 响应式布局

#### v1.3.0 - 写日记功能
- 标题和内容输入
- 封面、图片、视频上传（拖拽支持）
- 实时预览（响应式）
- 创建和编辑日记
- 文件验证和预览
- 权限控制

#### v1.2.0 - 日记详情
- 根据 ID 获取日记详情
- 渲染标题、内容、封面、图片、视频
- 显示作者信息、发布时间、浏览次数
- 权限控制（仅作者可编辑/删除）
- 图片查看器（支持左右切换、键盘导航）
- 删除确认模态框
- 编辑跳转

### 待实现 ⏳
- 用户登录/注册界面
- 个人中心
- 日记分类和标签

## 项目结构

```
frontend/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── DiaryCard.tsx    # 日记卡片
│   │   ├── SearchBar.tsx    # 搜索栏
│   │   ├── LoadingSpinner.tsx # 加载动画
│   │   ├── EmptyState.tsx   # 空状态
│   │   ├── ImageViewer.tsx  # 图片查看器
│   │   ├── FileUpload.tsx   # 文件上传
│   │   ├── DiaryPreview.tsx # 日记预览
│   │   └── Layout.tsx       # 布局组件
│   ├── pages/               # 页面组件
│   │   ├── Home.tsx         # 首页（日记列表）
│   │   ├── DiaryDetail.tsx  # 日记详情
│   │   ├── WriteDiary.tsx   # 写日记/编辑
│   │   ├── Profile.tsx      # 个人中心
│   │   ├── Login.tsx        # 登录
│   │   └── Register.tsx     # 注册
│   ├── services/            # API 服务
│   │   └── diaryService.ts  # 日记相关 API
│   ├── store/               # 状态管理
│   │   └── authStore.ts     # 认证状态
│   ├── lib/                 # 工具函数
│   │   └── api.ts           # Axios 配置
│   ├── App.tsx              # 根组件
│   ├── main.tsx             # 入口文件
│   └── index.css            # 全局样式
├── public/                  # 静态资源
├── DIARY_LIST_TEST.md       # 列表功能测试文档
├── DIARY_DETAIL_TEST.md     # 详情功能测试文档
└── package.json
```

## 安装与运行

### 安装依赖
```bash
npm install
```

### 配置环境变量
```bash
# .env 文件已创建，默认连接本地后端
VITE_API_BASE_URL=http://localhost:3000/api
```

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 核心功能说明

### 1. 日记列表
- 响应式网格布局（移动端1列、平板2列、桌面3列）
- 使用 IntersectionObserver 实现无限滚动
- 实时搜索，支持标题和内容关键词
- 优雅的卡片设计，带 hover 效果

### 2. 日记详情
- 完整展示日记内容
- 图片网格展示，点击打开查看器
- 视频播放支持
- 权限控制：仅作者可编辑/删除
- 删除二次确认

### 3. 写日记功能
- 标题和内容输入
- 文件上传（封面、图片、视频）
- 拖拽上传支持
- 文件预览和删除
- 实时预览（响应式）
- 创建和编辑模式
- 权限验证
### 4. 图片查看器
- 全屏显示
- 左右箭头切换
- 键盘导航（← → ESC）
- 缩略图导航
- 图片计数显示

## 开发规范

### 代码规范
- TypeScript 严格模式
- ESLint 代码检查
- 组件化开发
- 函数式组件 + Hooks

### 样式规范
- Tailwind CSS 工具类
- 响应式断点：375px, 768px, 1024px, 1440px
- 动画时长：150-300ms
- 支持 prefers-reduced-motion

### 无障碍规范
- 语义化 HTML 标签
- ARIA 标签和角色
- 键盘导航支持
- Focus 状态可见
- 颜色对比度 WCAG AA

## 性能优化

- 图片懒加载 `loading="lazy"`
- 路由懒加载
- 代码分割
- 防抖和节流
- 条件渲染

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 测试

详细测试文档：
- [日记列表测试](./DIARY_LIST_TEST.md)
- [日记详情测试](./DIARY_DETAIL_TEST.md)
- [写日记测试](./WRITE_DIARY_TEST.md)

## 版本历史

### v1.3.0 (2024-03-25)
- ✨ 实现写日记功能
- ✨ 添加文件上传组件
- ✨ 实时预览（响应式）
- ✨ 支持编辑模式

### v1.2.0 (2024-03-25)
- ✨ 实现日记详情页
- ✨ 添加图片查看器
- ✨ 实现编辑和删除功能
- ✨ 添加权限控制

### v1.1.0 (2024-03-25)
- ✨ 实现日记列表展示
- ✨ 实现无限滚动加载
- ✨ 实现关键词搜索
- ✨ 添加回到顶部按钮

### v1.0.0 (2024-03-25)
- 🎉 项目初始化
- ⚙️ 配置开发环境
- 🎨 配置设计系统
- 🔧 配置路由和状态管理

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交变更
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

