# 羽约吧 - Supabase 后端配置指南

本指南将帮助您完成 Supabase 后端的完整配置。

## 📋 目录

1. [创建 Supabase 项目](#1-创建-supabase-项目)
2. [配置数据库](#2-配置数据库)
3. [设置认证](#3-设置认证)
4. [配置环境变量](#4-配置环境变量)
5. [测试连接](#5-测试连接)
6. [常见问题](#6-常见问题)

## 1. 创建 Supabase 项目

### 步骤 1.1: 注册 Supabase 账号

1. 访问 https://supabase.com
2. 点击 "Start your project"
3. 使用 GitHub 或邮箱注册账号

### 步骤 1.2: 创建新项目

1. 登录后，点击 "New Project"
2. 填写项目信息：
   - **Name**: 羽约吧 (或任意名称)
   - **Database Password**: 设置一个强密码（请妥善保存）
   - **Region**: 选择 Northeast Asia (Tokyo) 或最近的区域
   - **Pricing Plan**: 选择 Free（免费版足够开发使用）

3. 点击 "Create new project"
4. 等待 1-2 分钟，项目创建完成

### 步骤 1.3: 获取项目凭证

项目创建完成后：

1. 进入项目仪表板
2. 点击左侧菜单的 "Settings" (设置)
3. 选择 "API"
4. 记录以下信息：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 2. 配置数据库

### 步骤 2.1: 打开 SQL Editor

1. 在 Supabase 仪表板左侧菜单中
2. 点击 "SQL Editor"
3. 点击 "New query"

### 步骤 2.2: 执行数据库架构

1. 打开项目中的 `supabase/schema.sql` 文件
2. 复制全部内容
3. 粘贴到 SQL Editor 中
4. 点击右下角的 "Run" 按钮
5. 等待执行完成（应该显示 "Success. No rows returned"）

### 步骤 2.3: 插入测试数据（可选）

1. 创建新的 SQL 查询
2. 打开 `supabase/seed.sql` 文件
3. 复制全部内容并粘贴
4. 点击 "Run"

### 步骤 2.4: 验证表创建

1. 点击左侧菜单的 "Table Editor"
2. 应该能看到以下表：
   - profiles
   - venues
   - bookings
   - booking_participants
   - team_invitations
   - team_participants
   - notifications
   - reviews
   - favorites

## 3. 设置认证

### 步骤 3.1: 配置邮箱认证

1. 点击左侧菜单 "Authentication"
2. 选择 "Providers"
3. 确保 "Email" 已启用
4. 配置邮件模板（可选）：
   - 点击 "Email Templates"
   - 自定义确认邮件、重置密码邮件等

### 步骤 3.2: 配置认证设置

1. 在 Authentication 页面
2. 点击 "Settings"
3. 推荐配置：
   - **Site URL**: `http://localhost:5173` (开发环境)
   - **Redirect URLs**: 添加 `http://localhost:5173/**`
   - **Email Confirm**: 开启（生产环境）或关闭（开发环境）

## 4. 配置环境变量

### 步骤 4.1: 创建环境文件

在项目根目录创建 `.env.local` 文件：

```bash
# Windows
copy .env.example .env.local

# Mac/Linux
cp .env.example .env.local
```

### 步骤 4.2: 填写凭证

编辑 `.env.local` 文件：

```env
VITE_SUPABASE_URL=https://你的项目ID.supabase.co
VITE_SUPABASE_ANON_KEY=你的anon-key
```

**重要**: 
- 不要提交 `.env.local` 到 Git
- `.env.local` 已在 `.gitignore` 中

## 5. 测试连接

### 步骤 5.1: 安装依赖

```bash
npm install
```

### 步骤 5.2: 启动开发服务器

```bash
npm run dev
```

### 步骤 5.3: 测试功能

1. 打开浏览器访问 http://localhost:5173
2. 尝试以下操作：
   - 浏览场馆列表（应该显示测试数据）
   - 注册新账号
   - 登录
   - 创建预订
   - 发起组队

### 步骤 5.4: 检查数据库

1. 返回 Supabase 仪表板
2. 点击 "Table Editor"
3. 查看 `profiles` 表，应该能看到新注册的用户
4. 查看 `bookings` 表，应该能看到创建的预订

## 6. 常见问题

### Q1: 连接失败 "Invalid API key"

**解决方案**:
- 检查 `.env.local` 文件是否存在
- 确认 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 正确
- 重启开发服务器 (`npm run dev`)

### Q2: 注册后无法登录

**解决方案**:
- 检查 Supabase Authentication 设置
- 如果启用了邮箱确认，需要先确认邮箱
- 开发环境建议关闭邮箱确认

### Q3: RLS 策略导致无法访问数据

**解决方案**:
- 确保已执行完整的 `schema.sql`
- 检查 Supabase 的 "Authentication" > "Policies"
- 确认用户已登录（检查浏览器控制台）

### Q4: 表创建失败

**解决方案**:
- 确保按顺序执行 SQL
- 检查是否有语法错误
- 尝试删除所有表后重新执行

### Q5: 实时订阅不工作

**解决方案**:
- 检查 Supabase 项目的 Realtime 是否启用
- 在 "Database" > "Replication" 中启用相关表
- 确认网络连接正常

## 🔧 高级配置

### 启用 Realtime

1. 进入 "Database" > "Replication"
2. 为以下表启用 Realtime:
   - notifications
   - team_invitations
   - bookings

### 配置存储桶（用于图片上传）

1. 点击 "Storage"
2. 创建新桶：
   - Name: `avatars` (用户头像)
   - Name: `venue-images` (场馆图片)
3. 设置公开访问策略

### 设置数据库备份

1. 进入 "Database" > "Backups"
2. 配置自动备份计划
3. 免费版支持每日备份

## 📊 监控和调试

### 查看日志

1. "Logs" > "API Logs" - 查看 API 请求
2. "Logs" > "Database Logs" - 查看数据库查询
3. "Logs" > "Auth Logs" - 查看认证日志

### 性能监控

1. "Reports" - 查看使用统计
2. 监控 API 请求数量
3. 检查数据库大小

## 🚀 部署到生产环境

### 更新环境变量

生产环境的 `.env.production`:

```env
VITE_SUPABASE_URL=https://你的项目ID.supabase.co
VITE_SUPABASE_ANON_KEY=你的anon-key
```

### 更新认证设置

1. 在 Supabase Authentication Settings 中
2. 添加生产域名到 "Redirect URLs"
3. 更新 "Site URL" 为生产域名
4. 启用邮箱确认

### 安全检查清单

- [ ] 启用 RLS 所有表
- [ ] 配置正确的 CORS 设置
- [ ] 启用邮箱确认
- [ ] 设置强密码策略
- [ ] 配置备份策略
- [ ] 监控 API 使用量
- [ ] 审查所有 RLS 策略

## 📞 获取帮助

- Supabase 官方文档: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- GitHub Issues: 提交问题到项目仓库

---

**恭喜！** 您已完成 Supabase 后端配置。现在可以开始开发了！
