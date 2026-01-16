
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface VenueDetailViewProps {
  isAuthenticated: boolean;
}

const VenueDetailView: React.FC<VenueDetailViewProps> = ({ isAuthenticated }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const basePrice = 80;
  const totalPrice = selectedTimes.length * basePrice;

  const dates = [
    { label: '今天', day: '14' },
    { label: '周二', day: '15' },
    { label: '周三', day: '16' },
    { label: '周四', day: '17' },
    { label: '周五', day: '18' }
  ];

  const timeSlots = ['18:00', '19:00', '20:00', '21:00', '22:00'];

  const toggleTime = (time: string) => {
    setSelectedTimes(prev => 
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: `/venue/${id}` } });
      return;
    }
    if (selectedTimes.length === 0) {
      alert('请至少选择一个时段');
      return;
    }
    setIsConfirming(true);
  };

  const confirmBooking = () => {
    setIsConfirming(false);
    setTimeout(() => {
      setIsBookingSuccess(true);
    }, 800);
  };

  const handleShare = () => {
    const text = `我已在羽球先锋预订了【极速羽球中心 - 04号场】，时间：${dates[selectedDate].label} ${selectedTimes.join(', ')}，快来和我一起打球吧！`;
    if (navigator.share) {
      navigator.share({ title: '球局邀请', text }).catch(() => {});
    } else {
      alert('邀请已复制到剪贴板！');
    }
  };

  return (
    <div className="animate-in fade-in duration-300 bg-background-dark min-h-screen pb-24">
      <div className="relative">
        <div className="aspect-[4/3] bg-center bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAB-grXfzmJBkx1tGMAxXxUVknwJLsumx8SyLGzpsLUKu-g5vfJe0TMr_u5i5OIBHQXGGJGmM7S8igsQY8KjCbqhAnGhxXLpVcSdlUKjGUoIJj_4JRkii05MFcPiyzNRIR3pGolJUZATzEau5gGbxIe00atAnrmNIhVP-g6w3xqOC_IbXLzIMQzGhJ2p45ij6ug8jGAdQcNZDO7frWiLdKlKjYOTQQ6NG6OJh-bTPtpie6VuxxietI0ik9aTBmBbNCw-dhbEkjUFxwe")' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-black/30"></div>
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="size-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <button className="size-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-extrabold">极速羽球中心 - 04号场</h1>
          <div className="bg-primary/10 text-primary text-sm font-bold px-3 py-1 rounded-lg">¥{basePrice}/小时</div>
        </div>
        <p className="text-gray-400 text-sm mb-6">市中心体育广场 · 12号街区</p>

        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
          {[{ icon: 'home', label: '室内' }, { icon: 'verified', label: '认证' }, { icon: 'layers', label: 'PVC地胶' }].map(tag => (
            <div key={tag.label} className="flex shrink-0 items-center gap-1.5 bg-surface-dark px-3 py-2 rounded-xl border border-white/5">
              <span className="material-symbols-outlined text-primary text-lg">{tag.icon}</span>
              <span className="text-white text-xs font-semibold">{tag.label}</span>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold mb-4">选择日期</h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8">
          {dates.map((d, i) => (
            <button 
              key={i} 
              onClick={() => setSelectedDate(i)}
              className={`flex flex-col items-center justify-center min-w-[70px] h-24 rounded-2xl transition-all border-2 ${
                selectedDate === i ? 'bg-primary border-primary text-background-dark' : 'bg-surface-dark border-transparent text-gray-400'
              }`}
            >
              <span className="text-xs font-medium mb-1">{d.label}</span>
              <span className="text-xl font-bold">{d.day}</span>
            </button>
          ))}
        </div>

        <h2 className="text-lg font-bold mb-4">选择时段 (可多选)</h2>
        <div className="grid grid-cols-3 gap-3">
          {timeSlots.map((time) => (
            <button 
              key={time} 
              onClick={() => toggleTime(time)}
              className={`h-12 flex items-center justify-center rounded-xl text-sm font-bold border transition-all active:scale-95 ${
                selectedTimes.includes(time) ? 'bg-primary border-primary text-background-dark' : 'bg-surface-dark border-white/5 text-white'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {!isBookingSuccess && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-background-dark/95 backdrop-blur-xl border-t border-white/5 p-4 flex items-center justify-between z-50">
          <div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-0.5">预订合计</p>
            <div className="flex items-baseline gap-1">
              <span className="text-primary text-xs font-bold">¥</span>
              <span className="text-white text-2xl font-black">{totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <button 
            onClick={handleBooking}
            className={`px-10 py-3.5 rounded-2xl font-black flex items-center gap-2 shadow-xl transition-all active:scale-95 ${
              selectedTimes.length > 0 || !isAuthenticated ? 'bg-primary text-background-dark shadow-primary/20' : 'bg-gray-800 text-gray-500 cursor-not-allowed shadow-none'
            }`}
          >
            {isAuthenticated ? '立即预约' : '登录预订'} <span className="material-symbols-outlined text-lg">bolt</span>
          </button>
        </div>
      )}

      {isConfirming && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-card-dark rounded-t-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <h2 className="text-2xl font-black mb-6">确认预约详情</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between py-3 border-b border-white/5">
                <span className="text-gray-400">场馆名称</span>
                <span className="text-white font-bold">极速羽球中心 - 04号场</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/5">
                <span className="text-gray-400">预约日期</span>
                <span className="text-white font-bold">{dates[selectedDate].label} (10月{dates[selectedDate].day}日)</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/5">
                <span className="text-gray-400">选择时段</span>
                <span className="text-primary font-bold">{selectedTimes.sort().join(', ')}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIsConfirming(false)} className="flex-1 py-4 text-gray-400 font-bold">返回修改</button>
              <button onClick={confirmBooking} className="flex-[2] bg-primary text-background-dark py-4 rounded-2xl font-black shadow-lg shadow-primary/20">确认支付 ¥{totalPrice}</button>
            </div>
          </div>
        </div>
      )}

      {isBookingSuccess && (
        <div className="fixed inset-0 z-[120] bg-background-dark flex flex-col items-center justify-center p-6 animate-in zoom-in-95 overflow-y-auto">
          {/* 成功状态图标 */}
          <div className="mb-8 flex flex-col items-center animate-bounce-slow">
            <div className="size-20 rounded-full bg-success-green flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
              <span className="material-symbols-outlined text-white text-4xl font-black">check_circle</span>
            </div>
            <h2 className="text-3xl font-black text-white">预约成功</h2>
            <p className="text-gray-400 text-sm mt-2">场馆已为您锁定，开启热血对决！</p>
          </div>

          {/* 数字票根 */}
          <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl relative mb-10">
            {/* 装饰性半圆切口 */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-3 size-6 bg-background-dark rounded-full"></div>
            <div className="absolute top-1/2 -translate-y-1/2 -right-3 size-6 bg-background-dark rounded-full"></div>
            
            <div className="p-6 pb-4 border-b-2 border-dashed border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">羽</div>
                  <span className="text-background-dark font-black tracking-tighter">羽球先锋 PASS</span>
                </div>
                <span className="text-gray-300 text-[10px] font-bold tracking-widest">ORDER #82910</span>
              </div>
              <h3 className="text-background-dark text-xl font-extrabold mb-1">极速羽球中心</h3>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">04号场地 · 室内馆</p>
            </div>

            <div className="p-6 bg-gray-50/50">
              <div className="grid grid-cols-2 gap-y-6">
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">预约日期</p>
                  <p className="text-background-dark font-black">10月{dates[selectedDate].day}日 {dates[selectedDate].label}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">预约时段</p>
                  <p className="text-primary font-black">{selectedTimes.join(', ')}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">预订人</p>
                  <p className="text-background-dark font-black">Johnny</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">支付金额</p>
                  <p className="text-background-dark font-black">¥{totalPrice.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                   {/* 模拟二维码 */}
                   <div className="size-24 bg-background-dark rounded-lg flex flex-wrap p-1 opacity-90">
                      {Array.from({length: 36}).map((_, i) => (
                        <div key={i} className={`size-3 ${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`}></div>
                      ))}
                   </div>
                </div>
                <p className="text-gray-400 text-[10px] font-bold mt-3 tracking-widest">出示二维码即可入场</p>
              </div>
            </div>
          </div>

          <div className="w-full space-y-4 max-w-sm">
            <button 
              onClick={handleShare}
              className="w-full bg-primary text-background-dark py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-xl shadow-primary/20"
            >
              <span className="material-symbols-outlined font-bold">share</span>
              分享行程给球友
            </button>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => navigate('/schedule')} className="bg-surface-dark text-white py-4 rounded-2xl font-bold text-sm">查看我的行程</button>
              <button onClick={() => navigate('/')} className="bg-surface-dark text-white py-4 rounded-2xl font-bold text-sm">返回首页</button>
            </div>
          </div>

          <p className="mt-8 text-gray-600 text-[10px] font-bold uppercase tracking-widest">温馨提示：开场前15分钟可核验入场</p>
        </div>
      )}
    </div>
  );
};

export default VenueDetailView;
