-- ============================================
-- 羽约吧 - 简化版种子数据
-- ============================================
-- 此文件只插入场馆数据，可以安全执行
-- 用户相关数据需要先创建用户后再添加

-- 清理现有数据（可选，谨慎使用）
-- TRUNCATE public.venues CASCADE;

-- ============================================
-- 插入场馆数据
-- ============================================

INSERT INTO public.venues (id, name, rating, distance, price, image_url, tags, status, is_official, amenities, surface_type, address, phone) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440001',
    '王牌穿梭俱乐部',
    4.8,
    '0.5公里',
    80,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBR9PSBNzWWD-kYk51sPAguziofzxSIGSzEYa7fuBCyNS7sbkyiyrM60F78fBL6sYfV6G4yZ7bt36q4AMoK0JkkT1iko_ItLDLG0wgJgVF21bx63_fMNaaktoEtu-ieftKIAvftpZ2qhfEkkH6Nx6LnKU08jieRyZEmHssEV2ObfVNctljpFpkNVJpxy8kyvwLkdCHE2f6KxSoiDTqxLs2UaxkwG1vxghMxNvRLwC3t-1scOSLxqP5L8QfuWWSpoKuuztOLizxUVODs',
    ARRAY['室内馆', '朝阳区', '双井'],
    'available',
    true,
    ARRAY['停车场', '空调', '淋浴'],
    'PVC',
    '北京市朝阳区双井路88号',
    '010-12345678'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002',
    '精英之翼中心',
    4.7,
    '1.2公里',
    100,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBxUFFUN-oLteKqt64Tr12NDzZwUhHd_s_APMu7e8dnDEa1Z-_0eocR2vp6Pw7dICHHb9BmyXVWSGycx_PVgnQc6zarcOGYbw3ykr1XVwLWl5dsDTqiT0piYla3KGjDApchS6EEgorVgEYJ6-GG_TsSPTAjeqY_1R_QUGcgpKsQufqXK8XZ-8D7OqD43XjkEGCuy0peaGzUtQ_O-Do7WIx63xMhbNhlLWZX_VaAWw6bmjhoe_JI5_OqVJLNHu0UqSWxNYw5Zh1rO_sn',
    ARRAY['实木地板', '海淀区', '五道口'],
    'busy',
    true,
    ARRAY['空调', '更衣室'],
    '实木',
    '北京市海淀区五道口华清嘉园',
    '010-87654321'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    '望京动感体育',
    4.5,
    '0.4公里',
    60,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDp-16CQXT5coBFgCgo0ZLwUAD9wyXLzqPWYgik1FeKG_xKbjR6cm3ub76ecks98lwoeTJwoSpohqcJvd__GMKJdHqz-ZYTOYwKrlTwOOoBwMtl16dKEgkFujh8JLgoXOd9MnMpTn_1r6d8JdryDZeGA5bUPsf66QVXOZxGSesPEchjM56EIUHBSbTd64Hh2Xoid2AZ0ju5QRC6WZuG2-OD9vXLzpA69HDamDhV2fJ6ErgxufkSSJy9vxpxwAfUm4fERg3RaHpLvQIu',
    ARRAY['室内馆', '朝阳区', '望京'],
    'available',
    false,
    ARRAY['停车场'],
    'PVC',
    '北京市朝阳区望京SOHO',
    '010-11223344'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440004',
    '奥体中心羽毛球馆',
    4.9,
    '2.1公里',
    120,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDk89xB79UZIHEtqYhYioBHO2AIeII-RidpzDN4Km_3Yv771CmBqanJrZJ_TTDfDLhSse1MnCGg8CaozfDFNPjmZ8iTHK2-87YKYlV50vpXMWySro3Sj-DvIe7SPNeAbTW_lAiz4dn-ejmWUEtSFDtVlCKSFHW4r5dEbHziYj1Z1qsFIJE9adcZoAKRWUdIx1FQvrRxtHSobBdyYGa76mBkMEkffarZv44zbT6qytRvEgVc4R1Cb5KYQXcRJayFq92Q4w83iFwl8I4P',
    ARRAY['专业实木', '朝阳区', '奥体'],
    'available',
    true,
    ARRAY['停车场', '空调', '淋浴', '更衣室', '器材租借'],
    '实木',
    '北京市朝阳区天辰东路',
    '010-99887766'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440005',
    '飞扬羽球俱乐部',
    4.6,
    '1.8公里',
    90,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAXKcgnOyyCY9p-Folz_Va5mNw4WZmD5T0l6VcAvp5UYUfyPTjcXG6zjGcb8emNRT-xUMbtfKzwnwPksnJuo9EXr0SLOy2PGacGjD3ehlwW3yzdParwRp6SKwTj0LJ0kn-qsvmjoqeeytO_logZoqtEhSYFXmvRybjeeXvqKuPpo64NCinbYPVkDcpTJWhM7e4I79g_9TDE2TtPl9eOnXN8g7c_LlajfckEjW_SDmN-RN7swRRsiBUCwrlSb4p46KFb3kJAq_n-pz73',
    ARRAY['室内馆', '海淀区', '学院路'],
    'available',
    false,
    ARRAY['空调', '更衣室'],
    'PVC',
    '北京市海淀区学院路',
    '010-55667788'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 验证数据插入
