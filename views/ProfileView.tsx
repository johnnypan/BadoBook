
import React, { useState, useEffect } from 'react';
import { getUserProfile, updateProfile } from '../lib/api/auth';
import {
  getUserWallet,
  getUserCoupons,
  getWalletTransactions,
  topUpWallet,
  type Wallet,
  type Transaction,
  type UserCoupon
} from '../lib/api/wallet';
import { supabase } from '../lib/supabase';

interface ProfileViewProps {
  onLogout: () => void;
  username: string;
}

const ProfileView: React.FC<ProfileViewProps> = ({ onLogout, username }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false);
  const [showBalanceDetail, setShowBalanceDetail] = useState(false);
  const [activeSetting, setActiveSetting] = useState<'notifications' | 'privacy' | 'support' | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 钱包与优惠券状态
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([]);

  // 核心用户状态 - 扩展字段
  const [profile, setProfile] = useState({
    id: '',
    username: username,
    full_name: '',
    avatar: "https://picsum.photos/id/64/200/200",
    gender: '男',
    level: '日常进阶',
    style: '攻守兼备',
    bio: '',
    phone: '',
    balance: 320.00
  });

  const [tempProfile, setTempProfile] = useState({ ...profile });

  // 加载用户资料
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const data = await getUserProfile() as any;
      if (data) {
        const profileData = {
          id: data.id,
          username: data.username || username,
          full_name: data.full_name || '',
          avatar: data.avatar_url || "https://picsum.photos/id/64/200/200",
          gender: data.gender || '男',
          level: data.skill_level || '日常进阶',
          style: data.play_style || '攻守兼备',
          bio: data.bio || '',
          phone: data.phone || '',
          balance: 320.00 // 这里的balance将由wallet状态接管
        };
        setProfile(profileData);
        setTempProfile(profileData);

        // 加载钱包和优惠券
        const userWallet = await getUserWallet(data.id);
        if (userWallet) {
          setWallet(userWallet as any);
          const txs = await getWalletTransactions(userWallet.id);
          setTransactions(txs as any);
        }

        const coupons = await getUserCoupons(data.id);
        setUserCoupons(coupons as any);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      triggerToast('加载资料失败');
    }
  };

  const handleTopUp = async () => {
    if (!profile.id) return;
    triggerToast('正在处理充值...');
    const success = await topUpWallet(profile.id, 100); // 模拟充值100元
    if (success) {
      triggerToast('充值成功！');
      loadUserProfile(); // 刷新数据
    } else {
      triggerToast('充值失败');
    }
  };

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!tempProfile.username.trim()) {
      newErrors.username = '昵称不能为空';
    } else if (tempProfile.username.length < 2) {
      newErrors.username = '昵称至少2个字符';
    } else if (tempProfile.username.length > 20) {
      newErrors.username = '昵称最多20个字符';
    }

    if (tempProfile.full_name && tempProfile.full_name.length > 50) {
      newErrors.full_name = '真实姓名最多50个字符';
    }

    if (tempProfile.phone && !/^1[3-9]\d{9}$/.test(tempProfile.phone)) {
      newErrors.phone = '请输入有效的手机号';
    }

    if (tempProfile.bio && tempProfile.bio.length > 200) {
      newErrors.bio = '个性签名最多200个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 保存资料到Supabase
  const handleSaveProfile = async () => {
    if (!validateForm()) {
      triggerToast('请检查表单错误');
      return;
    }

    setIsSaving(true);
    try {
      const success = await updateProfile({
        username: tempProfile.username,
        full_name: tempProfile.full_name || null,
        avatar_url: tempProfile.avatar,
        gender: tempProfile.gender,
        skill_level: tempProfile.level,
        play_style: tempProfile.style,
        bio: tempProfile.bio || null,
        phone: tempProfile.phone || null,
      });

      if (success) {
        setProfile({ ...tempProfile });
        setIsEditing(false);
        triggerToast('资料更新成功');
        // 重新加载以确保数据同步
        await loadUserProfile();
      } else {
        triggerToast('更新失败，请重试');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      triggerToast('保存失败');
    } finally {
      setIsSaving(false);
    }
  };

  // 上传头像到Supabase Storage
  const handleAvatarUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      triggerToast('请选择图片文件');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      triggerToast('图片大小不能超过5MB');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setTempProfile({ ...tempProfile, avatar: publicUrl });
      triggerToast('头像上传成功');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      triggerToast('上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  // 隐私设置状态
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showRank: true,
    allowNearby: false,
    biometric: true
  });

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2500);
  };



  const CustomSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
    <button
      onClick={onChange}
      className={`w-12 h-6 rounded-full transition-all relative ${checked ? 'bg-primary shadow-[0_0_10px_rgba(244,140,37,0.3)]' : 'bg-gray-800'}`}
    >
      <div className={`absolute top-1 size-4 bg-white rounded-full transition-all shadow-sm ${checked ? 'left-7' : 'left-1'}`}></div>
    </button>
  );

  return (
    <div className="animate-in slide-in-from-right duration-300 min-h-screen pb-20 bg-background-dark">
      <header className="sticky top-0 z-40 bg-background-dark/80 backdrop-blur-md p-4 flex items-center justify-between border-b border-white/5">
        <div className="w-12"></div>
        <h2 className="text-white text-lg font-black tracking-tight">个人中心</h2>
        <button
          onClick={() => setActiveSetting('notifications')}
          className="flex size-11 items-center justify-center rounded-xl bg-surface-dark text-white active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
      </header>

      {/* 核心个人资料卡片 */}
      <div className="relative flex p-8 flex-col items-center">
        <div className="relative mb-6">
          <div className="size-32 rounded-full border-4 border-primary/20 p-1.5 bg-gradient-to-tr from-primary/30 to-transparent shadow-2xl relative group">
            <img className="w-full h-full object-cover rounded-full" src={profile.avatar} alt="头像" />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white animate-spin">refresh</span>
              </div>
            )}
          </div>
          <button
            onClick={() => { setTempProfile({ ...profile }); setIsEditing(true); }}
            className="absolute bottom-1 right-1 bg-primary rounded-full p-2.5 border-4 border-background-dark flex items-center justify-center shadow-lg active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined text-background-dark text-[18px] font-black">edit</span>
          </button>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-white text-3xl font-black tracking-tighter">{profile.username}</p>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              <span className="material-symbols-outlined text-primary text-[14px]">workspace_premium</span>
              <p className="text-primary text-[10px] font-black uppercase">{profile.level}</p>
            </div>
            <div className="flex items-center gap-1.5 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              <span className="material-symbols-outlined text-blue-500 text-[14px]">sports_tennis</span>
              <p className="text-blue-500 text-[10px] font-black uppercase">{profile.style}</p>
            </div>
          </div>
          {profile.bio && (
            <p className="text-gray-400 text-xs max-w-[200px] text-center mt-2 line-clamp-2">{profile.bio}</p>
          )}
        </div>
      </div>

      {/* 资产与功能列表 (保持原有逻辑) */}
      <section className="px-6 py-4 grid grid-cols-2 gap-4">
        <button onClick={() => setShowBalanceDetail(true)} className="rounded-[28px] border border-primary/20 bg-surface-dark/40 p-5 text-left active:scale-95 transition-all">
          <div className="text-primary mb-3"><span className="material-symbols-outlined">account_balance_wallet</span></div>
          <h2 className="text-white text-xl font-black tracking-tight">¥{wallet?.balance?.toFixed(2) ?? '0.00'}</h2>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-wider">钱包余额</p>
        </button>
        <button onClick={() => setShowCoupons(true)} className="rounded-[28px] border border-white/5 bg-surface-dark/40 p-5 text-left active:scale-95 transition-all">
          <div className="text-gray-400 mb-3"><span className="material-symbols-outlined">confirmation_number</span></div>
          <h2 className="text-white text-xl font-black tracking-tight">{userCoupons.length} 张</h2>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-wider">优惠券</p>
        </button>
      </section>

      <section className="px-6 py-4 space-y-3">
        <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 ml-1">系统与隐私</h3>
        {[
          { id: 'notifications', label: '消息通知', icon: 'notifications', color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { id: 'privacy', label: '隐私安全', icon: 'security', color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { id: 'support', label: '帮助与客服', icon: 'headset_mic', color: 'text-green-500', bg: 'bg-green-500/10' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveSetting(item.id as any)}
            className="w-full flex items-center justify-between p-5 bg-surface-dark/40 rounded-[24px] border border-white/5 active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`size-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}>
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
              </div>
              <span className="text-white font-bold text-sm">{item.label}</span>
            </div>
            <span className="material-symbols-outlined text-gray-600">chevron_right</span>
          </button>
        ))}
      </section>

      {/* 退出按钮 */}
      <div className="px-6 py-6">
        <button onClick={onLogout} className="w-full h-14 border border-red-500/15 text-red-500/80 font-black text-xs tracking-widest flex items-center justify-center gap-2 rounded-2xl active:bg-red-500/10 transition-colors">
          <span className="material-symbols-outlined text-[18px]">logout</span> 退出登录
        </button>
      </div>

      {/* 统一抽屉容器 */}
      {activeSetting && (
        <>
          <div onClick={() => setActiveSetting(null)} className="fixed inset-0 z-[130] bg-black/80 backdrop-blur-md animate-in fade-in"></div>
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-[140] bg-card-dark rounded-t-[44px] p-8 animate-in slide-in-from-bottom duration-300 max-h-[94vh] flex flex-col">
            <div className="w-12 h-1.5 bg-gray-800 rounded-full mx-auto mb-8 shrink-0"></div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
              {activeSetting === 'privacy' ? (
                /* 隐私安全深度视图 */
                <div className="space-y-8">
                  <header className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-white">隐私与安全</h2>
                      <p className="text-purple-500 text-[10px] font-black uppercase tracking-widest mt-1">Privacy & Security Hub</p>
                    </div>
                    <div className="size-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 relative">
                      <div className="absolute inset-0 border border-purple-500/30 rounded-full animate-ping opacity-20"></div>
                      <span className="material-symbols-outlined font-black">shield_person</span>
                    </div>
                  </header>

                  {/* 隐私板块 */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">社交隐私</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-5 bg-surface-dark/50 rounded-2xl border border-white/5">
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-white">公开个人资料</h4>
                          <p className="text-[10px] text-gray-500 mt-0.5">允许球友在约球广场中发现你</p>
                        </div>
                        <CustomSwitch checked={privacySettings.publicProfile} onChange={() => setPrivacySettings({ ...privacySettings, publicProfile: !privacySettings.publicProfile })} />
                      </div>
                      <div className="flex items-center justify-between p-5 bg-surface-dark/50 rounded-2xl border border-white/5">
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-white">显示运动等级</h4>
                          <p className="text-[10px] text-gray-500 mt-0.5">在个人名片上展示您的真实段位</p>
                        </div>
                        <CustomSwitch checked={privacySettings.showRank} onChange={() => setPrivacySettings({ ...privacySettings, showRank: !privacySettings.showRank })} />
                      </div>
                      <button onClick={() => triggerToast('黑名单加载中...')} className="w-full flex items-center justify-between p-5 bg-surface-dark/50 rounded-2xl border border-white/5">
                        <span className="text-sm font-bold text-white">黑名单管理</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-600 font-bold">0 人</span>
                          <span className="material-symbols-outlined text-gray-600 text-lg">chevron_right</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* 安全板块 */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">账户安全</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-5 bg-surface-dark/50 rounded-2xl border border-white/5">
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-white">生物识别登录</h4>
                          <p className="text-[10px] text-gray-500 mt-0.5">使用 FaceID 或指纹快速验证</p>
                        </div>
                        <CustomSwitch checked={privacySettings.biometric} onChange={() => { setPrivacySettings({ ...privacySettings, biometric: !privacySettings.biometric }); triggerToast('安全校验成功'); }} />
                      </div>
                      <div className="p-5 bg-surface-dark/50 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-sm font-bold text-white">已登录设备</h4>
                          <span className="text-[10px] text-primary font-black uppercase">1台在线</span>
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl">
                          <span className="material-symbols-outlined text-gray-400">smartphone</span>
                          <div className="flex-1">
                            <p className="text-xs font-bold text-white">iPhone 15 Pro</p>
                            <p className="text-[9px] text-gray-600 font-medium">北京 · 当前设备</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 危险操作 */}
                  <div className="pt-4 space-y-4">
                    <p className="text-[10px] font-black text-red-500/50 uppercase tracking-widest ml-1">危险区域</p>
                    <button
                      onClick={() => { if (confirm('警告：注销账号将抹除所有运动数据和余额，确认继续？')) { triggerToast('请求已提交审核'); setActiveSetting(null); } }}
                      className="w-full flex items-center justify-between p-5 bg-red-500/5 rounded-2xl border border-red-500/10 active:bg-red-500/10 transition-colors"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-red-500">注销账户</h4>
                        <p className="text-[10px] text-red-500/50 mt-0.5">永久删除您的羽球生活数据</p>
                      </div>
                      <span className="material-symbols-outlined text-red-500/30">delete_forever</span>
                    </button>
                  </div>
                </div>
              ) : activeSetting === 'notifications' ? (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-white">通知设置</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 bg-surface-dark rounded-2xl">
                      <div><h4 className="text-sm font-black">预约提醒</h4><p className="text-[10px] text-gray-500">场地变更时实时推送</p></div>
                      <CustomSwitch checked={true} onChange={() => { }} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="size-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-2">
                    <span className="material-symbols-outlined text-4xl">contact_support</span>
                  </div>
                  <h2 className="text-xl font-black">联系客服</h2>
                  <p className="text-sm text-gray-500 px-10">我们的客服团队 7x24 小时在线，随时准备为您提供场地协助。</p>
                  <button onClick={() => triggerToast('正在连接人工坐席...')} className="mt-4 bg-green-500 text-background-dark px-10 py-3 rounded-2xl font-black text-xs active:scale-95 transition-all">立即通话</button>
                </div>
              )}
            </div>

            <button onClick={() => setActiveSetting(null)} className="shrink-0 py-6 text-gray-500 font-bold text-sm tracking-widest uppercase">关闭并返回</button>
          </div>
        </>
      )}

      {/* 修改资料抽屉 - 全面升级版 */}
      {isEditing && (
        <>
          <div onClick={() => setIsEditing(false)} className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md animate-in fade-in"></div>
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-[110] bg-card-dark rounded-t-[44px] p-8 animate-in slide-in-from-bottom duration-500 max-h-[90vh] flex flex-col">
            <div className="w-12 h-1.5 bg-gray-800 rounded-full mx-auto mb-6 shrink-0"></div>
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h2 className="text-2xl font-black text-white">编辑个人资料</h2>
              {isSaving && <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>}
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-6">
              {/* 更改头像区块 */}
              <div className="flex flex-col items-center gap-3 py-2">
                <div className="size-24 rounded-full border-2 border-primary/20 p-1 relative">
                  <img className="w-full h-full object-cover rounded-full" src={tempProfile.avatar} alt="Current" />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center z-10">
                      <span className="material-symbols-outlined text-white animate-spin">refresh</span>
                    </div>
                  )}
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-surface-dark border border-white/10 p-2 rounded-full shadow-lg active:scale-90 transition-all cursor-pointer">
                    <span className="material-symbols-outlined text-white text-sm">photo_camera</span>
                  </label>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleAvatarUpload(e.target.files[0]);
                    }}
                  />
                </div>
                <p className="text-[10px] text-gray-500 font-bold">点击图标更换头像</p>
              </div>

              {/* 表单字段 */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">昵称 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={tempProfile.username}
                    onChange={(e) => setTempProfile({ ...tempProfile, username: e.target.value })}
                    className={`w-full h-14 bg-surface-dark border ${errors.username ? 'border-red-500/50' : 'border-transparent'} rounded-2xl px-6 text-white font-bold focus:border-primary/50 focus:outline-none transition-colors`}
                    placeholder="您的公开昵称"
                  />
                  {errors.username && <p className="text-red-500 text-[10px] font-bold pl-2">{errors.username}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">个性签名</label>
                  <textarea
                    value={tempProfile.bio}
                    onChange={(e) => setTempProfile({ ...tempProfile, bio: e.target.value })}
                    className={`w-full h-24 bg-surface-dark border ${errors.bio ? 'border-red-500/50' : 'border-transparent'} rounded-2xl p-4 text-white font-bold focus:border-primary/50 focus:outline-none transition-colors resize-none`}
                    placeholder="介绍一下自己，比如擅长的位置..."
                  />
                  {errors.bio && <p className="text-red-500 text-[10px] font-bold pl-2">{errors.bio}</p>}
                </div>

                <div className="grid grid-cols-[100px_1fr] gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">性别</label>
                    <select
                      value={tempProfile.gender}
                      onChange={(e) => setTempProfile({ ...tempProfile, gender: e.target.value })}
                      className="w-full h-14 bg-surface-dark border-r-[12px] border-transparent rounded-2xl px-4 text-white font-bold outline outline-1 outline-white/5 focus:outline-primary/50"
                    >
                      <option>男</option>
                      <option>女</option>
                      <option>保密</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">真实姓名</label>
                    <input
                      type="text"
                      value={tempProfile.full_name}
                      onChange={(e) => setTempProfile({ ...tempProfile, full_name: e.target.value })}
                      className="w-full h-14 bg-surface-dark border border-transparent rounded-2xl px-6 text-white font-bold focus:border-primary/50 focus:outline-none transition-colors"
                      placeholder="选填"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">手机号</label>
                  <input
                    type="tel"
                    value={tempProfile.phone}
                    onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                    className={`w-full h-14 bg-surface-dark border ${errors.phone ? 'border-red-500/50' : 'border-transparent'} rounded-2xl px-6 text-white font-bold focus:border-primary/50 focus:outline-none transition-colors`}
                    placeholder="选填"
                  />
                  {errors.phone && <p className="text-red-500 text-[10px] font-bold pl-2">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">羽球档案</label>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={tempProfile.level}
                      onChange={(e) => setTempProfile({ ...tempProfile, level: e.target.value })}
                      className="h-12 bg-surface-dark border-r-[16px] border-transparent rounded-xl px-4 text-white text-sm font-bold outline outline-1 outline-white/5 focus:outline-primary/50"
                    >
                      <option>新手入门</option>
                      <option>日常进阶</option>
                      <option>中级强推</option>
                      <option>高级精英</option>
                      <option>专业水准</option>
                    </select>
                    <select
                      value={tempProfile.style}
                      onChange={(e) => setTempProfile({ ...tempProfile, style: e.target.value })}
                      className="h-12 bg-surface-dark border-r-[16px] border-transparent rounded-xl px-4 text-white text-sm font-bold outline outline-1 outline-white/5 focus:outline-primary/50"
                    >
                      <option>攻守兼备</option>
                      <option>暴力进攻</option>
                      <option>拉吊突击</option>
                      <option>防守反击</option>
                      <option>网前雨刮</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 shrink-0">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving || isUploading}
                className="w-full bg-primary text-background-dark h-14 rounded-2xl font-black shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
              >
                {isSaving ? '保存中...' : '保存更改'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* 钱包详情抽屉 */}
      {showBalanceDetail && (
        <>
          <div onClick={() => setShowBalanceDetail(false)} className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md animate-in fade-in"></div>
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-[130] bg-card-dark rounded-t-[44px] p-8 animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col">
            <div className="w-12 h-1.5 bg-gray-800 rounded-full mx-auto mb-8 shrink-0"></div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white">我的钱包</h2>
              <button onClick={handleTopUp} className="bg-primary text-background-dark px-4 py-2 rounded-xl font-bold text-xs active:scale-95 transition-all">
                充值 ¥100
              </button>
            </div>

            <div className="bg-surface-dark rounded-3xl p-6 border border-white/5 mb-8 text-center shrink-0">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">总资产</p>
              <h3 className="text-4xl font-black text-white tracking-tighter">¥{wallet?.balance?.toFixed(2) ?? '0.00'}</h3>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 pl-1">交易记录</p>
              {transactions.length === 0 ? (
                <div className="py-10 text-center text-gray-500 text-sm">暂无交易记录</div>
              ) : (
                <div className="space-y-3">
                  {transactions.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-surface-dark/50 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-full flex items-center justify-center ${tx.type === 'deposit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          <span className="material-symbols-outlined text-lg">{tx.type === 'deposit' ? 'add' : 'remove'}</span>
                        </div>
                        <div>
                          <p className="text-white text-sm font-bold">{tx.description || (tx.type === 'deposit' ? '充值' : '消费')}</p>
                          <p className="text-gray-600 text-[10px]">{new Date(tx.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`font-black tracking-tight ${tx.type === 'deposit' ? 'text-green-500' : 'text-white'}`}>
                        {tx.type === 'deposit' ? '+' : '-'}¥{tx.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* 优惠券抽屉 */}
      {showCoupons && (
        <>
          <div onClick={() => setShowCoupons(false)} className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md animate-in fade-in"></div>
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-[130] bg-card-dark rounded-t-[44px] p-8 animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col">
            <div className="w-12 h-1.5 bg-gray-800 rounded-full mx-auto mb-8 shrink-0"></div>
            <h2 className="text-2xl font-black text-white mb-6">我的优惠券</h2>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
              {userCoupons.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                  <div className="size-16 rounded-full bg-gray-800 flex items-center justify-center text-gray-600">
                    <span className="material-symbols-outlined text-2xl">sentiment_dissatisfied</span>
                  </div>
                  <p className="text-gray-500 font-bold">暂无可用优惠券</p>
                </div>
              ) : (
                userCoupons.map(uc => (
                  <div key={uc.id} className="relative bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF] p-1 rounded-2xl">
                    <div className="bg-surface-dark h-full rounded-xl p-5 flex items-center justify-between relative overflow-hidden">
                      <div className="relative z-10">
                        <h3 className="text-white font-black text-lg">{uc.coupon?.title}</h3>
                        <p className="text-gray-400 text-xs mt-1">{uc.coupon?.description}</p>
                        <p className="text-primary text-[10px] font-bold mt-3 uppercase tracking-wider">有效期至 {new Date(uc.coupon?.valid_until || '').toLocaleDateString()}</p>
                      </div>
                      <div className="relative z-10 text-right">
                        <p className="text-white text-3xl font-black tracking-tighter">
                          {uc.coupon?.discount_type === 'fixed' ? '¥' : ''}{uc.coupon?.discount_value}{uc.coupon?.discount_type === 'percentage' ? '%' : ''}
                        </p>
                        <span className="inline-block bg-white/10 px-2 py-1 rounded-md text-[9px] text-white font-bold mt-1">OFF</span>
                      </div>
                      {/* 装饰圆圈 */}
                      <div className="absolute -right-6 -bottom-6 size-24 bg-primary/10 rounded-full blur-xl"></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* 全局 Toast */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-white text-background-dark px-6 py-3 rounded-full font-black text-xs shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          {showToast}
        </div>
      )}
    </div>
  );
};

export default ProfileView;
