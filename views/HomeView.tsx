
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Venue } from '../types';

interface HomeViewProps {
  isAuthenticated: boolean;
}

type FilterType = 'tag' | 'price' | 'sort' | null;

const HomeView: React.FC<HomeViewProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [matchedVenue, setMatchedVenue] = useState<Venue | null>(null);
  
  const [selectedTag, setSelectedTag] = useState('全部');
  const [selectedPriceRange, setSelectedPriceRange] = useState('全部价格');
  const [selectedSort, setSelectedSort] = useState('距离优先');

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedSurface, setSelectedSurface] = useState<string>('全部');

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setActiveFilter(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      amenities: ['停车场', '空调', '淋浴'],
      surfaceType: 'PVC'
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
      amenities: ['空调', '更衣室'],
      surfaceType: '实木'
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
      amenities: ['停车场'],
      surfaceType: 'PVC'
    }
  ];

  const processVenues = (inputVenues: Venue[]) => {
    let result = [...inputVenues];
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      result = result.filter(v => 
        v.name.toLowerCase().includes(query) ||
        v.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    if (selectedTag !== '全部') {
      result = result.filter(v => v.tags.includes(selectedTag));
    }
    if (selectedPriceRange !== '全部价格') {
      result = result.filter(v => {
        if (selectedPriceRange === '50元以下') return v.price < 50;
        if (selectedPriceRange === '50-80元') return v.price >= 50 && v.price <= 80;
        if (selectedPriceRange === '80元以上') return v.price > 80;
        return true;
      });
    }
    if (selectedAmenities.length > 0) {
      result = result.filter(v => 
        selectedAmenities.every(a => v.amenities?.includes(a))
      );
    }
    if (selectedSurface !== '全部') {
      result = result.filter(v => v.surfaceType === selectedSurface);
    }
    result.sort((a, b) => {
      if (selectedSort === '价格最低') return a.price - b.price;
      if (selectedSort === '评分最高') return b.rating - a.rating;
      return parseFloat(a.distance) - parseFloat(b.distance);
    });
    return result;
  };

  const allFilteredVenues = useMemo(() => processVenues(venues), [
    searchQuery, selectedTag, selectedPriceRange, selectedSort, selectedAmenities, selectedSurface
  ]);

  const isFiltered = searchQuery !== '' || selectedTag !== '全部' || selectedPriceRange !== '全部价格' || selectedSort !== '距离优先' || selectedAmenities.length > 0 || selectedSurface !== '全部';

  const handleQuickMatch = () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    setIsMatching(true);
    setTimeout(() => {
      const bestMatch = venues.reduce((prev, curr) => 
        (parseFloat(curr.distance) < parseFloat(prev.distance)) ? curr : prev
      );
      setMatchedVenue(bestMatch);
      setIsMatching(false);
    }, 2000);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTag('全部');
    setSelectedPriceRange('全部价格');
    setSelectedSort('距离优先');
    setSelectedAmenities([]);
    setSelectedSurface('全部');
    setActiveFilter(null);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  return (
    <div className="animate-in fade-in duration-500 min-h-screen">
      <header className="sticky top-0 z-40 bg-background-dark/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">羽</div>
          <h1 className="text-xl font-extrabold tracking-tight">羽球先锋</h1>
        </div>
        <div className="flex gap-2 items-center">
          <button 
            onClick={() => isAuthenticated ? navigate('/notifications') : navigate('/auth')}
            className="p-2 rounded-full bg-surface-dark relative"
          >
            <span className="material-symbols-outlined text-white">notifications</span>
            {isAuthenticated && (
              <div className="absolute top-2 right-2.5 size-2.5 bg-primary rounded-full border-2 border-surface-dark"></div>
            )}
          </button>
          {isAuthenticated ? (
            <div onClick={() => navigate('/profile')} className="size-10 rounded-full border-2 border-primary overflow-hidden cursor-pointer">
              <img className="w-full h-full object-cover" src="https://picsum.photos/id/64/100/100" alt="头像" />
            </div>
          ) : (
            <button 
              onClick={() => navigate('/auth')}
              className="px-4 py-2 bg-primary/20 text-primary text-xs font-black rounded-full border border-primary/30"
            >
              登录/注册
            </button>
          )}
        </div>
      </header>

      <section className="px-4 py-4 relative z-30" ref={filterRef}>
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">search</span>
            <input 
              className="w-full h-12 pl-10 pr-10 bg-surface-dark border-none rounded-xl focus:ring-2 focus:ring-primary text-sm text-white transition-all" 
              placeholder="输入场馆名，如“精英”" 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            )}
          </div>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className={`h-12 w-12 flex items-center justify-center rounded-xl transition-all relative ${isFiltered ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-surface-dark text-gray-400'}`}
          >
            <span className="material-symbols-outlined">tune</span>
            {isFiltered && <div className="absolute -top-1 -right-1 size-4 bg-primary text-white text-[8px] flex items-center justify-center rounded-full font-bold border-2 border-background-dark">!</div>}
          </button>
        </div>
        
        <div className="flex gap-2 relative">
          <div className="relative flex-1">
            <button 
              onClick={() => setActiveFilter(activeFilter === 'tag' ? null : 'tag')}
              className={`flex h-9 w-full items-center justify-center gap-x-1 rounded-full px-2 border transition-all ${selectedTag !== '全部' ? 'bg-primary/20 border-primary text-primary' : 'bg-surface-dark border-white/5 text-gray-300'}`}
            >
              <p className="text-[11px] font-semibold truncate">{selectedTag === '全部' ? '馆型' : selectedTag}</p>
              <span className={`material-symbols-outlined text-sm transition-transform ${activeFilter === 'tag' ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            {activeFilter === 'tag' && (
              <div className="absolute top-11 left-0 w-32 bg-card-dark/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-1 z-50 animate-in slide-in-from-top-2">
                {['全部', '室内馆', '专业实木', '朝阳区', '海淀区'].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => { setSelectedTag(opt); setActiveFilter(null); }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/5 ${selectedTag === opt ? 'text-primary font-bold' : 'text-gray-300'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative flex-1">
            <button 
              onClick={() => setActiveFilter(activeFilter === 'price' ? null : 'price')}
              className={`flex h-9 w-full items-center justify-center gap-x-1 rounded-full px-2 border transition-all ${selectedPriceRange !== '全部价格' ? 'bg-primary/20 border-primary text-primary' : 'bg-surface-dark border-white/5 text-gray-300'}`}
            >
              <p className="text-[11px] font-semibold truncate">{selectedPriceRange === '全部价格' ? '价格' : selectedPriceRange}</p>
              <span className={`material-symbols-outlined text-sm transition-transform ${activeFilter === 'price' ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            {activeFilter === 'price' && (
              <div className="absolute top-11 left-0 w-32 bg-card-dark/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-1 z-50 animate-in slide-in-from-top-2">
                {['全部价格', '50元以下', '50-80元', '80元以上'].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => { setSelectedPriceRange(opt); setActiveFilter(null); }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/5 ${selectedPriceRange === opt ? 'text-primary font-bold' : 'text-gray-300'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative flex-1">
            <button 
              onClick={() => setActiveFilter(activeFilter === 'sort' ? null : 'sort')}
              className={`flex h-9 w-full items-center justify-center gap-x-1 rounded-full px-2 border transition-all ${selectedSort !== '距离优先' ? 'bg-primary/20 border-primary text-primary' : 'bg-surface-dark border-white/5 text-gray-300'}`}
            >
              <p className="text-[11px] font-semibold truncate">{selectedSort === '距离优先' ? '距离' : selectedSort}</p>
              <span className={`material-symbols-outlined text-sm transition-transform ${activeFilter === 'sort' ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            {activeFilter === 'sort' && (
              <div className="absolute top-11 right-0 w-32 bg-card-dark/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-1 z-50 animate-in slide-in-from-top-2">
                {['距离优先', '价格最低', '评分最高'].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => { setSelectedSort(opt); setActiveFilter(null); }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/5 ${selectedSort === opt ? 'text-primary font-bold' : 'text-gray-300'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="px-4 pb-4">
        <div className="flex items-center justify-between mb-4 pt-4">
          <h2 className="text-xl font-bold tracking-tight">{isFiltered ? '搜索结果' : '为您推荐'}</h2>
          {isFiltered && (
            <button onClick={resetFilters} className="text-primary text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">refresh</span> 重置筛选
            </button>
          )}
        </div>
        
        {allFilteredVenues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-700 mb-4">search_off</span>
            <p className="text-gray-500 font-medium">没找到合适的场馆</p>
            <button onClick={resetFilters} className="mt-4 text-primary font-bold text-sm underline">清除所有过滤条件</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {allFilteredVenues.map((v) => (
              <div key={v.id} onClick={() => navigate(`/venue/${v.id}`)} className="flex gap-4 bg-card-dark p-3 rounded-2xl border border-white/5 active:scale-[0.98] transition-all group">
                <div className="size-24 rounded-xl bg-center bg-cover shrink-0 overflow-hidden relative">
                  <img src={v.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={v.name} />
                  {v.official && <div className="absolute top-1 left-1 bg-primary text-white text-[8px] font-bold px-1 rounded">官方</div>}
                </div>
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm truncate pr-2">{v.name}</h4>
                      <span className="text-primary font-bold text-xs shrink-0">¥{v.price}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">{v.distance} • {v.tags[0]} {v.tags[1] ? `• ${v.tags[1]}` : ''}</p>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center text-xs text-orange-400 font-bold">
                       <span className="material-symbols-outlined text-sm mr-1 fill-1">star</span>{v.rating}
                     </div>
                    <button className="text-[10px] font-bold text-primary border border-primary px-4 py-1 rounded-full group-hover:bg-primary group-hover:text-background-dark transition-colors">预约</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {!isFiltered && (
        <section className="py-6 border-t border-white/5 pb-24">
          <div 
            className="px-4 mb-4 flex items-center justify-between group cursor-pointer active:opacity-70 transition-opacity"
            onClick={() => navigate('/all-venues')}
          >
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-1 group-hover:text-primary transition-colors">
              全部场地
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </h2>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-4 snap-x">
            {venues.map((v) => (
              <div 
                key={v.id} 
                onClick={() => navigate(`/venue/${v.id}`)}
                className="relative min-w-[200px] h-64 rounded-[24px] overflow-hidden snap-start active:scale-95 transition-transform shadow-lg"
              >
                <img src={v.image} className="absolute inset-0 w-full h-full object-cover" alt={v.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-md ${v.status === 'available' ? 'bg-success-green/80 text-white' : 'bg-primary/80 text-white'}`}>
                    {v.status === 'available' ? '营业中' : '较忙碌'}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-base truncate">{v.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-primary text-xs font-bold">¥{v.price}/h</span>
                    <div className="flex items-center text-white/70 text-[10px]">
                      <span className="material-symbols-outlined text-xs mr-0.5">location_on</span>
                      {v.distance}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {isDrawerOpen && (
        <>
          <div onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-in fade-in"></div>
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card-dark rounded-t-[32px] z-[110] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black">高级筛选</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="size-10 rounded-full bg-white/5 flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar pb-8">
              <div>
                <p className="text-white text-sm font-bold mb-4">场地类型</p>
                <div className="flex gap-3">
                  {['全部', 'PVC', '实木'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => setSelectedSurface(s)}
                      className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all border ${selectedSurface === s ? 'bg-primary border-primary text-background-dark' : 'bg-surface-dark border-white/5 text-gray-400'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-white text-sm font-bold mb-4">配套设施 (多选)</p>
                <div className="grid grid-cols-2 gap-3">
                  {['停车场', '空调', '淋浴', '更衣室', '器材租借'].map(a => (
                    <button 
                      key={a} 
                      onClick={() => toggleAmenity(a)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all border ${selectedAmenities.includes(a) ? 'bg-primary/20 border-primary text-primary' : 'bg-surface-dark border-white/5 text-gray-400'}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{a === '空调' ? 'ac_unit' : a === '停车场' ? 'local_parking' : 'verified'}</span>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-8 pt-4 border-t border-white/5">
              <button onClick={resetFilters} className="flex-1 py-4 text-gray-400 font-bold text-sm">重置</button>
              <button onClick={() => setIsDrawerOpen(false)} className="flex-[2] bg-primary text-background-dark py-4 rounded-2xl font-black shadow-xl shadow-primary/20">
                查看 {allFilteredVenues.length} 个场馆
              </button>
            </div>
          </div>
        </>
      )}

      {isMatching && (
        <div className="fixed inset-0 z-[200] bg-background-dark/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center">
          <div className="relative size-48 mb-8">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-primary animate-pulse">bolt</span>
            </div>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">正在智能匹配...</h2>
          <p className="text-gray-400 text-sm">为您寻找距离最近、评价最高的空闲球场</p>
        </div>
      )}

      {matchedVenue && (
        <div className="fixed inset-0 z-[210] bg-black/70 backdrop-blur-sm flex items-end justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-card-dark rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="bg-primary/20 px-3 py-1 rounded-full text-primary text-[10px] font-bold tracking-widest uppercase">智能推荐</div>
              <button onClick={() => setMatchedVenue(null)} className="size-10 rounded-full bg-white/5 flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex gap-4 mb-8">
              <img src={matchedVenue.image} className="size-20 rounded-xl object-cover" alt="" />
              <div>
                <h3 className="text-xl font-bold text-white">{matchedVenue.name}</h3>
                <p className="text-gray-400 text-sm mb-1">{matchedVenue.distance} • {matchedVenue.tags[0]}</p>
                <div className="flex items-center text-primary font-bold">
                  <span className="material-symbols-outlined text-sm mr-1 fill-1">star</span>{matchedVenue.rating}
                </div>
              </div>
            </div>
            <button 
              onClick={() => { setMatchedVenue(null); navigate(`/venue/${matchedVenue.id}`); }}
              className="w-full bg-primary text-background-dark h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 active:scale-95 transition-transform"
            >
              立刻去预订
            </button>
          </div>
        </div>
      )}

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
        <button 
          onClick={handleQuickMatch}
          className="bg-primary shadow-2xl shadow-primary/40 text-background-dark px-10 py-4 rounded-full font-black flex items-center gap-2 whitespace-nowrap active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined font-bold">bolt</span>
          极速订场
        </button>
      </div>
    </div>
  );
};

export default HomeView;
