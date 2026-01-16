
import React, { useState } from 'react';

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
  const [showToast, setShowToast] = useState<string | null>(null);
  
  // 核心用户状态
  const [profile, setProfile] = useState({
    username: username,
    avatar: "https://picsum.photos/id/64/200/200",
    gender: '男',
    level: '日常进阶',
    style: '攻守兼备',
    balance: 320.00
  });

  const [tempProfile, setTempProfile] = useState({ ...profile });
  
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

  const handleSaveProfile = () => {
    setProfile({ ...tempProfile });
    setIsEditing(false);
    triggerToast('资料更新成功');
  };

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const randomId = Math.floor(Math.random() * 1000);
      setTempProfile({ ...tempProfile, avatar: `https://picsum.photos/seed/${randomId}/200/200` });
      setIsUploading(false);
    }, 1500);
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
          <div className="size-32 rounded-full border-4 border-primary/20 p-1.5 bg-gradient-to-tr from-primary/30 to-transparent shadow-2xl">
            <img className="w-full h-full object-cover rounded-full" src={profile.avatar} alt="头像" />
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
          </div>
        </div>
      </div>

      {/* 资产与功能列表 (保持原有逻辑) */}
      <section className="px-6 py-4 grid grid-cols-2 gap-4">
        <button onClick={() => setShowBalanceDetail(true)} className="rounded-[28px] border border-primary/20 bg-surface-dark/40 p-5 text-left active:scale-95 transition-all">
          <div className="text-primary mb-3"><span className="material-symbols-outlined">account_balance_wallet</span></div>
          <h2 className="text-white text-xl font-black tracking-tight">¥{profile.balance.toFixed(2)}</h2>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-wider">钱包余额</p>
        </button>
        <button onClick={() => setShowCoupons(true)} className="rounded-[28px] border border-white/5 bg-surface-dark/40 p-5 text-left active:scale-95 transition-all">
          <div className="text-gray-400 mb-3"><span className="material-symbols-outlined">confirmation_number</span></div>
          <h2 className="text-white text-xl font-black tracking-tight">3 张</h2>
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
                        <CustomSwitch checked={privacySettings.publicProfile} onChange={() => setPrivacySettings({...privacySettings, publicProfile: !privacySettings.publicProfile})} />
                      </div>
                      <div className="flex items-center justify-between p-5 bg-surface-dark/50 rounded-2xl border border-white/5">
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-white">显示运动等级</h4>
                          <p className="text-[10px] text-gray-500 mt-0.5">在个人名片上展示您的真实段位</p>
                        </div>
                        <CustomSwitch checked={privacySettings.showRank} onChange={() => setPrivacySettings({...privacySettings, showRank: !privacySettings.showRank})} />
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
                        <CustomSwitch checked={privacySettings.biometric} onChange={() => { setPrivacySettings({...privacySettings, biometric: !privacySettings.biometric}); triggerToast('安全校验成功'); }} />
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
                      onClick={() => { if(confirm('警告：注销账号将抹除所有运动数据和余额，确认继续？')){ triggerToast('请求已提交审核'); setActiveSetting(null); } }}
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
                      <CustomSwitch checked={true} onChange={() => {}} />
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

      {/* 修改资料抽屉 (略) */}
      {isEditing && (
        <>
          <div onClick={() => setIsEditing(false)} className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md animate-in fade-in"></div>
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-[110] bg-card-dark rounded-t-[44px] p-8 animate-in slide-in-from-bottom duration-500">
            <div className="w-12 h-1.5 bg-gray-800 rounded-full mx-auto mb-8"></div>
            <h2 className="text-2xl font-black mb-8">编辑个人资料</h2>
            <div className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">昵称</label>
                 <input type="text" value={tempProfile.username} onChange={(e) => setTempProfile({...tempProfile, username: e.target.value})} className="w-full h-14 bg-surface-dark border-none rounded-2xl px-6 text-white font-bold" />
               </div>
               <button onClick={handleSaveProfile} className="w-full bg-primary text-background-dark h-14 rounded-2xl font-black shadow-xl">保存更改</button>
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
