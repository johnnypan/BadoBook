/**
 * 前端集成示例
 * 
 * 这个文件展示了如何将 Supabase 后端集成到现有的前端组件中
 * 包含完整的示例代码和最佳实践
 */

// ============================================
// 示例 1: 更新 HomeView.tsx - 场馆列表
// ============================================

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVenues } from '../lib/api/venues';
import type { Venue } from '../types';

const HomeViewExample: React.FC = () => {
    const navigate = useNavigate();
    const [venues, setVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 筛选状态
    const [selectedTag, setSelectedTag] = useState('全部');
    const [selectedPriceRange, setSelectedPriceRange] = useState('全部价格');
    const [selectedSort, setSelectedSort] = useState('距离优先');

    // 加载场馆数据
    useEffect(() => {
        loadVenues();
    }, [selectedTag, selectedPriceRange, selectedSort]);

    const loadVenues = async () => {
        setLoading(true);
        setError(null);

        try {
            // 构建筛选条件
            const filters: any = {};

            // 标签筛选
            if (selectedTag !== '全部') {
                filters.tags = [selectedTag];
            }

            // 价格筛选
            if (selectedPriceRange !== '全部价格') {
                if (selectedPriceRange === '50元以下') {
                    filters.priceRange = { max: 50 };
                } else if (selectedPriceRange === '50-80元') {
                    filters.priceRange = { min: 50, max: 80 };
                } else if (selectedPriceRange === '80元以上') {
                    filters.priceRange = { min: 80 };
                }
            }

            // 排序
            if (selectedSort === '价格最低') {
                filters.sortBy = 'price';
            } else if (selectedSort === '评分最高') {
                filters.sortBy = 'rating';
            } else {
                filters.sortBy = 'distance';
            }

            // 调用 API
            const data = await getVenues(filters);
            setVenues(data);
        } catch (err) {
            console.error('Error loading venues:', err);
            setError('加载场馆失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    // 渲染加载状态
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-500">加载中...</p>
                </div>
            </div>
        );
    }

    // 渲染错误状态
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={loadVenues}
                        className="bg-primary text-white px-6 py-2 rounded-lg"
                    >
                        重试
                    </button>
                </div>
            </div>
        );
    }

    // 正常渲染
    return (
        <div>
            {/* 筛选器 */}
            {/* ... 现有的筛选 UI ... */}

            {/* 场馆列表 */}
            <div className="grid grid-cols-1 gap-4 p-4">
                {venues.map((venue) => (
                    <div
                        key={venue.id}
                        onClick={() => navigate(`/venue/${venue.id}`)}
                        className="bg-card-dark p-4 rounded-2xl cursor-pointer"
                    >
                        <h3 className="font-bold">{venue.name}</h3>
                        <p className="text-primary">¥{venue.price}</p>
                        <p className="text-gray-500">{venue.distance}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ============================================
// 示例 2: 更新 AuthView.tsx - 认证
// ============================================

import { useState } from 'react';
import { signIn, signUp } from '../lib/api/auth';

const AuthViewExample: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                // 登录
                const { user, error: signInError } = await signIn(email, password);

                if (signInError) {
                    setError(signInError);
                    return;
                }

                // 登录成功
                console.log('登录成功:', user);
                // 导航到首页或刷新页面
                window.location.href = '/';
            } else {
                // 注册
                const { user, error: signUpError } = await signUp(email, password, username);

                if (signUpError) {
                    setError(signUpError);
                    return;
                }

                // 注册成功
                alert('注册成功！请查收确认邮件。');
                setIsLogin(true);
            }
        } catch (err: any) {
            setError(err.message || '操作失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-card-dark p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-6">
                    {isLogin ? '登录' : '注册'}
                </h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="用户名"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-surface-dark p-3 rounded-lg"
                            required
                        />
                    )}

                    <input
                        type="email"
                        placeholder="邮箱"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-surface-dark p-3 rounded-lg"
                        required
                    />

                    <input
                        type="password"
                        placeholder="密码"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-surface-dark p-3 rounded-lg"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white p-3 rounded-lg font-bold disabled:opacity-50"
                    >
                        {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
                    </button>
                </form>

                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="w-full mt-4 text-primary text-sm"
                >
                    {isLogin ? '没有账号？立即注册' : '已有账号？立即登录'}
                </button>
            </div>
        </div>
    );
};

// ============================================
// 示例 3: 更新 App.tsx - 认证状态管理
// ============================================

import { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';

const AppExample: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 获取当前会话
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // 监听认证状态变化
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const isAuthenticated = !!session;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <Router>
            <div className="min-h-screen max-w-md mx-auto bg-background-dark text-white">
                <Routes>
                    <Route path="/" element={<HomeView isAuthenticated={isAuthenticated} />} />
                    <Route path="/auth" element={!isAuthenticated ? <AuthView /> : <Navigate to="/" />} />
                    <Route path="/schedule" element={isAuthenticated ? <ScheduleView /> : <Navigate to="/auth" />} />
                    <Route path="/teams" element={isAuthenticated ? <TeamInviteView /> : <Navigate to="/auth" />} />
                    <Route path="/profile" element={isAuthenticated ? <ProfileView /> : <Navigate to="/auth" />} />
                </Routes>
            </div>
        </Router>
    );
};

// ============================================
// 示例 4: 更新 ScheduleView.tsx - 预订管理
// ============================================

import { getUserBookings, cancelBooking } from '../lib/api/bookings';
import type { Booking } from '../types';

const ScheduleViewExample: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookings();
    }, [activeTab]);

    const loadBookings = async () => {
        setLoading(true);
        const data = await getUserBookings(activeTab);
        setBookings(data);
        setLoading(false);
    };

    const handleCancelBooking = async (bookingId: string) => {
        if (!confirm('确定要取消这个预订吗？')) return;

        const success = await cancelBooking(bookingId);
        if (success) {
            alert('预订已取消');
            loadBookings(); // 刷新列表
        } else {
            alert('取消失败，请重试');
        }
    };

    return (
        <div>
            {/* 标签切换 */}
            <div className="flex gap-2 p-4">
                {(['upcoming', 'completed', 'cancelled'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg ${activeTab === tab ? 'bg-primary' : 'bg-surface-dark'
                            }`}
                    >
                        {tab === 'upcoming' ? '待使用' : tab === 'completed' ? '已完成' : '已取消'}
                    </button>
                ))}
            </div>

            {/* 预订列表 */}
            {loading ? (
                <div className="text-center p-8">加载中...</div>
            ) : (
                <div className="space-y-4 p-4">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-card-dark p-4 rounded-2xl">
                            <h3 className="font-bold">{booking.venueName}</h3>
                            <p className="text-sm text-gray-500">{booking.date} {booking.time}</p>

                            {booking.status === 'upcoming' && (
                                <button
                                    onClick={() => handleCancelBooking(booking.id)}
                                    className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
                                >
                                    取消预订
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ============================================
// 示例 5: 更新 TeamInviteView.tsx - 组队匹配
// ============================================

import { getTeamInvitations, createTeamInvitation, joinTeamInvitation } from '../lib/api/teams';

const TeamInviteViewExample: React.FC = () => {
    const [invitations, setInvitations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInvitations();
    }, []);

    const loadInvitations = async () => {
        setLoading(true);
        const data = await getTeamInvitations('all');
        setInvitations(data);
        setLoading(false);
    };

    const handleJoin = async (invitationId: string) => {
        const success = await joinTeamInvitation(invitationId);

        if (success) {
            alert('申请已发送！');
            loadInvitations(); // 刷新列表
        } else {
            alert('申请失败，请重试');
        }
    };

    const handleCreate = async (formData: any) => {
        const invitation = await createTeamInvitation({
            venueName: formData.venue,
            skillLevel: formData.level,
            missingCount: formData.missing,
            gameDate: formData.date,
            startTime: formData.startTime,
            endTime: formData.endTime,
            location: '场馆内'
        });

        if (invitation) {
            alert('邀约发布成功！');
            loadInvitations(); // 刷新列表
        } else {
            alert('发布失败，请重试');
        }
    };

    return (
        <div>
            {/* 邀约列表 */}
            <div className="space-y-4 p-4">
                {invitations.map((inv) => (
                    <div key={inv.id} className="bg-card-dark p-4 rounded-2xl">
                        <h3 className="font-bold">{inv.venueName}</h3>
                        <p className="text-sm text-gray-500">{inv.time}</p>
                        <p className="text-primary">缺 {inv.missingCount} 人</p>

                        <button
                            onClick={() => handleJoin(inv.id)}
                            className="mt-2 bg-primary text-white px-4 py-2 rounded-lg"
                        >
                            申请加入
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ============================================
// 示例 6: 实时通知订阅
// ============================================

import { useEffect } from 'react';
import { subscribeToNotifications } from '../lib/api/notifications';

const NotificationExample: React.FC = () => {
    useEffect(() => {
        // 订阅实时通知
        const subscription = subscribeToNotifications((notification) => {
            console.log('新通知:', notification);

            // 显示浏览器通知
            if (Notification.permission === 'granted') {
                new Notification(notification.title, {
                    body: notification.content,
                    icon: '/logo.png'
                });
            }
        });

        // 清理订阅
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return <div>通知组件</div>;
};

// ============================================
// 最佳实践
// ============================================

/**
 * 1. 错误处理
 * - 总是使用 try-catch 包裹 API 调用
 * - 向用户显示友好的错误消息
 * - 记录错误到控制台以便调试
 */

/**
 * 2. 加载状态
 * - 使用 loading 状态显示加载动画
 * - 避免在加载时显示空白页面
 * - 考虑使用骨架屏提升体验
 */

/**
 * 3. 数据刷新
 * - 在操作成功后刷新相关数据
 * - 使用乐观更新提升体验
 * - 考虑使用 React Query 或 SWR 管理缓存
 */

/**
 * 4. 认证状态
 * - 使用 Supabase Auth 管理登录状态
 * - 监听认证状态变化
 * - 保护需要登录的路由
 */

/**
 * 5. 实时功能
 * - 使用 Supabase Realtime 订阅数据变化
 * - 记得在组件卸载时取消订阅
 * - 避免重复订阅
 */

export {
    HomeViewExample,
    AuthViewExample,
    AppExample,
    ScheduleViewExample,
    TeamInviteViewExample,
    NotificationExample
};
