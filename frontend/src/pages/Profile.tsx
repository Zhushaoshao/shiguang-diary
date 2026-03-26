import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, Camera, Save } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // 修改密码表单
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 处理密码修改
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // 验证
    if (!passwordForm.oldPassword) {
      setError('请输入当前密码');
      return;
    }

    if (!passwordForm.newPassword) {
      setError('请输入新密码');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('新密码至少6个字符');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);

    try {
      await api.put('/users/password', {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      setSuccess('密码修改成功，请重新登录');
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // 3秒后退出登录
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      console.error('修改密码失败:', err);
      setError(err.response?.data?.message || '修改密码失败');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* 头部导航 */}
      <header className="glass-paper sticky top-0 z-10 border-b border-neutral-border/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-neutral-secondary hover:text-primary-500 transition-all duration-300 font-medium"
            >
              <ArrowLeft size={20} strokeWidth={2} />
              <span>返回</span>
            </button>
            <h1 className="text-2xl font-display font-semibold text-neutral-ink">个人中心</h1>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6 animate-fade-in">
          {/* 个人信息卡片 */}
          <div className="card-paper p-6">
            <h2 className="text-xl font-display font-semibold text-neutral-ink mb-6">个人信息</h2>

            <div className="flex items-center gap-6">
              {/* 头像 */}
              <div className="relative group">
                <div className="w-24 h-24 bg-gradient-sunset rounded-xl flex items-center justify-center shadow-paper">
                  <span className="text-white text-3xl font-display font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                  <Camera size={24} strokeWidth={2} className="text-white" />
                </div>
              </div>

              {/* 用户信息 */}
              <div className="flex-1">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-neutral-secondary">用户名</label>
                    <p className="text-lg font-display font-medium text-neutral-ink">{user.username}</p>
                  </div>
                  <div>
                    <label className="text-sm text-neutral-secondary">邮箱</label>
                    <p className="text-lg font-display font-medium text-neutral-ink">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 修改密码卡片 */}
          <div className="card-paper p-6">
            <h2 className="text-xl font-display font-semibold text-neutral-ink mb-6 flex items-center gap-2">
              <Lock size={20} strokeWidth={2} className="text-primary-500" />
              修改密码
            </h2>

            {/* 成功提示 */}
            {success && (
              <div className="card-paper bg-success/10 border-2 border-success/30 text-success px-4 py-3 mb-6 animate-slide-up">
                <p className="text-sm font-medium">{success}</p>
              </div>
            )}

            {/* 错误提示 */}
            {error && (
              <div className="card-paper bg-error/10 border-2 border-error/30 text-error px-4 py-3 mb-6 animate-slide-up">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-5">
              {/* 当前密码 */}
              <div>
                <label htmlFor="oldPassword" className="label-paper">
                  当前密码
                </label>
                <input
                  id="oldPassword"
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  placeholder="请输入当前密码"
                  className="input-paper w-full"
                  required
                />
              </div>

              {/* 新密码 */}
              <div>
                <label htmlFor="newPassword" className="label-paper">
                  新密码
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="请输入新密码（至少6个字符）"
                  className="input-paper w-full"
                  required
                  minLength={6}
                />
              </div>

              {/* 确认密码 */}
              <div>
                <label htmlFor="confirmPassword" className="label-paper">
                  确认新密码
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="请再次输入新密码"
                  className="input-paper w-full"
                  required
                />
              </div>

              {/* 提交按钮 */}
              <button
                type="submit"
                disabled={loading}
                className="btn-paper-primary w-full py-3.5 mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>修改中...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} strokeWidth={2} />
                    <span>保存修改</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;

