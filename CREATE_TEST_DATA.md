# 创建测试用户和数据指南

## 📋 问题说明

由于 Supabase 的安全设计，`profiles` 表不能直接插入数据，必须通过 `auth.users` 表的触发器自动创建。

## ✅ 解决方案

### 步骤 1: 执行 seed.sql（插入场馆数据）

在 Supabase SQL Editor 中执行 `supabase/seed.sql`，这会插入 5 个测试场馆。

```sql
-- 验证场馆数据
SELECT COUNT(*) FROM public.venues;
-- 应该返回 5
```

### 步骤 2: 创建测试用户

有三种方法创建测试用户：

---

## 方法 1: 通过 Supabase Dashboard（最简单）⭐ 推荐

### 步骤：

1. **打开 Supabase Dashboard**
   - 登录 https://supabase.com
   - 进入你的项目

2. **进入用户管理**
   - 点击左侧菜单 `Authentication`
   - 点击 `Users`

3. **创建新用户**
   - 点击右上角 `Add user`
   - 选择 `Create new user`

4. **填写用户信息**
   ```
   Email: johnny@test.com
   Password: Test123456
   
   ✅ 勾选 "Auto Confirm User" (开发环境)
   ```

5. **添加用户元数据（可选但推荐）**
   
   在 `User Metadata` 字段中添加 JSON：
   ```json
   {
     "username": "Johnny",
     "full_name": "Johnny Chen",
     "avatar_url": "https://picsum.photos/id/64/100/100"
   }
   ```

6. **点击 "Create user"**

7. **验证 profile 自动创建**
   ```sql
   -- 在 SQL Editor 中执行
   SELECT * FROM public.profiles;
   ```

### 创建更多测试用户：

重复上述步骤，使用不同的邮箱和元数据：

**用户 2:**
```
Email: aqiang@test.com
Password: Test123456
Metadata: {"username": "阿强", "full_name": "王强", "avatar_url": "https://picsum.photos/id/83/100/100"}
```

**用户 3:**
```
Email: xiaomei@test.com
Password: Test123456
Metadata: {"username": "小美", "full_name": "李美", "avatar_url": "https://picsum.photos/id/91/100/100"}
```

---

## 方法 2: 通过前端应用注册（最真实）⭐ 推荐

### 步骤：

1. **确保环境配置正确**
   ```bash
   # 检查 .env.local
   cat .env.local
   ```

2. **启动应用**
   ```bash
   npm run dev
   ```

3. **访问注册页面**
   - 打开 http://localhost:5173
   - 点击 "登录/注册"
   - 切换到注册模式

4. **填写注册信息**
   ```
   用户名: Johnny
   邮箱: johnny@test.com
   密码: Test123456
   ```

5. **提交注册**
   - profile 会自动创建
   - 可以立即登录使用

6. **验证**
   - 在 Supabase Dashboard → Authentication → Users 查看
   - 在 Table Editor → profiles 查看

---

## 方法 3: 使用 SQL 直接创建（高级用户）

⚠️ **注意**: 此方法需要 `service_role` 权限，仅用于开发环境！

### 在 Supabase SQL Editor 中执行：

```sql
-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 创建测试用户
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'johnny@test.com',
  crypt('Test123456', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"username":"Johnny","full_name":"Johnny Chen","avatar_url":"https://picsum.photos/id/64/100/100"}',
  NOW(),
  NOW(),
  '',
  ''
) RETURNING id, email;

-- 验证 profile 自动创建
SELECT 
  u.email,
  p.username,
  p.full_name,
  p.avatar_url
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'johnny@test.com';
```

---

## 步骤 3: 添加测试数据（预订、组队等）

### 获取用户 ID

```sql
-- 查看所有用户及其 ID
SELECT 
  u.id,
  u.email,
  p.username
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
```

### 为用户添加预订

```sql
-- 替换 'USER_UUID_HERE' 为实际的用户 ID
INSERT INTO public.bookings (
  user_id,
  venue_id,
  venue_name,
  court_number,
  booking_date,
  start_time,
  end_time,
  status,
  total_price,
  payment_status,
  qr_code
) VALUES (
  'USER_UUID_HERE',  -- 替换为真实的用户 UUID
  '550e8400-e29b-41d4-a716-446655440001',
  '王牌穿梭俱乐部 - 04号场',
  '04',
  CURRENT_DATE,
  '18:00',
  '20:00',
  'upcoming',
  160,
  'paid',
  SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6)
);

-- 添加预订参与者
INSERT INTO public.booking_participants (
  booking_id,
  user_id,
  is_organizer
) VALUES (
  (SELECT id FROM public.bookings ORDER BY created_at DESC LIMIT 1),
  'USER_UUID_HERE',  -- 替换为真实的用户 UUID
  true
);
```

### 创建组队邀约

