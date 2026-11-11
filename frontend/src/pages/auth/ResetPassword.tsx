import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CircleCheckIcon, KeyRoundIcon, LockIcon } from 'lucide-react';
import { toast } from 'sonner';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { FormAlert } from '../../components/auth/FormAlert';
import { PasswordStrength } from '../../components/auth/PasswordStrength';
import { TextField } from '../../components/ui/TextField';
import { Button } from '../../components/ui/Button';
import { buttonClasses } from '../../components/ui/buttonStyles';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../services/errors';

interface ResetErrors {
  password?: string;
  confirm?: string;
}

export function ResetPassword() {
  const email = (useLocation().state as {email?: string;} | null)?.email;
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<ResetErrors>({});
  const [formError, setFormError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!email) {
    return (
      <AuthLayout
        title="Phiên đặt lại đã hết hạn"
        subtitle="Vui lòng yêu cầu mã mới để đặt lại mật khẩu."
        back={{ to: '/login', label: 'Đăng nhập' }}>
        
        <Link to="/forgot-password" className={buttonClasses('primary', 'lg', 'w-full')}>
          Yêu cầu mã mới
        </Link>
      </AuthLayout>);

  }

  if (done) {
    return (
      <AuthLayout title="Đã đặt lại mật khẩu" subtitle="Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ.">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <CircleCheckIcon className="h-8 w-8" aria-hidden="true" />
        </div>
        <Link to="/login" className={buttonClasses('primary', 'lg', 'mt-8 w-full')}>
          Đăng nhập
        </Link>
      </AuthLayout>);

  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: ResetErrors = {};
    if (password.length < 8) next.password = 'Mật khẩu cần ít nhất 8 ký tự';
    if (confirm !== password) next.confirm = 'Mật khẩu nhập lại không khớp';
    setErrors(next);
    setFormError(undefined);
    if (Object.keys(next).length > 0) return;
    setLoading(true);
    try {
      await authService.resetPassword(email, password);
      toast.success('Đã đặt lại mật khẩu');
      setDone(true);
    } catch (err) {
      const message = getErrorMessage(err);
      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Đặt mật khẩu mới"
      subtitle={`Tạo mật khẩu mới cho tài khoản ${email}.`}
      back={{ to: '/login', label: 'Đăng nhập' }}>
      
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <FormAlert message={formError} />
        <div>
          <TextField
            label="Mật khẩu mới"
            type="password"
            icon={LockIcon}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password} />
          
          {password && !errors.password && <PasswordStrength password={password} />}
        </div>
        <TextField
          label="Nhập lại mật khẩu mới"
          type="password"
          icon={KeyRoundIcon}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm} />
        
        <Button type="submit" size="lg" fullWidth loading={loading}>
          {loading ? 'Đang lưu…' : 'Cập nhật mật khẩu'}
        </Button>
      </form>
    </AuthLayout>);

}