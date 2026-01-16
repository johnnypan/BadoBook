
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppNotification } from '../types';

const NotificationView: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'trade' | 'social'>('all');
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: '1',
      type: 'booking',
      title: '预约成功确认',
      content: '您已成功预约【王牌穿梭俱乐部】4号场，时间：今天 18:00-20:00。',
      time: '10分钟前',
      isRead: false
    },
    {
      id: '2',
      type: 'team',
      title: '新的组队申请',
      content: '球友“闪电扣杀”请求加入您的【奥体中心】周六球局。',
      time: '2小时前',
      isRead: false,
      avatar: 'https://picsum.photos/id/65/100/100'
    },
    {
      id: '3',
      type: 'system',
      title: '等级提升提醒',
      content: '恭喜！您的活跃度已达标，运动等级提升至“进阶球友”。',
      time: '昨天',
      isRead: true
    },
    {
      id: '4',
      type: 'booking',
      title: '预约即将开始',
      content: '温馨提示：您预约的【精英之翼】1号场将在30分钟后开始。',
      time: '昨天',
      isRead: true
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'trade') return n.type === 'booking';
    if (activeTab === 'social') return n.type === 'team';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking': return 'confirmation_number';
      case 'team': return 'groups';
      default: return 'notifications_active';
    }
  };

  return (
    <div className="min-h-screen bg-background-dark animate-in slide-in-from-bottom-5 duration-300">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-xl border-b border-white/5 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="size-10 rounded-full bg-surface-dark flex items-center justify-center">
            <span className="material-symbols-outlined text-white">arrow_back_ios_new</span>
          </button>
          <h1 className="text-xl font-black">消息中心</h1>
        </div>
        <button onClick={markAllRead} className="text-primary text-xs font-bold px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors">
          全部忽略
        </button>
      </header>

      <div className="p-4">
        <div className="flex gap-2 mb-6">
          {([
            { id: 'all', label: '全部' },
            { id: 'trade', label: '交易' },
            { id: 'social', label: '互动' }
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id ? 'bg-primary text-background-dark' : 'bg-surface-dark text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(n => (
              <div 
                key={n.id} 
                onClick={() => markAsRead(n.id)}
                className={`relative flex gap-4 p-4 rounded-2xl border transition-all ${
                  n.isRead ? 'bg-surface-dark/40 border-white/5 opacity-60' : 'bg-surface-dark border-primary/20 shadow-lg shadow-primary/5'
                }`}
              >
                {!n.isRead && (
                  <div className="absolute top-4 right-4 size-2 bg-primary rounded-full"></div>
                )}
                
                <div className={`size-12 shrink-0 rounded-xl flex items-center justify-center ${
                  n.type === 'booking' ? 'bg-orange-500/20 text-orange-500' : 
                  n.type === 'team' ? 'bg-blue-500/20 text-blue-500' : 'bg-green-500/20 text-green-500'
                }`}>
                  {n.avatar ? (
                    <img src={n.avatar} className="size-full rounded-xl object-cover" alt="" />
                  ) : (
                    <span className="material-symbols-outlined">{getIcon(n.type)}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-black text-white truncate">{n.title}</h3>
                    <span className="text-[10px] text-gray-600 font-bold whitespace-nowrap ml-2">{n.time}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{n.content}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
              <span className="material-symbols-outlined text-6xl mb-4">mail_lock</span>
              <p className="font-bold">暂无相关消息</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationView;
