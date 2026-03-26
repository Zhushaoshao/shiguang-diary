# API 接口测试文档

## 认证接口

### 1. 用户注册

**接口地址：** `POST http://localhost:3000/api/auth/register`

**请求参数：**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "123456"
}
```

**参数验证规则：**
- `username`: 3-20个字符
- `email`: 必须是有效的邮箱格式
- `password`: 至少6个字符

**成功响应（201）：**
```json
{
  "message": "注册成功",
  "userId": 1
}
```

**失败响应（400）：**
```json
{
  "errors": [
    {
      "msg": "用户名长度为3-20个字符",
      "param": "username"
    }
  ]
}
```

或

```json
{
  "message": "用户名或邮箱已存在"
}
```

**cURL 测试命令：**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"123456\"}"
```

---

### 2. 用户登录

**接口地址：** `POST http://localhost:3000/api/auth/login`

**请求参数：**
```json
{
  "username": "testuser",
  "password": "123456"
}
```

**成功响应（200）：**
```json
{
  "message": "登录成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

**失败响应（401）：**
```json
{
  "message": "用户名或密码错误"
}
```

**cURL 测试命令：**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"password\":\"123456\"}"
```

---

## 使用 Postman 测试

### 注册接口测试步骤：
1. 打开 Postman
2. 选择 POST 方法
3. 输入 URL: `http://localhost:3000/api/auth/register`
4. 选择 Body -> raw -> JSON
5. 输入请求参数
6. 点击 Send

### 登录接口测试步骤：
1. 选择 POST 方法
2. 输入 URL: `http://localhost:3000/api/auth/login`
3. 选择 Body -> raw -> JSON
4. 输入请求参数
5. 点击 Send
6. 复制返回的 token，用于后续需要认证的接口

### 使用 Token 访问需要认证的接口：
在 Headers 中添加：
```
Authorization: Bearer <your_token_here>
```

---

## 功能特性

### 注册功能
✅ 参数验证（用户名3-20字符，邮箱格式，密码至少6位）  
✅ 检查用户名和邮箱是否已存在  
✅ 密码使用 bcrypt 加密存储  
✅ 返回新用户ID

### 登录功能
✅ 验证用户是否存在  
✅ 验证密码是否正确  
✅ 生成 JWT Token（有效期7天）  
✅ 返回用户基本信息（不含密码）

### 安全特性
- 密码使用 bcrypt 加密，加密强度为10
- JWT Token 用于身份认证
- 登录失败不暴露具体是用户名还是密码错误
- 所有敏感操作都有错误处理

