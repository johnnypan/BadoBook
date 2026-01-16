
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Venue } from '../types';

const AllVenuesView: React.FC = () => {
  const navigate = useNavigate();

  // 模拟数据 (在实际应用中，这通常来自 API 或共享状态管理)
  const venues: Venue[] = [
    {
      id: '1',
      name: '王牌穿梭俱乐部',
      rating: 4.8,
      distance: '0.5公里',
      price: 80,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR9PSBNzWWD-kYk51sPAguziofzxSIGSzEYa7fuBCyNS7sbkyiyrM60F78fBL6sYfV6G4yZ7bt36q4AMoK0JkkT1iko_ItLDLG0wgJgVF21bx63_fMNaaktoEtu-ieftKIAvftpZ2qhfEkkH6Nx6LnKU08jieRyZEmHssEV2ObfVNctljpFpkNVJpxy8kyvwLkdCHE2f6KxSoiDTqxLs2UaxkwG1vxghMxNvRLwC3t-1scOSLxqP5L8QfuWWSpoKuuztOLizxUVODs',
      tags: ['室内馆', '朝阳区', '双井'],
      status: 'available',
      official: true,
    },
    {
      id: '2',
      name: '精英之翼中心',
      rating: 4.7,
      distance: '1.2公里',
      price: 100,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxUFFUN-oLteKqt64Tr12NDzZwUhHd_s_APMu7e8dnDEa1Z-_0eocR2vp6Pw7dICHHb9BmyXVWSGycx_PVgnQc6zarcOGYbw3ykr1XVwLWl5dsDTqiT0piYla3KGjDApchS6EEgorVgEYJ6-GG_TsSPTAjeqY_1R_QUGcgpKsQufqXK8XZ-8D7OqD43XjkEGCuy0peaGzUtQ_O-Do7WIx63xMhbNhlLWZX_VaAWw6bmjhoe_JI5_OqVJLNHu0UqSWxNYw5Zh1rO_sn',
      tags: ['实木地板', '海淀区', '五道口'],
      status: 'busy',
      official: true,
    },
    {
      id: '3',
      name: '望京动感体育',
      rating: 4.5,
      distance: '0.4公里',
      price: 60,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp-16CQXT5coBFgCgo0ZLwUAD9wyXLzqPWYgik1FeKG_xKbjR6cm3ub76ecks98lwoeTJwoSpohqcJvd__GMKJdHqz-ZYTOYwKrlTwOOoBwMtl16dKEgkFujh8JLgoXOd9MnMpTn_1r6d8JdryDZeGA5bUPsf66QVXOZxGSesPEchjM56EIUHBSbTd64Hh2Xoid2AZ0ju5QRC6WZuG2-OD9vXLzpA69HDamDhV2fJ6ErgxufkSSJy9vxpxwAfUm4fERg3RaHpLvQIu',
      tags: ['室内馆', '朝阳区', '望京'],
      status: 'available',
    }
  ];

  return (
    <div className="animate-in slide-in-from-right duration-300 min-h-screen bg-background-dark pb-10">
      <header className="sticky top-0 z-40 bg-background-dark/80 backdrop-blur-md px-4 py-4 flex items-center border-b border-white/5">
        <button 
          onClick={() => navigate(-1)} 
          className="size-10 rounded-full bg-surface-dark flex items-center justify-center text-white mr-4 active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">全部场地</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">共 {venues.length} 个场馆</p>
        </div>
      </header>

      <main className="px-4 py-6">
        <div className="grid grid-cols-1 gap-6">
          {venues.map((v) => (
            <div 
              key={v.id} 
              onClick={() => navigate(`/venue/${v.id}`)}
              className="bg-card-dark rounded-3xl overflow-hidden border border-white/5 active:scale-[0.98] transition-all shadow-xl group"
            >
              <div className="relative h-48">
                <img src={v.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={v.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-card-dark via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-full backdrop-blur-md ${v.status === 'available' ? 'bg-success-green/80 text-white' : 'bg-primary/80 text-white'}`}>
                    {v.status === 'available' ? '营业中' : '较忙碌'}
                  </span>
                  {v.official && <span className="bg-primary text-white text-[10px] font-black px-2 py-1 rounded-full">官方认证</span>}
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div>
                    <h3 className="text-xl font-black text-white mb-1">{v.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-primary text-xs font-bold">
                        <span className="material-symbols-outlined text-sm mr-1 fill-1">star</span>
                        {v.rating}
                      </div>
                      <span className="text-gray-400 text-xs font-medium">• {v.distance}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">起订价</p>
                    <p className="text-primary text-xl font-black">¥{v.price}<span className="text-[10px] text-gray-500 ml-0.5">/h</span></p>
                  </div>
                </div>
              </div>
              <div className="px-4 py-4 flex gap-2 overflow-x-auto no-scrollbar">
                {v.tags.map(tag => (
                  <span key={tag} className="shrink-0 bg-surface-dark/50 border border-white/5 px-3 py-1.5 rounded-xl text-[10px] text-gray-300 font-bold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AllVenuesView;
