import React, { useEffect, useState } from 'react';
import { KeyRoundIcon, LockIcon } from 'lucide-react';
import { toast } from 'sonner';
import { BottomSheet } from '../ui/BottomSheet';
import { TextField } from '../ui/TextField';
import { Button } from '../ui/Button';
import { FormAlert } from '../auth/FormAlert';
import { PasswordStrength } from '../auth/PasswordStrength';
import { authService } from '../../services/authService';
import { getErrorCode, getErrorMessage } from '../../services/errors';

interface ChangePasswordSheetProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

interface Errors {
  current?: string;
  next?: string;
  confirm?: string;
}

export function ChangePasswordSheet({ open, onClose, userId }: ChangePasswordSheetProps) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setCurrent('');
      setNext('');
      setConfirm('');
      setErrors({});
      setFormError(undefined);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Errors = {};
    if (!current) nextErrors.current = 'Vui lòng nhập mật khẩu hiện tại';
    if (next.length < 8) nextErrors.next = 'Mật khẩu mới cần ít nhất 8 ký tự';else
    if (next === current) nextErrors.next = 'Mật khẩu mới phải khác mật khẩu hiện tại';
    if (confirm !== next) nextErrors.confirm = 'Mật khẩu nhập lại không khớp';
    setErrors(nextErrors);
    setFormError(undefined);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      await authService.changePassword(userId, current, next);
      toast.success('Đã đổi mật khẩu thành công');
      onClose();
    } catch (err) {
      const message = getErrorMessage(err);
      if (getErrorCode(err) === 'validation') setErrors({ current: message });else
      setFormError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Đổi mật khẩu">
      <form noValidate className="space-y-4 pt-1" onSubmit={handleSubmit}>
        <FormAlert message={formError} />
        <TextField
          label="Mật khẩu hiện tại"
          type="password"
          icon={LockIcon}
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          error={errors.current} />
        
        <div>
          <TextField
            label="Mật khẩu mới"
            type="password"
            icon={KeyRoundIcon}
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            error={errors.next} />
          
          {next && !errors.next && <PasswordStrength password={next} />}
        </div>
        <TextField
          label="Nhập lại mật khẩu mới"
          type="password"
          icon={KeyRoundIcon}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm} />
        
        <div className="pt-2">
          <Button type="submit" size="lg" fullWidth loading={saving}>
            {saving ? 'Đang cập nhật…' : 'Cập nhật mật khẩu'}
          </Button>
        </div>
      </form>
    </BottomSheet>);

}