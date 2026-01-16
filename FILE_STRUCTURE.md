# 羽约吧 - 项目文件结构

## 📂 完整目录树

```
羽约吧/
│
├── 📄 .env.example              # 环境变量模板
├── 📄 .env.local                # 本地环境变量（需创建）
├── 📄 .gitignore                # Git 忽略文件
├── 📄 package.json              # 项目依赖配置
├── 📄 tsconfig.json             # TypeScript 配置
├── 📄 vite.config.ts            # Vite 构建配置
├── 📄 index.html                # HTML 入口
├── 📄 index.tsx                 # React 入口
├── 📄 App.tsx                   # 应用主组件
├── 📄 types.ts                  # 前端类型定义
│
├── 📁 lib/                      # 后端服务层 ⭐ 新增
│   ├── 📄 supabase.ts          # Supabase 客户端配置
│   ├── 📄 database.types.ts    # 数据库类型定义
│   │
│   └── 📁 api/                 # API 服务模块
│       ├── 📄 index.ts         # API 导出入口
│       ├── 📄 auth.ts          # 认证服务
│       ├── 📄 venues.ts        # 场馆服务
│       ├── 📄 bookings.ts      # 预订服务
│       ├── 📄 teams.ts         # 组队服务
│       └── 📄 notifications.ts # 通知服务
│
├── 📁 supabase/                # Supabase 配置 ⭐ 新增
│   ├── 📄 schema.sql           # 数据库架构（9张表）
│   └── 📄 seed.sql             # 测试数据
│
├── 📁 views/                   # 页面组件
│   ├── 📄 HomeView.tsx         # 首页 - 场馆浏览
│   ├── 📄 AllVenuesView.tsx    # 全部场馆
│   ├── 📄 VenueDetailView.tsx  # 场馆详情
│   ├── 📄 ScheduleView.tsx     # 行程管理
│   ├── 📄 TeamInviteView.tsx   # 队友邀约
│   ├── 📄 ProfileView.tsx      # 个人中心
│   ├── 📄 AuthView.tsx         # 登录注册
│   └── 📄 NotificationView.tsx # 通知中心
│
└── 📁 docs/                    # 文档 ⭐ 新增
    ├── 📄 README.md            # 项目说明
    ├── 📄 SETUP_GUIDE.md       # 配置指南
    ├── 📄 ARCHITECTURE.md      # 架构文档
    ├── 📄 PROJECT_SUMMARY.md   # 项目总结
    └── 📄 INTEGRATION_EXAMPLES.tsx # 集成示例
```

## 🎯 核心文件说明

### 后端服务层 (lib/)

#### `lib/supabase.ts`
```typescript
// Supabase 客户端初始化
// 提供认证和数据库访问
```

#### `lib/database.types.ts`
```typescript
// 数据库表的 TypeScript 类型
// 确保类型安全
```

#### `lib/api/auth.ts`
```typescript
// 用户认证相关
- signUp()      // 注册
- signIn()      // 登录
- signOut()     // 登出
- updateProfile() // 更新资料
```

#### `lib/api/venues.ts`
```typescript
// 场馆管理相关
- getVenues()        // 获取场馆列表
- getVenueById()     // 获取场馆详情
- addToFavorites()   // 添加收藏
- submitReview()     // 提交评价
```

#### `lib/api/bookings.ts`
```typescript
// 预订管理相关
- createBooking()    // 创建预订
- getUserBookings()  // 获取用户预订
- cancelBooking()    // 取消预订
- getBookingById()   // 获取预订详情
```

#### `lib/api/teams.ts`
```typescript
// 组队匹配相关
- getTeamInvitations()      // 获取邀约列表
- createTeamInvitation()    // 创建邀约
- joinTeamInvitation()      // 加入球局
- updateParticipantStatus() // 审批申请
```

#### `lib/api/notifications.ts`
```typescript
// 通知管理相关
- getNotifications()        // 获取通知
- markNotificationAsRead()  // 标记已读
- subscribeToNotifications() // 实时订阅
```

### 数据库配置 (supabase/)

#### `supabase/schema.sql`
```sql
-- 数据库表结构定义
CREATE TABLE profiles (...);
CREATE TABLE venues (...);
CREATE TABLE bookings (...);
CREATE TABLE team_invitations (...);
CREATE TABLE notifications (...);
-- ... 等 9 张表

-- RLS 安全策略
CREATE POLICY ...;

-- 触发器和函数
CREATE TRIGGER ...;
```

#### `supabase/seed.sql`
```sql
-- 测试数据
INSERT INTO venues VALUES (...);
INSERT INTO profiles VALUES (...);
-- ... 等
```

### 前端组件 (views/)

#### `views/HomeView.tsx`
```typescript
// 首页 - 场馆浏览
- 场馆列表展示
- 多维度筛选
- 快速预订
```

#### `views/ScheduleView.tsx`
```typescript
// 行程管理
- 预订列表
- 电子凭证
- 取消预订
```

#### `views/TeamInviteView.tsx`
```typescript
// 队友邀约
- 发布邀约
- 浏览球局
- 申请加入
```

#### `views/AuthView.tsx`
```typescript
// 认证页面
- 登录
- 注册
- 密码重置
```

## 📊 数据流向

```
┌─────────────┐
│   用户操作   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ React 组件   │ (views/)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  API 服务   │ (lib/api/)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Supabase SDK│ (lib/supabase.ts)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Supabase   │
│  后端服务    │
└─────────────┘
```

## 🔄 开发工作流

### 1. 初始设置
```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入 Supabase 凭证
```

### 2. 数据库设置
```bash
# 在 Supabase Dashboard 执行
1. supabase/schema.sql  # 创建表结构
2. supabase/seed.sql    # 插入测试数据
```

### 3. 开发
```bash
# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

### 4. 集成 API
```typescript
// 在组件中导入 API 服务
import { getVenues } from '../lib/api/venues';

// 使用 API
const venues = await getVenues();
```

## 🎨 代码组织原则

### 关注点分离
- **views/** - UI 展示和用户交互
- **lib/api/** - 业务逻辑和数据获取
- **lib/** - 配置和工具函数
- **types.ts** - 类型定义

### 模块化
- 每个功能模块独立的 API 文件
- 清晰的导入导出
- 易于测试和维护

### 类型安全
- 使用 TypeScript
- 数据库类型自动生成
- 编译时类型检查

## 📝 文件命名规范

- **组件**: PascalCase (HomeView.tsx)
- **服务**: camelCase (auth.ts)
- **类型**: PascalCase (Venue, Booking)
- **常量**: UPPER_CASE
- **配置**: kebab-case (.env.local)

## 🚀 构建和部署

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 📦 依赖说明

### 核心依赖
- `react` - UI 框架
- `react-router-dom` - 路由管理
- `@supabase/supabase-js` - Supabase 客户端

### 开发依赖
- `typescript` - 类型检查
- `vite` - 构建工具
- `@vitejs/plugin-react` - React 插件

## 🔍 快速查找

### 需要修改认证逻辑？
→ `lib/api/auth.ts`

### 需要添加新的场馆筛选？
→ `lib/api/venues.ts` + `views/HomeView.tsx`

### 需要修改数据库结构？
→ `supabase/schema.sql`

### 需要添加新的通知类型？
→ `lib/api/notifications.ts`

### 需要查看集成示例？
→ `INTEGRATION_EXAMPLES.tsx`

---

**提示**: 所有 ⭐ 标记的文件/文件夹都是新增的后端相关代码
