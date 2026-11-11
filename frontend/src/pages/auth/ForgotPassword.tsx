import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MailCheckIcon, MailIcon } from 'lucide-react';
import { toast } from 'sonner';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { FormAlert } from '../../components/auth/FormAlert';
import { TextField } from '../../components/ui/TextField';
import { Button } from '../../components/ui/Button';
import { buttonClasses } from '../../components/ui/buttonStyles';
import { authService } from '../../services/authService';
import { getErrorCode, getErrorMessage } from '../../services/errors';
import { isValidEmail } from '../../utils/validation';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(undefined);
    if (!isValidEmail(email)) {
      setError('Vui lòng nhập email đã đăng ký');
      return;
    }
    setError(undefined);
    setLoading(true);
    try {
      await authService.requestPasswordReset(email);
      setSent(true);
      toast.success('Đã gửi mã đặt lại mật khẩu');
    } catch (err) {
      const message = getErrorMessage(err);
      if (getErrorCode(err) === 'not_found') setError(message);else
      {
        setFormError(message);
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout
        title="Kiểm tra hộp thư của bạn"
        subtitle={`Chúng tôi đã gửi mã đặt lại mật khẩu gồm 6 chữ số đến ${email}. Mã có hiệu lực trong 10 phút.`}
        back={{ to: '/login', label: 'Đăng nhập' }}>
        
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <MailCheckIcon className="h-8 w-8" aria-hidden="true" />
        </div>
        <div className="mt-8 space-y-3">
          <Link to="/verify" state={{ email, mode: 'reset' }} className={buttonClasses('primary', 'lg', 'w-full')}>
            Nhập mã xác thực
          </Link>
          <Button variant="ghost" size="lg" fullWidth onClick={() => setSent(false)}>
            Dùng email khác
          </Button>
        </div>
      </AuthLayout>);

  }

  return (
    <AuthLayout
      title="Quên mật khẩu?"
      subtitle="Nhập email bạn đã dùng để đăng ký. Chúng tôi sẽ gửi mã để đặt lại mật khẩu."
      back={{ to: '/login', label: 'Đăng nhập' }}
      footer={
      <>
          Nhớ ra mật khẩu?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Quay lại đăng nhập
          </Link>
        </>
      }>
      
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <FormAlert message={formError} />
        <TextField
          label="Email"
          type="email"
          icon={MailIcon}
          autoComplete="email"
          placeholder="ban@vidu.vn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error} />
        
        <Button type="submit" size="lg" fullWidth loading={loading}>
          {loading ? 'Đang gửi…' : 'Gửi mã đặt lại'}
        </Button>
      </form>
    </AuthLayout>);

}