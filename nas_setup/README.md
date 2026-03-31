# NAS 部署说明

`nas_setup` 目录用于群晖 Container Manager / Docker Compose 部署。

## 目录说明
- `docker-compose.yml`：前端、后端、MySQL 编排
- `backend.Dockerfile`：后端镜像构建
- `frontend.Dockerfile`：前端镜像构建
- `nginx.conf`：前端静态托管与 `/api`、`/uploads` 反代
- `.env.example`：环境变量示例

## 部署前准备
1. 将项目完整上传到 NAS
2. 确保目录结构为：
   ```text
   shiguang-diary/
   ├── backend/
   ├── frontend/
   └── nas_setup/
   ```
3. 在 `nas_setup` 下准备：
   - `.env`
   - `data/mysql`
   - `data/uploads`

## .env 示例
将 `.env.example` 复制为 `.env` 后至少修改：
- `MYSQL_ROOT_PASSWORD`
- `MYSQL_PASSWORD`
- `JWT_SECRET`
- `VITE_API_BASE_URL`

局域网示例：
```env
FRONTEND_PORT=8080
MYSQL_ROOT_PASSWORD=你的root密码
MYSQL_DATABASE=shiguang_diary
MYSQL_USER=user
MYSQL_PASSWORD=你的数据库密码
JWT_SECRET=一串足够长的随机密钥
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE=10485760
VITE_API_BASE_URL=http://你的NAS局域网IP:8080/api
```

## 启动方式
在 `nas_setup` 目录执行：
```bash
docker compose up -d --build
```

首次成功后访问：
- `http://NAS_IP:8080`

## 当前部署逻辑
- MySQL 使用 `mysql:8.0`
- backend 启动时会先执行 `node init-db.js`，再启动服务
- frontend 使用 Nginx 托管静态文件，并反代 `/api` 与 `/uploads`

## 常见问题
### 1. mysql 镜像拉不下来
可在其他机器上先拉取并导出：
- `mysql:8.0`
- `node:20-alpine`
- `nginx:alpine`
然后导入群晖本地镜像库。

### 2. Bind mount failed: data/mysql does not exist
请先创建：
- `nas_setup/data/mysql`
- `nas_setup/data/uploads`

### 3. backend 改了但群晖没生效
如果改动了以下文件，必须重新构建镜像，不是只重启容器：
- `nas_setup/backend.Dockerfile`
- `backend/init-db.js`
- `backend/database/schema.sql`
- `backend/config/database.js`

### 4. MySQL 初始化异常
若当前没有正式数据，可清空 `nas_setup/data/mysql` 后重新部署。

## 推荐域名结构
- 前端：`https://diary.xxx.com`
- API：`https://diary.xxx.com/api`
- 文件：`https://diary.xxx.com/uploads`

## 建议
- 正式环境建议配群晖反向代理 + HTTPS
- 数据库和上传目录建议定期备份
- 外网访问建议统一走单域名反代