-- ============================================

-- 查看插入的场馆数量
SELECT COUNT(*) as venue_count FROM public.venues;

-- 查看所有场馆
SELECT id, name, price, rating, status FROM public.venues ORDER BY name;

-- ============================================
-- 后续步骤：创建测试用户
-- ============================================

-- 方法 1: 通过 Supabase Dashboard（推荐）
-- ----------------------------------------
-- 1. 进入 Supabase Dashboard
-- 2. 点击 Authentication → Users
-- 3. 点击 "Add user" → "Create new user"
-- 4. 填写信息：
--    Email: johnny@test.com
--    Password: Test123456
--    Auto Confirm User: 勾选（开发环境）
-- 5. 在 User Metadata 中添加（可选）:
--    {
--      "username": "Johnny",
--      "full_name": "Johnny Chen",
--      "avatar_url": "https://picsum.photos/id/64/100/100"
--    }
-- 6. 点击 "Create user"
-- 7. profile 会自动创建

-- 方法 2: 通过前端应用注册（推荐）
-- ----------------------------------------
-- 1. 启动前端应用: npm run dev
-- 2. 访问注册页面
-- 3. 填写注册信息
-- 4. 提交注册
-- 5. profile 会自动创建

-- 方法 3: 使用 Supabase CLI（高级）
-- ----------------------------------------
-- supabase auth signup --email test@example.com --password password123

-- ============================================
-- 创建用户后，可以添加测试数据
-- ============================================

-- 示例：为已存在的用户添加预订
-- 注意：需要先获取真实的用户 UUID

-- 1. 获取用户 ID
-- SELECT id, email FROM auth.users;

-- 2. 使用真实的用户 ID 插入预订
-- INSERT INTO public.bookings (
--   user_id,
--   venue_id,
--   venue_name,
--   court_number,
--   booking_date,
--   start_time,
--   end_time,
--   status,
--   total_price,
--   payment_status,
--   qr_code
-- ) VALUES (
--   '替换为真实的用户UUID',
--   '550e8400-e29b-41d4-a716-446655440001',
--   '王牌穿梭俱乐部 - 04号场',
--   '04',
--   CURRENT_DATE,
--   '18:00',
--   '20:00',
--   'upcoming',
--   160,
--   'paid',
--   '829-105'
-- );

-- ============================================
-- 完成！
-- ============================================
-- 现在你可以：
-- 1. 在前端看到 5 个测试场馆
-- 2. 通过前端或 Dashboard 创建用户
-- 3. 用户创建后自动生成 profile
-- 4. 开始测试预订、组队等功能
