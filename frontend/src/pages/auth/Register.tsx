import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LockIcon, MailIcon, UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { FormAlert } from '../../components/auth/FormAlert';
import { PasswordStrength } from '../../components/auth/PasswordStrength';
import { TextField } from '../../components/ui/TextField';
import { Button } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';
import { userRoles } from '../../data/profile';
import { authService } from '../../services/authService';
import { getErrorCode, getErrorMessage } from '../../services/errors';
import { isValidEmail } from '../../utils/validation';

interface RegisterErrors {
  fullName?: string;
  email?: string;
  password?: string;
  terms?: string;
}

export function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(userRoles[0]);
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [formError, setFormError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: RegisterErrors = {};
    if (fullName.trim().length < 2) next.fullName = 'Vui lòng nhập họ và tên';
    if (!isValidEmail(email)) next.email = 'Vui lòng nhập email hợp lệ';
    if (password.length < 8) next.password = 'Mật khẩu cần ít nhất 8 ký tự';
    if (!terms) next.terms = 'Bạn cần đồng ý với điều khoản sử dụng';
    setErrors(next);
    setFormError(undefined);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      await authService.register({ fullName, email, password, role });
      toast.success('Đã gửi mã xác thực đến email của bạn');
      navigate('/verify', { state: { email, mode: 'signup' } });
    } catch (err) {
      const message = getErrorMessage(err);
      if (getErrorCode(err) === 'conflict') setErrors({ email: message });else
      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Tạo tài khoản"
      subtitle="Miễn phí cho nông dân và sinh viên. Chỉ mất chưa đến một phút."
      back={{ to: '/', label: 'Trang chủ' }}
      footer={
      <>
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Đăng nhập
          </Link>
        </>
      }>
      
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <FormAlert message={formError} />
        <TextField
          label="Họ và tên"
          icon={UserIcon}
          autoComplete="name"
          placeholder="Nguyễn Văn An"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={errors.fullName} />
        
        <TextField
          label="Email"
          type="email"
          icon={MailIcon}
          autoComplete="email"
          placeholder="ban@vidu.vn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email} />
        

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">Bạn là</legend>
          <div className="flex flex-wrap gap-2">
            {userRoles.map((r) =>
            <Chip key={r} selected={role === r} onClick={() => setRole(r)}>
                {r}
              </Chip>
            )}
          </div>
        </fieldset>

        <div>
          <TextField
            label="Mật khẩu"
            type="password"
            icon={LockIcon}
            autoComplete="new-password"
            placeholder="Tối thiểu 8 ký tự"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password} />
          
          {password && !errors.password && <PasswordStrength password={password} />}
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-[#2E7D32]" />
            
            <span>
              Tôi đồng ý với <span className="font-semibold text-primary">Điều khoản sử dụng</span> và{' '}
              <span className="font-semibold text-primary">Chính sách quyền riêng tư</span>
            </span>
          </label>
          {errors.terms && <p className="mt-1.5 text-sm text-danger-ink">{errors.terms}</p>}
        </div>

        <Button type="submit" size="lg" fullWidth loading={loading}>
          {loading ? 'Đang tạo tài khoản…' : 'Tạo tài khoản'}
        </Button>
      </form>
    </AuthLayout>);

}