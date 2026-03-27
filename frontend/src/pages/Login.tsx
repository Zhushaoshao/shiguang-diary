import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DoorOpen, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.username.trim()) {
      setError('请输入用户名');
      return;
    }

    if (!formData.password) {
      setError('请输入密码');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      const { token, user } = response.data;

      // 保存认证信息
      setAuth(token, user);

      // 跳转到首页
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error('登录失败:', err);
      setError(err.response?.data?.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-sunset-amber/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-sunset-lavender/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="max-w-md w-full animate-fade-in relative z-10">
        {/* Logo 和标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-sunset rounded-2xl shadow-paper-lg mb-4 animate-scale-in hover:rotate-6 transition-transform duration-500 cursor-pointer">
            <span className="text-white text-3xl font-display font-bold">拾</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-gradient-sunset mb-2">拾光日记</h1>
          <p className="text-neutral-secondary font-display italic">记录生活的每一刻</p>
        </div>

        {/* 登录表单 */}
        <div className="diary-paper-card p-6 sm:p-8 animate-slide-up">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center shadow-paper">
              <DoorOpen size={32} strokeWidth={2} className="text-primary-500" />
            </div>
          </div>

          <h2 className="text-2xl font-display font-semibold text-center text-neutral-ink mb-6">
            登录账号
          </h2>

          {/* 错误提示 */}
          {error && (
            <div className="card-paper bg-error/10 border-2 border-error/30 text-error px-4 py-3 mb-6 animate-slide-up">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 用户名 */}
            <div>
              <label
                htmlFor="username"
                className="label-paper"
              >
                用户名
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={20} strokeWidth={2} className="text-primary-500" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="请输入用户名"
                  className="input-paper w-full pl-12 pr-4"
                  required
                />
              </div>
            </div>

            {/* 密码 */}
            <div>
              <label
                htmlFor="password"
                className="label-paper"
              >
                密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={20} strokeWidth={2} className="text-primary-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="请输入密码"
                  className="input-paper w-full pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-secondary hover:text-primary-500 transition-colors duration-300"
                >
                  {showPassword ? (
                    <EyeOff size={20} strokeWidth={2} />
                  ) : (
                    <Eye size={20} strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="btn-paper-primary w-full py-3.5 mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>登录中...</span>
                </>
              ) : (
                <>
                  <DoorOpen size={20} strokeWidth={2} />
                  <span>登录</span>
                </>
              )}
            </button>
          </form>

          {/* 注册链接 */}
          <div className="mt-6 text-center">
            <p className="text-neutral-secondary text-sm">
              还没有账号？{' '}
              <Link
                to="/register"
                className="text-primary-500 hover:text-gradient-sunset font-medium transition-all duration-300 hover:underline"
              >
                立即注册
              </Link>
            </p>
          </div>
        </div>

        {/* 底部提示 */}
        <p className="text-center text-neutral-secondary text-xs mt-6 font-display italic">
          登录即表示您同意我们的服务条款和隐私政策
        </p>
      </div>
    </div>
  );
};

export default Login;

