import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, Camera, Save } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import api from '../lib/api';

const Profile = () => {
  const showToast = useToastStore((state) => state.showToast);
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuthStore();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // 修改密码表单
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('请选择图片文件作为头像', 'error');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('头像大小不能超过 5MB', 'error');
      e.target.value = '';
      return;
    }

    if (avatarPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      updateUser(response.data.user);
      showToast('头像更新成功', 'success');
    } catch (err: any) {
      console.error('上传头像失败:', err);
      showToast(err.response?.data?.message || '头像上传失败', 'error');
      setAvatarPreview(null);
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  // 处理密码修改
  const handlePasswordChange = async (e: { preventDefault: () => void }) => {
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
      showToast('密码修改成功，即将跳转登录', 'success', 2800);
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

  const avatarUrl = user.avatar
    ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}/uploads/${user.avatar}`
    : null;

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* 头部导航 */}
      <header className="glass-paper sticky top-0 z-10 border-b border-neutral-border/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="btn-back-compact lg:btn-back lg:w-auto lg:h-auto lg:px-4 lg:py-2.5 lg:whitespace-nowrap"
              aria-label="返回"
            >
              <ArrowLeft size={20} strokeWidth={2.25} />
              <span className="hidden lg:inline">返回</span>
            </button>
            <h1 className="text-lg lg:text-2xl font-display font-semibold text-neutral-ink truncate">个人中心</h1>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6 animate-fade-in">
          {/* 个人信息卡片 */}
          <div className="card-paper p-6">
            <h2 className="text-xl font-display font-semibold text-neutral-ink mb-6">个人信息</h2>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
              {/* 头像 */}
              <div className="relative group">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="relative block w-24 h-24 rounded-lg overflow-hidden shadow-paper focus:outline-none"
                  aria-label="选择头像图片"
                >
                  {avatarPreview || avatarUrl ? (
                    <img
                      src={avatarPreview || avatarUrl || ''}
                      alt="头像"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-sunset flex items-center justify-center">
                      <span className="text-white text-3xl font-display font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                    {uploadingAvatar ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera size={24} strokeWidth={2} className="text-white" />
                    )}
                  </div>
                </button>
              </div>

              {/* 用户信息 */}
              <div className="flex-1 w-full">
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