```sql
-- 替换 'USER_UUID_HERE' 为实际的用户 ID
INSERT INTO public.team_invitations (
  creator_id,
  venue_id,
  venue_name,
  skill_level,
  missing_count,
  game_date,
  start_time,
  end_time,
  location,
  image_url,
  status
) VALUES (
  'USER_UUID_HERE',  -- 替换为真实的用户 UUID
  '550e8400-e29b-41d4-a716-446655440004',
  '奥体中心羽毛球馆',
  '中级水平',
  2,
  CURRENT_DATE + INTERVAL '1 day',
  '19:00',
  '21:00',
  '朝阳区天辰东路',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDk89xB79UZIHEtqYhYioBHO2AIeII-RidpzDN4Km_3Yv771CmBqanJrZJ_TTDfDLhSse1MnCGg8CaozfDFNPjmZ8iTHK2-87YKYlV50vpXMWySro3Sj-DvIe7SPNeAbTW_lAiz4dn-ejmWUEtSFDtVlCKSFHW4r5dEbHziYj1Z1qsFIJE9adcZoAKRWUdIx1FQvrRxtHSobBdyYGa76mBkMEkffarZv44zbT6qytRvEgVc4R1Cb5KYQXcRJayFq92Q4w83iFwl8I4P',
  'open'
);
```

---

## 🔍 验证数据

### 检查所有数据

```sql
-- 查看用户和 profiles
SELECT 
  u.id,
  u.email,
  p.username,
  p.skill_level
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id;

-- 查看场馆
SELECT id, name, price, rating FROM public.venues;

-- 查看预订
SELECT 
  b.id,
  b.venue_name,
  b.booking_date,
  b.status,
  p.username as booker
FROM public.bookings b
JOIN public.profiles p ON b.user_id = p.id;

-- 查看组队邀约
SELECT 
  t.id,
  t.venue_name,
  t.game_date,
  t.missing_count,
  p.username as creator
FROM public.team_invitations t
JOIN public.profiles p ON t.creator_id = p.id;
```

---

## 📝 快速测试脚本

### 完整的测试数据创建脚本

```sql
-- 1. 获取第一个用户的 ID（假设已通过 Dashboard 创建）
DO $$
DECLARE
  user_uuid UUID;
BEGIN
  -- 获取第一个用户 ID
  SELECT id INTO user_uuid FROM auth.users ORDER BY created_at LIMIT 1;
  
  -- 创建预订
  INSERT INTO public.bookings (
    user_id, venue_id, venue_name, court_number,
    booking_date, start_time, end_time,
    status, total_price, payment_status, qr_code
  ) VALUES (
    user_uuid,
    '550e8400-e29b-41d4-a716-446655440001',
    '王牌穿梭俱乐部 - 04号场',
    '04',
    CURRENT_DATE,
    '18:00',
    '20:00',
    'upcoming',
    160,
    'paid',
    SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6)
  );
  
  -- 添加预订参与者
  INSERT INTO public.booking_participants (booking_id, user_id, is_organizer)
  VALUES (
    (SELECT id FROM public.bookings ORDER BY created_at DESC LIMIT 1),
    user_uuid,
    true
  );
  
  -- 创建组队邀约
  INSERT INTO public.team_invitations (
    creator_id, venue_id, venue_name, skill_level,
    missing_count, game_date, start_time, end_time, location, status
  ) VALUES (
    user_uuid,
    '550e8400-e29b-41d4-a716-446655440004',
    '奥体中心羽毛球馆',
    '中级水平',
    2,
    CURRENT_DATE + INTERVAL '1 day',
    '19:00',
    '21:00',
    '朝阳区天辰东路',
    'open'
  );
  
  RAISE NOTICE 'Test data created for user: %', user_uuid;
END $$;
```

---

## ✅ 推荐流程

1. **执行 `seed.sql`** - 插入场馆数据
2. **通过 Dashboard 创建 2-3 个测试用户** - 最简单
3. **使用上面的快速测试脚本** - 自动创建预订和组队数据
4. **启动前端应用测试** - 验证所有功能

---

## 🆘 常见问题

**Q: 为什么不能直接插入 profiles？**
- A: Supabase 的安全设计，profiles 必须通过 auth.users 触发器创建

**Q: 如何删除测试用户？**
- A: 在 Dashboard → Authentication → Users 中删除，profile 会自动删除

**Q: 密码要求是什么？**
- A: 默认至少 6 位，可以在 Authentication → Settings 中修改

**Q: 如何重置所有数据？**
```sql
-- 谨慎使用！这会删除所有数据
TRUNCATE public.bookings CASCADE;
TRUNCATE public.team_invitations CASCADE;
TRUNCATE public.notifications CASCADE;
TRUNCATE public.reviews CASCADE;
TRUNCATE public.favorites CASCADE;
-- 注意：不要 TRUNCATE profiles，应该在 Dashboard 中删除用户
```

---

**完成后，您就可以开始测试完整的应用功能了！** 🎉
