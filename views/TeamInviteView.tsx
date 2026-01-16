
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TeamRequest } from '../types';

// 扩展数据模型以支持更丰富的展示
interface EnhancedTeamRequest extends TeamRequest {
  creator: {
    name: string;
    avatar: string;
    level: string;
  };
  joinedPlayers: string[];
  isNew?: boolean;
}

const TeamInviteView: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'all' | 'beginner' | 'expert'>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<EnhancedTeamRequest | null>(null);
  const [joinedIds, setJoinedIds] = useState<string[]>([]);

  // 列表数据状态化，以便能够动态添加
  const [requests, setRequests] = useState<EnhancedTeamRequest[]>([
    {
      id: 'tr1',
      venueName: '奥体中心羽毛球馆',
      level: '中级水平',
      missingCount: 2,
      time: '今天 19:00 - 21:00',
      location: '朝阳区天辰东路',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDk89xB79UZIHEtqYhYioBHO2AIeII-RidpzDN4Km_3Yv771CmBqanJrZJ_TTDfDLhSse1MnCGg8CaozfDFNPjmZ8iTHK2-87YKYlV50vpXMWySro3Sj-DvIe7SPNeAbTW_lAiz4dn-ejmWUEtSFDtVlCKSFHW4r5dEbHziYj1Z1qsFIJE9adcZoAKRWUdIx1FQvrRxtHSobBdyYGa76mBkMEkffarZv44zbT6qytRvEgVc4R1Cb5KYQXcRJayFq92Q4w83iFwl8I4P',
      creator: { name: '羽球达人L', avatar: 'https://picsum.photos/id/82/100/100', level: '黄金段位' },
      joinedPlayers: ['https://picsum.photos/id/91/50/50', 'https://picsum.photos/id/92/50/50']
    },
    {
      id: 'tr2',
      venueName: '飞扬羽球俱乐部',
      level: '高级精英',
      missingCount: 1,
      time: '明天 18:00 - 20:00',
      location: '海淀区学院路馆',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXKcgnOyyCY9p-Folz_Va5mNw4WZmD5T0l6VcAvp5UYUfyPTjcXG6zjGcb8emNRT-xUMbtfKzwnwPksnJuo9EXr0SLOy2PGacGjD3ehlwW3yzdParwRp6SKwTj0LJ0kn-qsvmjoqeeytO_logZoqtEhSYFXmvRybjeeXvqKuPpo64NCinbYPVkDcpTJWhM7e4I79g_9TDE2TtPl9eOnXN8g7c_LlajfckEjW_SDmN-RN7swRRsiBUCwrlSb4p46KFb3kJAq_n-pz73',
      creator: { name: '阿强', avatar: 'https://picsum.photos/id/83/100/100', level: '铂金段位' },
      joinedPlayers: ['https://picsum.photos/id/93/50/50', 'https://picsum.photos/id/94/50/50', 'https://picsum.photos/id/95/50/50']
    }
  ]);

  // 表单状态
  const [formVenue, setFormVenue] = useState('王牌穿梭俱乐部');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formLevel, setFormLevel] = useState('日常进阶');
  const [formMissing, setFormMissing] = useState(2);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleJoin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (joinedIds.includes(id)) return;
    setJoinedIds([...joinedIds, id]);
    alert('申请已发送！发起人同意后将通知您。');
  };

  const handlePublish = () => {
    if (!formDate || !formTime) {
      alert('请选择完整的时间和日期');
      return;
    }
    
    setIsPublishing(true);
    
    // 模拟发布延迟
    setTimeout(() => {
      const newInvite: EnhancedTeamRequest = {
        id: 'tr-' + Date.now(),
        venueName: formVenue,
        level: formLevel,
        missingCount: formMissing,
        time: `${formDate} ${formTime}`,
        location: '已预订场馆内',
        image: 'https://picsum.photos/id/101/400/300',
        creator: { name: 'Johnny', avatar: 'https://picsum.photos/id/64/100/100', level: '进阶球友' },
        joinedPlayers: ['https://picsum.photos/id/64/100/100'],
        isNew: true
      };
      
      setRequests([newInvite, ...requests]);
      setIsPublishing(false);
      setIsCreating(false);
      
      // 重置表单
      setFormDate('');
      setFormTime('');
    }, 1200);
  };

  const filteredRequests = requests.filter(r => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'beginner') return r.level.includes('入门') || r.level.includes('进阶') || r.level.includes('中级');
    if (activeFilter === 'expert') return r.level.includes('高级') || r.level.includes('专业');
    return true;
  });

  return (
    <div className="animate-in slide-in-from-right duration-300 min-h-screen pb-24">
      <header className="sticky top-0 z-40 bg-background-dark/80 backdrop-blur-md border-b border-white/5 p-4 flex justify-between items-center">
        <h1 className="text-xl font-black leading-tight flex-1">队友邀约</h1>
        <div className="flex gap-2">
          <button className="flex size-10 items-center justify-center rounded-xl bg-surface-dark text-white active:scale-95 transition-all">
            <span className="material-symbols-outlined">search</span>
          </button>
          <button className="flex size-10 items-center justify-center rounded-xl bg-surface-dark text-white active:scale-95 transition-all">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
      </header>

      <main>
        {/* 发起组队横幅 */}
        <div className="p-4">
          <div className="relative overflow-hidden rounded-[28px] bg-primary group active:scale-[0.98] transition-all shadow-2xl shadow-primary/20">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="relative p-6 flex items-center justify-between">
              <div className="max-w-[60%]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="size-2 bg-background-dark rounded-full animate-pulse"></span>
                  <p className="text-background-dark text-[10px] font-black uppercase tracking-[0.2em]">Live Community</p>
                </div>
                <h2 className="text-background-dark text-2xl font-black mb-1">找不到队友？</h2>
                <p className="text-background-dark/70 text-xs font-bold leading-relaxed mb-4">自己创建一个局，让附近的球友发现你！</p>
                <button 
                  onClick={() => setIsCreating(true)}
                  className="bg-background-dark text-primary px-6 py-2.5 rounded-xl font-black text-xs shadow-xl active:translate-y-1 transition-all"
                >
                  发起约球 +
                </button>
              </div>
              <div className="size-24 bg-background-dark/10 rounded-full flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <span className="material-symbols-outlined text-6xl text-background-dark/80">groups</span>
              </div>
            </div>
          </div>
        </div>

        {/* 筛选标签 */}
        <div className="flex gap-2 px-4 mb-4 overflow-x-auto no-scrollbar">
          {([
            { id: 'all', label: '全部球局' },
            { id: 'beginner', label: '入门/进阶' },
            { id: 'expert', label: '高手切磋' }
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`shrink-0 px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeFilter === tab.id ? 'bg-primary text-background-dark shadow-lg shadow-primary/20' : 'bg-surface-dark text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 邀约列表 */}
        <div className="space-y-4 px-4">
          {filteredRequests.map((r) => (
            <div 
              key={r.id} 
              onClick={() => setSelectedTeam(r)}
              className={`relative group rounded-[24px] bg-card-dark p-1 border transition-all shadow-xl ${r.isNew ? 'border-primary shadow-primary/10' : 'border-white/5 hover:border-primary/30'}`}
            >
              {r.isNew && <div className="absolute -top-2 -right-2 bg-primary text-background-dark text-[8px] font-black px-2 py-1 rounded-full animate-bounce">NEW</div>}
              <div className="flex gap-4 p-3">
                <div className="relative w-24 h-32 shrink-0 rounded-2xl overflow-hidden shadow-inner">
                  <img src={r.image} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <span className="text-[10px] text-white/80 font-bold uppercase tracking-tighter">场馆实拍</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <img src={r.creator.avatar} className="size-5 rounded-full ring-1 ring-primary/30" alt="" />
                        <span className="text-[10px] text-gray-500 font-bold">{r.creator.name}</span>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${r.missingCount === 1 ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-primary/20 text-primary'}`}>
                        {joinedIds.includes(r.id) ? '已申请' : `缺 ${r.missingCount} 人`}
                      </span>
                    </div>
                    <h3 className="text-white text-base font-black leading-snug group-hover:text-primary transition-colors line-clamp-1">{r.venueName}</h3>
                    <div className="flex items-center gap-1.5 text-gray-400 mt-1">
                      <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                      <p className="text-[11px] font-medium">{r.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex -space-x-1.5">
                      {r.joinedPlayers.map((p, i) => (
                        <div key={i} className="size-6 rounded-full border-2 border-card-dark overflow-hidden bg-gray-800">
                          <img src={p} alt="" className="size-full object-cover" />
                        </div>
                      ))}
                      <div className="size-6 rounded-full border-2 border-card-dark bg-surface-dark flex items-center justify-center text-[8px] font-black text-gray-500">
                        ?
                      </div>
                    </div>
                    <button 
                      onClick={(e) => handleJoin(e, r.id)}
                      disabled={joinedIds.includes(r.id)}
                      className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-lg ${
                        joinedIds.includes(r.id) ? 'bg-gray-700 text-gray-500' : 'bg-primary text-background-dark shadow-primary/20 active:scale-90'
                      }`}
                    >
                      {joinedIds.includes(r.id) ? '等待中' : '申请加入'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 创建邀约弹窗 */}
      {isCreating && (
        <div className="fixed inset-0 z-[100] bg-background-dark animate-in slide-in-from-bottom duration-500 flex flex-col">
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            <h2 className="text-2xl font-black">发起约球邀约</h2>
            <button onClick={() => setIsCreating(false)} className="size-10 rounded-full bg-surface-dark flex items-center justify-center">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">第一步：选择球馆</label>
                <span className="text-[10px] text-primary font-bold">已预订场馆优先</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {['王牌穿梭俱乐部', '精英之翼中心', '望京动感体育'].map(v => (
                  <button 
                    key={v} 
                    onClick={() => setFormVenue(v)}
                    className={`w-full h-14 rounded-2xl px-4 flex items-center justify-between group transition-all border ${
                      formVenue === v ? 'bg-primary/20 border-primary' : 'bg-surface-dark border-transparent'
                    }`}
                  >
                    <span className={`text-sm font-bold ${formVenue === v ? 'text-primary' : 'text-white'}`}>{v}</span>
                    <span className={`material-symbols-outlined ${formVenue === v ? 'text-primary' : 'text-gray-700'}`}>
                      {formVenue === v ? 'check_circle' : 'circle'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest">第二步：设定时间</label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                   <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">calendar_month</span>
                   <input 
                    type="date" 
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-surface-dark border-none rounded-2xl h-14 pl-10 pr-4 text-xs font-bold text-white focus:ring-primary" 
                   />
                </div>
                <div className="flex-1 relative">
                   <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">schedule</span>
                   <input 
                    type="time" 
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full bg-surface-dark border-none rounded-2xl h-14 pl-10 pr-4 text-xs font-bold text-white focus:ring-primary" 
                   />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest">第三步：水平门槛</label>
              <div className="flex gap-2 flex-wrap">
                {['新手入门', '日常进阶', '中级强推', '高级精英', '专业水准'].map(lv => (
                  <button 
                    key={lv} 
                    onClick={() => setFormLevel(lv)}
                    className={`px-4 py-2.5 rounded-xl text-[10px] font-bold border transition-all ${
                      formLevel === lv ? 'bg-primary border-primary text-background-dark' : 'bg-surface-dark border-white/5 text-gray-400'
                    }`}
                  >
                    {lv}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest">第四步：所需人数</label>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <button 
                    key={n} 
                    onClick={() => setFormMissing(n)}
                    className={`flex-1 h-12 rounded-xl flex items-center justify-center font-black text-sm transition-all border ${
                      formMissing === n ? 'bg-primary border-primary text-background-dark' : 'bg-surface-dark border-white/5 text-gray-400'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-white/5 bg-background-dark">
            <button 
              onClick={handlePublish}
              disabled={isPublishing}
              className={`w-full h-16 rounded-[24px] font-black text-lg shadow-2xl transition-all flex items-center justify-center gap-2 ${
                isPublishing ? 'bg-gray-800 text-gray-500' : 'bg-primary text-background-dark shadow-primary/30 active:scale-95'
              }`}
            >
              {isPublishing ? (
                <>
                  <div className="size-5 border-2 border-background-dark border-t-transparent rounded-full animate-spin"></div>
                  发布中...
                </>
              ) : (
                <>
                  确认发布邀约
                  <span className="material-symbols-outlined font-black">send</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 邀约详情抽屉 */}
      {selectedTeam && (
        <>
          <div onClick={() => setSelectedTeam(null)} className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm animate-in fade-in"></div>
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-[120] bg-card-dark rounded-t-[32px] overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="h-48 relative">
              <img src={selectedTeam.image} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-card-dark to-transparent"></div>
              <button onClick={() => setSelectedTeam(null)} className="absolute top-4 right-4 size-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <img src={selectedTeam.creator.avatar} className="size-14 rounded-2xl border-2 border-primary shadow-lg" alt="" />
                <div>
                  <h3 className="text-lg font-black">{selectedTeam.creator.name}</h3>
                  <div className="flex items-center gap-1.5 text-primary text-[10px] font-bold">
                    <span className="material-symbols-outlined text-xs">workspace_premium</span>
                    {selectedTeam.creator.level}
                  </div>
                </div>
              </div>
              
              <h4 className="text-xl font-black mb-1">{selectedTeam.venueName}</h4>
              <p className="text-gray-500 text-xs mb-6">{selectedTeam.location}</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-surface-dark p-4 rounded-2xl">
                  <p className="text-[10px] text-gray-500 font-black uppercase mb-1">球局时间</p>
                  <p className="text-xs font-bold">{selectedTeam.time}</p>
                </div>
                <div className="bg-surface-dark p-4 rounded-2xl">
                  <p className="text-[10px] text-gray-500 font-black uppercase mb-1">水平要求</p>
                  <p className="text-xs font-bold text-primary">{selectedTeam.level}</p>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-[10px] text-gray-500 font-black uppercase mb-3">当前成员 ({selectedTeam.joinedPlayers.length}/{selectedTeam.joinedPlayers.length + selectedTeam.missingCount})</p>
                <div className="flex gap-2">
                  {selectedTeam.joinedPlayers.map((p, i) => (
                    <img key={i} src={p} className="size-10 rounded-xl object-cover ring-2 ring-white/5" alt="" />
                  ))}
                  {Array.from({length: selectedTeam.missingCount}).map((_, i) => (
                    <div key={i} className="size-10 rounded-xl bg-surface-dark border-2 border-dashed border-gray-700 flex items-center justify-center text-gray-600">
                      <span className="material-symbols-outlined text-sm">person_add</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={(e) => { handleJoin(e, selectedTeam.id); setSelectedTeam(null); }}
                disabled={joinedIds.includes(selectedTeam.id)}
                className={`w-full h-16 rounded-2xl font-black text-lg transition-all shadow-xl ${
                  joinedIds.includes(selectedTeam.id) ? 'bg-gray-700 text-gray-500' : 'bg-primary text-background-dark shadow-primary/20 active:scale-95'
                }`}
              >
                {joinedIds.includes(selectedTeam.id) ? '已发送申请' : '确认加入此局'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* 悬浮按钮 - 快捷发起 */}
      <div className="fixed bottom-24 right-6 z-40">
        <button 
          onClick={() => setIsCreating(true)}
          className="flex size-14 items-center justify-center rounded-2xl bg-primary text-background-dark shadow-2xl shadow-primary/40 active:scale-110 transition-transform"
        >
          <span className="material-symbols-outlined text-[32px] font-black">add</span>
        </button>
      </div>
    </div>
  );
};

export default TeamInviteView;
