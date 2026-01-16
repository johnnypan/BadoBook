# 羽约吧 - 羽毛球场馆预订平台

一个现代化的羽毛球场馆预订和社交平台，支持场馆浏览、在线预订、队友匹配等功能。

## 🚀 技术栈

### 前端
- **React 19** - UI框架
- **TypeScript** - 类型安全
- **React Router** - 路由管理
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架

### 后端
- **Supabase** - 后端即服务 (BaaS)
  - PostgreSQL 数据库
  - 实时订阅
  - 用户认证
  - Row Level Security (RLS)

## 📋 功能特性

### ✅ 已实现功能

1. **场馆浏览**
   - 场馆列表展示
   - 多维度筛选（价格、标签、设施、地板类型）
   - 场馆详情查看
   - 收藏功能

2. **预订管理**
   - 创建预订
   - 查看预订列表（待使用/已完成/已取消）
   - 取消预订
   - 电子凭证（二维码）

3. **队友匹配**
   - 发布组队邀约
   - 浏览邀约列表
   - 申请加入球局
   - 审批加入请求

4. **用户系统**
   - 邮箱注册/登录
   - 个人资料管理
   - 技能等级设置

5. **通知系统**
   - 实时通知推送
   - 预订确认通知
   - 组队邀请通知
   - 系统消息

## 🛠️ 快速开始

### 前置要求

- Node.js 18+ 
- npm 或 yarn
- Supabase 账号

### 1. 克隆项目

```bash
cd 羽约吧
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置 Supabase

#### 3.1 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com)
2. 创建新项目
3. 记录项目的 URL 和 anon key

#### 3.2 设置数据库

在 Supabase SQL Editor 中执行以下文件：

```bash
# 1. 创建数据库表结构
supabase/schema.sql

# 2. 插入测试数据（可选）
supabase/seed.sql
```

或者使用 Supabase CLI:

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 链接项目
supabase link --project-ref your-project-ref

# 推送数据库迁移
supabase db push
```

#### 3.3 配置环境变量

复制 `.env.example` 为 `.env.local`:

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入你的 Supabase 凭证:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

## 📁 项目结构

```
羽约吧/
├── lib/                      # 后端服务层
│   ├── api/                  # API 服务
│   │   ├── auth.ts          # 认证服务
│   │   ├── bookings.ts      # 预订服务
│   │   ├── notifications.ts # 通知服务
│   │   ├── teams.ts         # 组队服务
│   │   └── venues.ts        # 场馆服务
│   ├── database.types.ts    # 数据库类型定义
│   └── supabase.ts          # Supabase 客户端配置
├── supabase/                # Supabase 配置
│   ├── schema.sql           # 数据库架构
│   └── seed.sql             # 测试数据
├── views/                   # 页面组件
│   ├── HomeView.tsx         # 首页
│   ├── ScheduleView.tsx     # 行程管理
│   ├── TeamInviteView.tsx   # 队友邀约
│   ├── ProfileView.tsx      # 个人中心
│   ├── VenueDetailView.tsx  # 场馆详情
│   ├── AllVenuesView.tsx    # 全部场馆
│   ├── AuthView.tsx         # 登录注册
│   └── NotificationView.tsx # 通知中心
├── App.tsx                  # 应用入口
├── types.ts                 # TypeScript 类型定义
└── index.html              # HTML 模板
```

## 🗄️ 数据库架构

### 核心表

- **profiles** - 用户资料
- **venues** - 场馆信息
- **bookings** - 预订记录
- **booking_participants** - 预订参与者
- **team_invitations** - 组队邀约
- **team_participants** - 组队参与者
- **notifications** - 通知消息
- **reviews** - 场馆评价
- **favorites** - 收藏记录

详细的表结构请查看 `supabase/schema.sql`

## 🔐 安全性

- 使用 Supabase Row Level Security (RLS) 保护数据
- 用户只能访问和修改自己的数据
- 所有 API 调用都需要认证
- 密码使用 bcrypt 加密存储

## 🚧 开发计划

### 即将实现

- [ ] 支付集成
- [ ] 地图定位
- [ ] 实时聊天
- [ ] 积分系统
- [ ] 优惠券功能
- [ ] 场馆管理后台
- [ ] 数据分析面板

## 📝 API 使用示例

### 获取场馆列表

```typescript
import { getVenues } from './lib/api/venues';

const venues = await getVenues({
  tags: ['室内馆'],
  priceRange: { min: 50, max: 100 },
  sortBy: 'rating'
});
```

### 创建预订

```typescript
import { createBooking } from './lib/api/bookings';

const booking = await createBooking({
  venueId: 'venue-id',
  venueName: '王牌穿梭俱乐部',
  bookingDate: '2024-01-20',
  startTime: '18:00',
  endTime: '20:00',
  totalPrice: 160
});
```

### 发起组队

```typescript
import { createTeamInvitation } from './lib/api/teams';

const invitation = await createTeamInvitation({
  venueName: '奥体中心羽毛球馆',
  skillLevel: '中级水平',
  missingCount: 2,
  gameDate: '2024-01-20',
  startTime: '19:00',
  endTime: '21:00',
  location: '朝阳区天辰东路'
});
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 📞 联系方式

如有问题，请通过以下方式联系：

- 提交 GitHub Issue
- 发送邮件至：support@yuyueba.com

---

**注意**: 这是一个演示项目。在生产环境使用前，请确保：
1. 更新所有安全配置
2. 配置正确的 RLS 策略
3. 实现完整的错误处理
4. 添加日志和监控
5. 进行充分的测试
