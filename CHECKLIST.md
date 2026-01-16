# 羽约吧 - 完整配置检查清单

使用此清单确保所有配置步骤都已正确完成。

## ✅ 第一步：Supabase 项目设置

### 1.1 创建 Supabase 项目
- [ ] 访问 https://supabase.com 并登录
- [ ] 点击 "New Project" 创建新项目
- [ ] 记录项目名称: _______________
- [ ] 记录数据库密码: _______________
- [ ] 选择区域: Northeast Asia (Tokyo) 或其他
- [ ] 等待项目创建完成（1-2分钟）

### 1.2 获取项目凭证
- [ ] 进入项目 Settings → API
- [ ] 复制 Project URL: _______________
- [ ] 复制 anon public key: _______________
- [ ] 保存这些信息到安全的地方

## ✅ 第二步：数据库配置

### 2.1 执行数据库架构
- [ ] 打开 Supabase Dashboard
- [ ] 点击左侧 "SQL Editor"
- [ ] 点击 "New query"
- [ ] 打开本地文件 `supabase/schema.sql`
- [ ] 复制全部内容到 SQL Editor
- [ ] 点击 "Run" 执行
- [ ] 确认执行成功（无错误提示）

### 2.2 验证表创建
- [ ] 点击左侧 "Table Editor"
- [ ] 确认以下表已创建：
  - [ ] profiles
  - [ ] venues
  - [ ] bookings
  - [ ] booking_participants
  - [ ] team_invitations
  - [ ] team_participants
  - [ ] notifications
  - [ ] reviews
  - [ ] favorites

### 2.3 插入测试数据（可选）
- [ ] 在 SQL Editor 创建新查询
- [ ] 打开 `supabase/seed.sql`
- [ ] 复制内容并执行
- [ ] 在 Table Editor 中查看 venues 表
- [ ] 确认有 5 条测试场馆数据

## ✅ 第三步：认证配置

### 3.1 配置邮箱认证
- [ ] 点击左侧 "Authentication"
- [ ] 选择 "Providers"
- [ ] 确认 "Email" 已启用
- [ ] 开发环境：关闭 "Confirm email"
- [ ] 生产环境：开启 "Confirm email"

### 3.2 配置认证设置
- [ ] 在 Authentication → Settings
- [ ] Site URL 设置为: `http://localhost:5173`
- [ ] Redirect URLs 添加: `http://localhost:5173/**`
- [ ] 保存设置

### 3.3 启用 Realtime（可选）
- [ ] 点击 "Database" → "Replication"
- [ ] 为以下表启用 Realtime:
  - [ ] notifications
  - [ ] team_invitations
  - [ ] bookings

## ✅ 第四步：本地项目配置

### 4.1 环境变量设置
- [ ] 在项目根目录创建 `.env.local` 文件
- [ ] 复制 `.env.example` 的内容
- [ ] 填入 Supabase URL
- [ ] 填入 Supabase anon key
- [ ] 确认文件格式正确（无多余空格）

示例：
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4.2 安装依赖
- [ ] 打开终端
- [ ] 进入项目目录
- [ ] 运行 `npm install`
- [ ] 等待安装完成
- [ ] 确认无错误

### 4.3 启动开发服务器
- [ ] 运行 `npm run dev`
- [ ] 确认服务器启动成功
- [ ] 访问 http://localhost:5173
- [ ] 确认页面正常显示

## ✅ 第五步：功能测试

### 5.1 场馆浏览测试
- [ ] 打开首页
- [ ] 确认能看到场馆列表
- [ ] 如果看不到，检查：
  - [ ] `.env.local` 配置是否正确
  - [ ] 是否执行了 seed.sql
  - [ ] 浏览器控制台是否有错误

### 5.2 用户注册测试
- [ ] 点击"登录/注册"
- [ ] 填写注册信息：
  - 邮箱: test@example.com
  - 密码: Test123456
  - 用户名: TestUser
- [ ] 点击注册
- [ ] 检查 Supabase Authentication → Users
- [ ] 确认新用户已创建

### 5.3 用户登录测试
- [ ] 使用刚注册的账号登录
- [ ] 确认登录成功
- [ ] 确认页面显示用户信息
- [ ] 检查浏览器 localStorage
- [ ] 确认有 Supabase session

### 5.4 预订功能测试
- [ ] 登录后访问"行程"页面
- [ ] 应该能看到预订列表
- [ ] 尝试创建新预订（如果已集成）
- [ ] 检查 bookings 表是否有新记录

### 5.5 组队功能测试
- [ ] 访问"约球"页面
- [ ] 应该能看到组队邀约列表
- [ ] 尝试创建新邀约（如果已集成）
- [ ] 检查 team_invitations 表

### 5.6 通知功能测试
- [ ] 点击通知图标
- [ ] 应该能看到通知列表
- [ ] 尝试标记为已读
- [ ] 检查 notifications 表

