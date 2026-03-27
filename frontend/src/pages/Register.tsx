import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import api from '../lib/api';
import { useToastStore } from '../store/toastStore';

const Register = () => {
  const showToast = useToastStore((state) => state.showToast);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('请输入用户名');
      return false;
    }

    if (formData.username.length < 3) {
      setError('用户名至少需要3个字符');
      return false;
    }

    if (!formData.email.trim()) {
      setError('请输入邮箱');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('请输入有效的邮箱地址');
      return false;
    }

    if (!formData.password) {
      setError('请输入密码');
      return false;
    }

    if (formData.password.length < 6) {
      setError('密码至少需要6个字符');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // 注册成功，跳转到登录页
      showToast('注册成功，请登录你的账号', 'success');
      navigate('/login');
    } catch (err: any) {
      console.error('注册失败:', err);
      setError(err.response?.data?.message || '注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-72 h-72 bg-sunset-peach/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-sunset-amber/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sunset-lavender/5 rounded-full blur-3xl animate-float" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo 和标题 */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-display font-bold text-gradient-sunset mb-2">拾光日记</h1>
          <p className="text-neutral-secondary font-display italic">开始记录你的生活</p>
        </div>

        {/* 注册表单 */}
        <div className="diary-paper-card p-6 sm:p-8 animate-slide-up">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-sunset-peach/20 to-sunset-coral/20 rounded-xl flex items-center justify-center shadow-paper">
              <UserPlus size={32} strokeWidth={2} className="text-sunset-peach" />
            </div>
          </div>

          <h2 className="text-2xl font-display font-semibold text-center text-neutral-ink mb-6">
            注册账号
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
                  <User size={20} strokeWidth={2} className="text-primary-500" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="请输入用户名（至少3个字符）"
                  className="input-paper w-full pl-12 pr-4"
                  required
                />
              </div>
            </div>

            {/* 邮箱 */}
            <div>
              <label
                htmlFor="email"
                className="label-paper"
              >
                邮箱
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={20} strokeWidth={2} className="text-primary-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="请输入邮箱地址"
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
                  placeholder="请输入密码（至少6个字符）"
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

            {/* 确认密码 */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="label-paper"
              >
                确认密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={20} strokeWidth={2} className="text-primary-500" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="请再次输入密码"
                  className="input-paper w-full pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-secondary hover:text-primary-500 transition-colors duration-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} strokeWidth={2} />
                  ) : (
                    <Eye size={20} strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>

            {/* 注册按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="btn-paper-primary w-full py-3.5 mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>注册中...</span>
                </>
              ) : (
                <>
                  <UserPlus size={20} strokeWidth={2} />
                  <span>注册</span>
                </>
              )}
            </button>
          </form>

          {/* 登录链接 */}
          <div className="mt-6 text-center">
            <p className="text-neutral-secondary text-sm">
              已有账号？{' '}
              <Link
                to="/login"
                className="text-primary-500 hover:text-gradient-sunset font-medium transition-all duration-300 hover:underline"
              >
                立即登录
              </Link>
            </p>
          </div>
        </div>

        {/* 底部提示 */}
        <p className="text-center text-neutral-secondary text-xs mt-6 font-display italic">
          注册即表示您同意我们的服务条款和隐私政策
        </p>
      </div>
    </div>
  );
};

export default Register;

