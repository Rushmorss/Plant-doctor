import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CircleAlertIcon, CircleCheckIcon } from 'lucide-react';
import { toast } from 'sonner';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Button } from '../../components/ui/Button';
import { buttonClasses } from '../../components/ui/buttonStyles';
import { useOtpInput } from '../../hooks/useOtpInput';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../services/errors';
import { isMockMode } from '../../services/config';

interface VerifyState {
  email?: string;
  mode?: 'signup' | 'reset';
}

export function VerifyAccount() {
  const navigate = useNavigate();
  const state = (useLocation().state ?? {}) as VerifyState;
  const email = state.email;
  const isReset = state.mode === 'reset';
  const { completeSignup } = useAuth();
  const otp = useOtpInput();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);

  if (!email) {
    return (
      <AuthLayout
        title="Không tìm thấy phiên xác thực"
        subtitle="Hãy đăng ký tài khoản hoặc yêu cầu đặt lại mật khẩu để nhận mã xác thực."
        back={{ to: '/', label: 'Trang chủ' }}>
        
        <div className="space-y-3">
          <Link to="/register" className={buttonClasses('primary', 'lg', 'w-full')}>
            Đăng ký tài khoản
          </Link>
          <Link to="/forgot-password" className={buttonClasses('outline', 'lg', 'w-full')}>
            Quên mật khẩu
          </Link>
        </div>
      </AuthLayout>);

  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.isComplete) {
      setError('Vui lòng nhập đủ 6 chữ số');
      return;
    }
    setError(undefined);
    setLoading(true);
    try {
      if (isReset) {
        await authService.verifyReset(email, otp.code);
        navigate('/reset-password', { state: { email }, replace: true });
        return;
      }
      await completeSignup(email, otp.code);
      setVerified(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authService.resendOtp(email);
      otp.resend();
      toast.success('Đã gửi lại mã xác thực');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setResending(false);
    }
  };

  if (verified) {
    return (
      <AuthLayout
        title="Tài khoản đã được xác thực"
        subtitle="Mọi thứ đã sẵn sàng. Hãy chụp tấm ảnh lá đầu tiên để bắt đầu.">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          
          <CircleCheckIcon className="h-8 w-8" aria-hidden="true" />
        </motion.div>
        <Button
          size="lg"
          fullWidth
          className="mt-8"
          onClick={() => {
            toast.success('Chào mừng bạn đến với AI Plant Doctor');
            navigate('/app', { replace: true });
          }}>
          
          Vào ứng dụng
        </Button>
      </AuthLayout>);

  }

  return (
    <AuthLayout
      title={isReset ? 'Nhập mã đặt lại mật khẩu' : 'Xác thực tài khoản'}
      subtitle={`Nhập mã 6 chữ số chúng tôi vừa gửi đến ${email}.`}
      back={{ to: isReset ? '/forgot-password' : '/register', label: 'Quay lại' }}>
      
      <form onSubmit={handleVerify} noValidate>
        <fieldset>
          <legend className="sr-only">Mã xác thực</legend>
          <div className="grid grid-cols-6 gap-1.5 min-[360px]:gap-2 sm:gap-3">
            {otp.digits.map((digit, index) =>
            <input
              key={index}
              ref={(el) => {
                otp.refs.current[index] = el;
              }}
              inputMode="numeric"
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              maxLength={6}
              value={digit}
              aria-label={`Chữ số ${index + 1}`}
              onChange={(e) => otp.handleChange(index, e.target.value)}
              onKeyDown={(e) => otp.handleKeyDown(index, e)}
              onPaste={otp.handlePaste}
              className={`h-12 w-full min-w-0 rounded-xl border bg-surface text-center text-xl font-bold text-ink transition-[border-color,box-shadow] duration-150 focus:outline-none focus:ring-4 min-[360px]:h-14 sm:h-16 ${
              error ? 'border-danger focus:ring-danger/10' : 'border-line focus:border-primary focus:ring-primary/10'}`
              } />

            )}
          </div>
        </fieldset>
        {error ?
        <p className="mt-3 flex items-start gap-1.5 text-sm text-danger-ink" role="alert">
            <CircleAlertIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </p> :

        isMockMode &&
        <p className="mt-3 text-sm text-muted">Chế độ demo: nhập 6 chữ số bất kỳ (000000 là mã sai).</p>

        }

        <Button type="submit" size="lg" fullWidth loading={loading} className="mt-6">
          {loading ? 'Đang xác thực…' : 'Xác thực'}
        </Button>

        <p className="mt-6 text-center text-sm text-muted">
          Chưa nhận được mã?{' '}
          {otp.secondsLeft > 0 ?
          <span className="tabular-nums">Gửi lại sau {otp.secondsLeft}s</span> :

          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="inline-flex h-10 items-center font-semibold text-primary hover:underline disabled:opacity-50">
            
              {resending ? 'Đang gửi…' : 'Gửi lại mã'}
            </button>
          }
        </p>
      </form>
    </AuthLayout>);

}