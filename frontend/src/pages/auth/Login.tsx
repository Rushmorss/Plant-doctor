import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LockIcon, MailIcon } from 'lucide-react';
import { toast } from 'sonner';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { FormAlert } from '../../components/auth/FormAlert';
import { TextField } from '../../components/ui/TextField';
import { Button } from '../../components/ui/Button';
import { DemoNotice } from '../../components/ui/DemoNotice';
import { useAuth } from '../../contexts/AuthContext';
import { DEMO_CREDENTIALS } from '../../services/authService';
import { getErrorMessage } from '../../services/errors';
import { isMockMode } from '../../services/config';
import { isValidEmail } from '../../utils/validation';

interface LoginErrors {
  email?: string;
  password?: string;
}

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = (location.state as {from?: string;} | null)?.from ?? '/app';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [formError, setFormError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: LoginErrors = {};
    if (!isValidEmail(email)) next.email = 'Vui lòng nhập email hợp lệ';
    if (password.length < 6) next.password = 'Mật khẩu cần ít nhất 6 ký tự';
    setErrors(next);
    setFormError(undefined);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Đăng nhập thành công');
      navigate(from, { replace: true });
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
      title="Chào mừng trở lại"
      subtitle="Đăng nhập để tiếp tục theo dõi sức khỏe cây trồng của bạn."
      back={{ to: '/', label: 'Trang chủ' }}
      footer={
      <>
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Đăng ký miễn phí
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
          error={errors.email} />
        
        <TextField
          label="Mật khẩu"
          type="password"
          icon={LockIcon}
          autoComplete="current-password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password} />
        
        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="inline-flex h-10 items-center text-sm font-semibold text-primary hover:underline">
            
            Quên mật khẩu?
          </Link>
        </div>
        <Button type="submit" size="lg" fullWidth loading={loading}>
          {loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </Button>
      </form>

      {isMockMode &&
      <div className="mt-6">
          <DemoNotice>
            Chưa kết nối máy chủ xác thực. Dùng tài khoản demo <strong>{DEMO_CREDENTIALS.email}</strong> /{' '}
            <strong>{DEMO_CREDENTIALS.password}</strong>{' '}
            <button
            type="button"
            onClick={() => {
              setEmail(DEMO_CREDENTIALS.email);
              setPassword(DEMO_CREDENTIALS.password);
              setErrors({});
            }}
            className="font-semibold text-primary underline-offset-2 hover:underline">
            
              Điền tự động
            </button>
          </DemoNotice>
        </div>
      }
    </AuthLayout>);

}