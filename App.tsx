
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import HomeView from './views/HomeView';
import ScheduleView from './views/ScheduleView';
import TeamInviteView from './views/TeamInviteView';
import ProfileView from './views/ProfileView';
import VenueDetailView from './views/VenueDetailView';
import AllVenuesView from './views/AllVenuesView';
import AuthView from './views/AuthView';
import NotificationView from './views/NotificationView';

const BottomNav: React.FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: 'home', label: '首页', path: '/', protected: false },
    { icon: 'calendar_month', label: '行程', path: '/schedule', protected: true },
    { icon: 'groups', label: '约球', path: '/teams', protected: true },
    { icon: 'person', label: '我的', path: '/profile', protected: true }
  ];

  const hiddenPaths = ['/venue/', '/all-venues', '/auth', '/notifications'];
  if (hiddenPaths.some(p => location.pathname.startsWith(p))) return null;

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.protected && !isAuthenticated) {
      navigate('/auth', { state: { from: item.path } });
    } else {
      navigate(item.path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background-dark/90 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex justify-between items-center z-50 max-w-md mx-auto">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => handleNavClick(item)}
            className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-gray-500'}`}
          >
            <span className={`material-symbols-outlined text-[28px] ${isActive ? 'fill-1' : ''}`}>{item.icon}</span>
            <span className="text-[10px] font-bold tracking-tighter">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const storedAuth = localStorage.getItem('isLoggedIn');
    if (storedAuth === null) {
      localStorage.setItem('isLoggedIn', 'true');
      return true;
    }
    return storedAuth === 'true';
  });

  const [username, setUsername] = useState<string>(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser === null) {
      localStorage.setItem('username', 'Johnny');
      return 'Johnny';
    }
    return storedUser;
  });

  const handleLogin = (name: string) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', name);
    setIsAuthenticated(true);
    setUsername(name);
  };

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="min-h-screen max-w-md mx-auto relative pb-24 shadow-2xl bg-background-dark text-white font-display">
        <Routes>
          <Route path="/" element={<HomeView isAuthenticated={isAuthenticated} />} />
          <Route path="/venue/:id" element={<VenueDetailView isAuthenticated={isAuthenticated} />} />
          <Route path="/all-venues" element={<AllVenuesView />} />
          <Route path="/auth" element={!isAuthenticated ? <AuthView onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/notifications" element={isAuthenticated ? <NotificationView /> : <Navigate to="/auth" />} />
          
          <Route path="/schedule" element={isAuthenticated ? <ScheduleView /> : <Navigate to="/auth" />} />
          <Route path="/teams" element={isAuthenticated ? <TeamInviteView /> : <Navigate to="/auth" />} />
          <Route path="/profile" element={isAuthenticated ? <ProfileView onLogout={handleLogout} username={username} /> : <Navigate to="/auth" />} />
        </Routes>
        <BottomNav isAuthenticated={isAuthenticated} />
      </div>
    </Router>
  );
};

export default App;