## ✅ 第六步：安全检查

### 6.1 RLS 策略验证
- [ ] 在 Supabase Dashboard → Authentication
- [ ] 点击 "Policies"
- [ ] 确认每个表都有 RLS 策略
- [ ] 测试：未登录用户不能访问私有数据

### 6.2 环境变量安全
- [ ] 确认 `.env.local` 在 `.gitignore` 中
- [ ] 确认没有将凭证提交到 Git
- [ ] 生产环境使用不同的凭证

### 6.3 API 密钥检查
- [ ] 确认使用的是 anon key（公开密钥）
- [ ] 不要使用 service_role key 在前端
- [ ] service_role key 仅用于后端服务

## ✅ 第七步：性能优化

### 7.1 数据库索引
- [ ] 在 SQL Editor 执行以下查询验证索引：
```sql
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public';
```
- [ ] 确认关键字段都有索引

### 7.2 查询优化
- [ ] 在 Supabase Logs 中查看慢查询
- [ ] 优化频繁查询的字段
- [ ] 考虑添加复合索引

## ✅ 第八步：监控和日志

### 8.1 设置监控
- [ ] 在 Supabase Dashboard → Reports
- [ ] 查看 API 使用情况
- [ ] 设置使用量警报（可选）

### 8.2 查看日志
- [ ] Logs → API Logs - 查看 API 请求
- [ ] Logs → Database Logs - 查看数据库查询
- [ ] Logs → Auth Logs - 查看认证日志

## ✅ 第九步：备份和恢复

### 9.1 配置自动备份
- [ ] Database → Backups
- [ ] 启用自动备份
- [ ] 设置备份频率

### 9.2 测试恢复
- [ ] 下载一个备份
- [ ] 了解恢复流程
- [ ] 记录恢复步骤

## ✅ 第十步：文档和团队

### 10.1 项目文档
- [ ] 阅读 README.md
- [ ] 阅读 SETUP_GUIDE.md
- [ ] 阅读 ARCHITECTURE.md
- [ ] 阅读 INTEGRATION_EXAMPLES.tsx

### 10.2 团队协作
- [ ] 分享 Supabase 项目访问权限
- [ ] 共享环境变量（安全方式）
- [ ] 建立代码审查流程

## 🔧 故障排查

### 问题 1: 连接失败
**症状**: "Invalid API key" 或连接超时

**检查**:
- [ ] `.env.local` 文件是否存在
- [ ] 环境变量名称是否正确（VITE_ 前缀）
- [ ] URL 和 Key 是否正确复制（无多余空格）
- [ ] 重启开发服务器

### 问题 2: 无法看到数据
**症状**: 页面空白或显示空列表

**检查**:
- [ ] 是否执行了 seed.sql
- [ ] 浏览器控制台是否有错误
- [ ] 网络请求是否成功（查看 Network 标签）
- [ ] RLS 策略是否正确

### 问题 3: 认证失败
**症状**: 无法注册或登录

**检查**:
- [ ] Authentication 是否启用
- [ ] 邮箱确认是否关闭（开发环境）
- [ ] Site URL 是否正确
- [ ] 密码是否符合要求（至少6位）

### 问题 4: 实时订阅不工作
**症状**: 通知不实时更新

**检查**:
- [ ] Realtime 是否启用
- [ ] 相关表是否启用了 Replication
- [ ] 订阅代码是否正确
- [ ] 是否正确取消订阅

## 📊 完成度检查

统计你完成的步骤：

- 第一步（Supabase 设置）: ___/2
- 第二步（数据库配置）: ___/3
- 第三步（认证配置）: ___/3
- 第四步（本地配置）: ___/3
- 第五步（功能测试）: ___/6
- 第六步（安全检查）: ___/3
- 第七步（性能优化）: ___/2
- 第八步（监控日志）: ___/2
- 第九步（备份恢复）: ___/2
- 第十步（文档团队）: ___/2

**总计**: ___/28

## 🎉 完成！

如果你完成了所有步骤，恭喜！你的羽约吧应用已经：

✅ 拥有完整的后端数据库  
✅ 配置了安全的认证系统  
✅ 实现了所有核心 API 服务  
✅ 准备好进行前端集成  
✅ 具备生产环境部署能力  

## 📞 下一步

1. **前端集成**: 参考 `INTEGRATION_EXAMPLES.tsx`
2. **功能开发**: 添加新功能和优化
3. **测试**: 编写单元测试和集成测试
4. **部署**: 部署到生产环境

## 🆘 需要帮助？

- 📖 查看文档: `SETUP_GUIDE.md`
- 🏗️ 了解架构: `ARCHITECTURE.md`
- 💻 查看示例: `INTEGRATION_EXAMPLES.tsx`
- 🌐 Supabase 文档: https://supabase.com/docs
- 💬 Discord 社区: https://discord.supabase.com

---

**版本**: 1.0.0  
**最后更新**: 2024-01-16
