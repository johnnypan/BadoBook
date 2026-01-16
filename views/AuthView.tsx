
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthViewProps {
  onLogin: (username: string) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [usernameInput, setUsernameInput] = useState('Johnny');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // 获取跳转来源，默认为首页
  const from = (location.state as any)?.from || "/";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    // 模拟网络请求
    setTimeout(() => {
      // 校验逻辑：如果是默认用户 Johnny，则密码必须为 123
      if (isLogin) {
        if (usernameInput === 'Johnny' && passwordInput !== '123') {
          setError('Johnny 账号的密码错误，请尝试 "123"');
          setIsLoading(false);
          return;
        }
      }

      onLogin(usernameInput || 'Johnny');
      setIsLoading(false);
      // 登录成功后跳转回来源页面
      navigate(from, { replace: true });
    }, 800);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex flex-col justify-center px-8 relative overflow-hidden">
      {/* 顶部返回按钮 */}
      <div className="absolute top-6 left-6 z-50">
        <button 
          onClick={handleBack}
          className="size-11 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all shadow-xl"
        >
          <span className="material-symbols-outlined text-2xl font-light">close</span>
        </button>
      </div>

      {/* 背景装饰 */}
      <div className="absolute top-[-10%] right-[-10%] size-64 bg-primary/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] size-64 bg-primary/5 rounded-full blur-[80px]"></div>

      <div className="relative z-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
        <div className="mb-12">
          <div className="size-16 rounded-3xl bg-primary flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-primary/30 mb-6">羽</div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            {isLogin ? '欢迎回来' : '开启羽球生活'}
          </h1>
          <p className="text-gray-500 font-medium">羽球先锋 - 专业的场地预订与约球平台</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">手机号 / 用户名</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">person</span>
              <input 
                required
                type="text" 
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="请输入用户名"
                className="w-full h-14 bg-surface-dark border-none rounded-2xl pl-12 text-white placeholder:text-gray-700 focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            {isLogin && <p className="text-[10px] text-gray-600 font-bold ml-1 italic">提示: 默认账户 Johnny 已就绪</p>}
          </div>

          {!isLogin && (
            <div className="space-y-1.5 animate-in fade-in duration-500">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">验证码</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="6位数字"
                  className="flex-1 h-14 bg-surface-dark border-none rounded-2xl px-4 text-white placeholder:text-gray-700 focus:ring-2 focus:ring-primary transition-all"
                />
                <button type="button" className="px-4 bg-surface-dark text-primary text-xs font-bold rounded-2xl border border-primary/20">获取验证码</button>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">密码</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">lock</span>
              <input 
                required
                type="password" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="请输入密码"
                className={`w-full h-14 bg-surface-dark border-none rounded-2xl pl-12 text-white placeholder:text-gray-700 focus:ring-2 transition-all ${error ? 'ring-2 ring-red-500 animate-shake' : 'focus:ring-primary'}`}
              />
            </div>
            {error && <p className="text-[10px] text-red-500 font-bold ml-1">{error}</p>}
          </div>

          {isLogin && (
            <div className="flex justify-end">
              <button type="button" className="text-primary text-xs font-bold">忘记密码？</button>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-primary text-background-dark font-black text-lg rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <div className="size-5 border-2 border-background-dark border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                {isLogin ? '立即登录' : '注册账户'}
                <span className="material-symbols-outlined font-bold">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            {isLogin ? '还没有账户？' : '已经有账户了？'}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="text-primary font-bold ml-2 underline underline-offset-4"
            >
              {isLogin ? '立即注册' : '去登录'}
            </button>
          </p>
        </div>

        <div className="mt-16 text-center">
          <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.3em]">第三方一键登录</p>
          <div className="flex justify-center gap-6 mt-6">
            <button className="size-12 rounded-full bg-surface-dark flex items-center justify-center active:scale-90 transition-transform">
              <img src="https://img.icons8.com/color/48/weixing.png" className="size-6 grayscale opacity-50" alt="Wechat" />
            </button>
            <button className="size-12 rounded-full bg-surface-dark flex items-center justify-center active:scale-90 transition-transform">
              <img src="https://img.icons8.com/color/48/apple-logo.png" className="size-6 grayscale opacity-50" alt="Apple" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
