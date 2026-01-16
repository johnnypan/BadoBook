
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Booking } from '../types';

const ScheduleView: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 48, seconds: 15 });
  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);
  const [manageViewMode, setManageViewMode] = useState<'pass' | 'control'>('pass');
  const [ticketSubMode, setTicketSubMode] = useState<'code' | 'map'>('code');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  // 模拟数据
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'b1',
      venueName: '王牌穿梭俱乐部 - 04号场',
      date: '10月24日 (今日)',
      time: '18:00 - 20:00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR9PSBNzWWD-kYk51sPAguziofzxSIGSzEYa7fuBCyNS7sbkyiyrM60F78fBL6sYfV6G4yZ7bt36q4AMoK0JkkT1iko_ItLDLG0wgJgVF21bx63_fMNaaktoEtu-ieftKIAvftpZ2qhfEkkH6Nx6LnKU08jieRyZEmHssEV2ObfVNctljpFpkNVJpxy8kyvwLkdCHE2f6KxSoiDTqxLs2UaxkwG1vxghMxNvRLwC3t-1scOSLxqP5L8QfuWWSpoKuuztOLizxUVODs',
      status: 'upcoming',
      players: ['Johnny', '阿强', '小美', '大壮']
    },
    {
      id: 'b2',
      venueName: '精英之翼中心 - 01号场',
      date: '10月26日 (周六)',
      time: '09:00 - 11:00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxUFFUN-oLteKqt64Tr12NDzZwUhHd_s_APMu7e8dnDEa1Z-_0eocR2vp6Pw7dICHHb9BmyXVWSGycx_PVgnQc6zarcOGYbw3ykr1XVwLWl5dsDTqiT0piYla3KGjDApchS6EEgorVgEYJ6-GG_TsSPTAjeqY_1R_QUGcgpKsQufqXK8XZ-8D7OqD43XjkEGCuy0peaGzUtQ_O-Do7WIx63xMhbNhlLWZX_VaAWw6bmjhoe_JI5_OqVJLNHu0UqSWxNYw5Zh1rO_sn',
      status: 'upcoming',
      players: ['Johnny']
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2500);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const filteredBookings = bookings.filter(b => b.status === activeTab);

  return (
    <div className="animate-in fade-in duration-500 min-h-screen pb-24 bg-background-dark">
      {/* 动态氛围背景 */}
      <div className={`fixed inset-0 pointer-events-none transition-colors duration-1000 ${activeTab === 'upcoming' ? 'bg-primary/5' : 'bg-transparent'}`}></div>

      <header className="sticky top-0 z-40 bg-background-dark/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center p-6 justify-between">
          <div className="flex flex-col">
            <h2 className="text-white text-2xl font-black tracking-tight leading-none">行程中心</h2>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1.5">Your Matchday Hub</p>
          </div>
          <button 
            onClick={handleRefresh}
            className={`size-11 rounded-2xl bg-surface-dark flex items-center justify-center text-white transition-transform ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>

        <div className="px-6 pb-4">
          <div className="flex h-12 items-center justify-around rounded-2xl bg-surface-dark/50 p-1.5 border border-white/5 shadow-inner relative">
             <div className={`absolute top-1.5 bottom-1.5 w-[31%] bg-primary rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 ${
               activeTab === 'upcoming' ? 'left-1.5' : activeTab === 'completed' ? 'left-[34.5%]' : 'left-[67.5%]'
             }`}></div>
             
            {(['upcoming', 'completed', 'cancelled'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative z-10 flex-1 h-full text-xs font-black transition-colors ${
                  activeTab === tab ? 'text-background-dark' : 'text-gray-500'
                }`}
              >
                {tab === 'upcoming' ? '待使用' : tab === 'completed' ? '已完成' : '已取消'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="px-6 py-6 space-y-8 relative z-10">
        {activeTab === 'upcoming' && (
          <section className="bg-gradient-to-r from-primary/20 to-transparent p-6 rounded-[32px] border border-primary/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 size-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative">
              <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="size-1.5 bg-primary rounded-full animate-pulse"></span>
                最近一场 · 倒计时
              </p>
              <div className="flex items-end gap-3">
                <span className="text-white text-4xl font-black">{timeLeft.hours}</span>
                <span className="text-gray-500 text-sm font-bold pb-1.5">时</span>
                <span className="text-white text-4xl font-black">{timeLeft.minutes}</span>
                <span className="text-gray-500 text-sm font-bold pb-1.5">分</span>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => { setSelectedTicket(bookings[0]); setManageViewMode('pass'); }}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-background-dark py-3 rounded-2xl font-black text-xs shadow-xl shadow-primary/20 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                  快速入场
                </button>
                <button 
                  onClick={() => { setSelectedTicket(bookings[0]); setManageViewMode('control'); }}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/5 text-white py-3 rounded-2xl font-black text-xs active:bg-white/10 transition-all border border-white/5"
                >
                  <span className="material-symbols-outlined text-[18px]">settings_accessibility</span>
                  管理行程
                </button>
              </div>
            </div>
          </section>
        )}

        <div className="space-y-6">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((b) => (
              <div key={b.id} className="group relative bg-surface-dark/40 rounded-[32px] border border-white/5 overflow-hidden transition-all hover:border-white/10">
                <div className="flex flex-col">
                  <div className="h-32 relative overflow-hidden">
                    <img src={b.image} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                       <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black text-white border border-white/10 uppercase">
                         {b.status}
                       </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-white text-lg font-black tracking-tight mb-1">{b.venueName}</h4>
                    <p className="text-gray-500 text-[11px] font-bold mb-5 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">event</span> {b.date} • {b.time}
                    </p>
                    <div className="flex items-center justify-between pt-5 border-t border-white/5">
                      <div className="flex -space-x-1.5">
                        {b.players.slice(0, 3).map((p, i) => (
                          <div key={i} className="size-8 rounded-full border-2 border-surface-dark bg-gray-800 overflow-hidden shadow-lg">
                            <img src={`https://picsum.photos/id/${120 + i}/50/50`} alt={p} />
                          </div>
                        ))}
                        {b.players.length > 3 && (
                          <div className="size-8 rounded-full border-2 border-surface-dark bg-primary/20 flex items-center justify-center text-[10px] font-black text-primary">
                            +{b.players.length - 3}
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => { setSelectedTicket(b); setManageViewMode('control'); }}
                        className="bg-primary/10 text-primary px-5 py-2.5 rounded-xl text-[11px] font-black hover:bg-primary/20 transition-all"
                      >
                        管理球局
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
              <span className="material-symbols-outlined text-6xl mb-4">event_busy</span>
              <p className="text-sm font-bold tracking-widest uppercase">暂无相关行程</p>
            </div>
          )}
        </div>
      </main>

      {/* 全能球局控制中心 */}
      {selectedTicket && (
        <>
          <div onClick={() => setSelectedTicket(null)} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl animate-in fade-in"></div>
          <div className="fixed inset-x-0 bottom-0 z-[110] max-w-md mx-auto animate-in slide-in-from-bottom duration-500 flex flex-col h-[90vh]">
            
            {/* 顶部标签切换 */}
            <div className="px-6 pb-4">
               <div className="bg-surface-dark/80 backdrop-blur-md p-1.5 rounded-2xl flex border border-white/10 shadow-xl">
                 <button 
                  onClick={() => setManageViewMode('pass')}
                  className={`flex-1 h-11 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${manageViewMode === 'pass' ? 'bg-primary text-background-dark shadow-lg shadow-primary/20' : 'text-gray-500'}`}
                 >
                   <span className="material-symbols-outlined text-lg">qr_code</span> 电子凭证
                 </button>
                 <button 
                  onClick={() => setManageViewMode('control')}
                  className={`flex-1 h-11 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${manageViewMode === 'control' ? 'bg-primary text-background-dark shadow-lg shadow-primary/20' : 'text-gray-500'}`}
                 >
                   <span className="material-symbols-outlined text-lg">dashboard</span> 球局管理
                 </button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-12">
              {manageViewMode === 'pass' ? (
                /* 电子凭证视图 (原版增强) */
                <div className="bg-white rounded-[44px] overflow-hidden shadow-2xl relative animate-in zoom-in-95">
                  <div className="absolute top-[34%] -left-4 size-8 bg-background-dark rounded-full"></div>
                  <div className="absolute top-[34%] -right-4 size-8 bg-background-dark rounded-full"></div>
                  <div className="absolute top-[34%] left-10 right-10 border-t-2 border-dashed border-gray-100"></div>
                  
                  <div className="p-8 pb-10">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-2">
                        <div className="size-9 rounded-xl bg-background-dark flex items-center justify-center text-primary font-black text-lg">羽</div>
                        <span className="text-background-dark font-black tracking-tight text-base">VIP PASS</span>
                      </div>
                      <div className="flex bg-gray-100 p-1 rounded-full">
                        <button onClick={() => setTicketSubMode('code')} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${ticketSubMode === 'code' ? 'bg-white text-background-dark shadow-sm' : 'text-gray-400'}`}>凭证码</button>
                        <button onClick={() => setTicketSubMode('map')} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${ticketSubMode === 'map' ? 'bg-white text-background-dark shadow-sm' : 'text-gray-400'}`}>地图</button>
                      </div>
                    </div>
                    <h3 className="text-background-dark text-2xl font-black mb-1 leading-tight">{selectedTicket.venueName}</h3>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">场地：室内羽毛球场 04 号</p>
                    <div className="grid grid-cols-2 gap-8 mt-8 border-t border-gray-50 pt-6">
                      <div><p className="text-gray-400 text-[9px] font-black uppercase mb-1">Date</p><p className="text-background-dark font-black text-sm">{selectedTicket.date}</p></div>
                      <div className="text-right"><p className="text-gray-400 text-[9px] font-black uppercase mb-1">Time</p><p className="text-primary font-black text-sm">{selectedTicket.time}</p></div>
                    </div>
                  </div>

                  <div className="bg-gray-50/50 p-8 pt-10 flex flex-col items-center min-h-[320px]">
                    {ticketSubMode === 'code' ? (
                      <div className="w-full flex flex-col items-center">
                        <div className="relative p-5 bg-white rounded-3xl shadow-sm border border-gray-100">
                          <div className="absolute top-5 left-5 right-5 h-1 bg-primary/30 z-10 animate-[bounce_2s_infinite]"></div>
                          <div className="size-44 bg-background-dark rounded-2xl flex flex-wrap p-2 gap-1 overflow-hidden opacity-95">
                             {Array.from({length: 64}).map((_, i) => (
                               <div key={i} className={`size-4 ${Math.random() > 0.4 ? 'bg-white' : 'bg-transparent'} rounded-[2px]`}></div>
                             ))}
                          </div>
                        </div>
                        <p className="text-background-dark font-black text-3xl tracking-[0.4em] mt-6">829-105</p>
                        <p className="text-success-green text-[9px] font-bold mt-2 uppercase flex items-center gap-1">
                          <span className="size-1.5 bg-success-green rounded-full animate-pulse"></span>
                          验证码已激活
                        </p>
                      </div>
                    ) : (
                      <div className="w-full aspect-square bg-white rounded-3xl border border-gray-100 p-6 flex flex-col">
                         <p className="text-gray-400 text-[9px] font-black uppercase mb-4 tracking-widest text-center">场馆平面图</p>
                         <div className="flex-1 grid grid-cols-4 gap-2">
                            {Array.from({length: 12}).map((_, i) => (
                              <div key={i} className={`rounded-lg border-2 flex items-center justify-center text-[10px] font-black ${i === 3 ? 'bg-primary/20 border-primary text-primary' : 'bg-gray-50 border-gray-100 text-gray-200'}`}>{i + 1}</div>
                            ))}
                         </div>
                      </div>
                    )}
                    <button onClick={() => triggerToast('凭证已保存至相册')} className="w-full mt-10 h-14 bg-background-dark text-white rounded-2xl font-black text-xs active:scale-95 transition-all">保存入场凭证</button>
                  </div>
                </div>
              ) : (
                /* 球局控制台视图 (新增) */
                <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
                   {/* 状态看板 */}
                   <div className="bg-surface-dark/40 rounded-[32px] p-6 border border-white/5">
                      <div className="flex justify-between items-center mb-6">
                         <h4 className="text-white text-sm font-black">球局状态</h4>
                         <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black rounded-full">待开始</span>
                      </div>
                      <div className="flex items-center justify-between relative px-2">
                         <div className="absolute top-2.5 left-8 right-8 h-0.5 bg-gray-800"></div>
                         <div className="absolute top-2.5 left-8 w-1/3 h-0.5 bg-primary"></div>
                         {[
                           { icon: 'task_alt', label: '已预订', active: true },
                           { icon: 'login', label: '待入场', active: true },
                           { icon: 'sports_tennis', label: '对局中', active: false },
                           { icon: 'star', label: '评价', active: false }
                         ].map((s, i) => (
                           <div key={i} className="flex flex-col items-center gap-2 relative z-10">
                              <div className={`size-6 rounded-full flex items-center justify-center border-2 ${s.active ? 'bg-primary border-primary text-background-dark' : 'bg-background-dark border-gray-800 text-gray-700'}`}>
                                 <span className="material-symbols-outlined text-[14px] font-black">{s.icon}</span>
                              </div>
                              <span className={`text-[9px] font-bold ${s.active ? 'text-white' : 'text-gray-600'}`}>{s.label}</span>
                           </div>
                         ))}
                      </div>
                   </div>

                   {/* 队友管理 */}
                   <div className="bg-surface-dark/40 rounded-[32px] p-6 border border-white/5">
                      <div className="flex justify-between items-center mb-4">
                         <h4 className="text-white text-sm font-black">队友阵容 ({selectedTicket.players.length}/4)</h4>
                         <button onClick={() => triggerToast('邀约链接已复制')} className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                           <span className="material-symbols-outlined text-sm">share</span> 邀约
                         </button>
                      </div>
                      <div className="space-y-3">
                         {selectedTicket.players.map((p, i) => (
                           <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                              <div className="flex items-center gap-3">
                                 <img src={`https://picsum.photos/id/${140+i}/50/50`} className="size-9 rounded-xl object-cover" alt="" />
                                 <div>
                                   <p className="text-white text-xs font-bold">{p}</p>
                                   <p className="text-gray-500 text-[9px] font-bold">黄金段位 · 进攻型</p>
                                 </div>
                              </div>
                              <button className="size-8 rounded-lg bg-surface-dark flex items-center justify-center text-gray-400 active:text-primary">
                                 <span className="material-symbols-outlined text-lg">chat</span>
                              </button>
                           </div>
                         ))}
                      </div>
                   </div>

                   {/* 智能贴士 */}
                   <div className="bg-gradient-to-br from-blue-500/10 to-transparent rounded-[32px] p-6 border border-blue-500/10">
                      <div className="flex items-start gap-4">
                         <div className="size-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                            <span className="material-symbols-outlined">lightbulb</span>
                         </div>
                         <div className="flex-1">
                            <h5 className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-1">今日对局贴士</h5>
                            <p className="text-gray-400 text-[11px] leading-relaxed">
                               场馆内平均气温 24℃，体感舒适。建议提前 10 分钟热身，多备一瓶电解质水以维持体能。
                            </p>
                         </div>
                      </div>
                   </div>

                   {/* 服务入口 */}
                   <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => triggerToast('已添加到系统日历')} className="h-20 rounded-2xl bg-surface-dark/60 border border-white/5 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all">
                         <span className="material-symbols-outlined text-gray-400">calendar_add_on</span>
                         <span className="text-[10px] font-black text-white uppercase tracking-widest">添加日历</span>
                      </button>
                      <button onClick={() => alert('正在呼叫场馆前台...')} className="h-20 rounded-2xl bg-surface-dark/60 border border-white/5 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all">
                         <span className="material-symbols-outlined text-gray-400">support_agent</span>
                         <span className="text-[10px] font-black text-white uppercase tracking-widest">联系客服</span>
                      </button>
                      <button onClick={() => setManageViewMode('pass')} className="h-20 rounded-2xl bg-surface-dark/60 border border-white/5 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all">
                         <span className="material-symbols-outlined text-gray-400">location_on</span>
                         <span className="text-[10px] font-black text-white uppercase tracking-widest">导航到场</span>
                      </button>
                      <button onClick={() => { if(confirm('确认取消？')){ setSelectedTicket(null); triggerToast('已发起退款'); } }} className="h-20 rounded-2xl bg-red-500/5 border border-red-500/10 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all">
                         <span className="material-symbols-outlined text-red-500/50">cancel</span>
                         <span className="text-[10px] font-black text-red-500/80 uppercase tracking-widest">取消预约</span>
                      </button>
                   </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setSelectedTicket(null)}
              className="py-6 text-white/30 font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
              Slide Down to Close
            </button>
          </div>
        </>
      )}

      {/* 全局通知 */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-white text-background-dark px-6 py-3 rounded-full font-black text-xs shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
           {showToast}
        </div>
      )}
    </div>
  );
};

export default ScheduleView;
