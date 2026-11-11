import React, { useEffect, useState } from 'react';
import { BuildingIcon, MailIcon, MapPinIcon, PhoneIcon, UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { BottomSheet } from '../ui/BottomSheet';
import { TextField } from '../ui/TextField';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { FormAlert } from '../auth/FormAlert';
import { userRoles } from '../../data/profile';
import { useAuth } from '../../contexts/AuthContext';
import { getErrorMessage } from '../../services/errors';
import type { UserProfile } from '../../types/user';

interface EditProfileSheetProps {
  open: boolean;
  onClose: () => void;
  user: UserProfile;
}

interface Errors {
  fullName?: string;
  phone?: string;
}

export function EditProfileSheet({ open, onClose, user }: EditProfileSheetProps) {
  const { updateProfile } = useAuth();
  const [form, setForm] = useState({ fullName: '', phone: '', organization: '', location: '', role: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        fullName: user.fullName,
        phone: user.phone,
        organization: user.organization,
        location: user.location,
        role: user.role
      });
      setErrors({});
      setFormError(undefined);
    }
  }, [open, user]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
  setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (form.fullName.trim().length < 2) next.fullName = 'Vui lòng nhập họ và tên';
    if (form.phone && !/^[0-9 +().-]{8,15}$/.test(form.phone.trim())) next.phone = 'Số điện thoại không hợp lệ';
    setErrors(next);
    setFormError(undefined);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      await updateProfile({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        organization: form.organization.trim(),
        location: form.location.trim(),
        role: form.role
      });
      toast.success('Đã cập nhật thông tin cá nhân');
      onClose();
    } catch (err) {
      const message = getErrorMessage(err);
      setFormError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Thông tin cá nhân">
      <form onSubmit={handleSave} noValidate className="space-y-5 pt-1">
        <FormAlert message={formError} />
        <TextField label="Họ và tên" icon={UserIcon} value={form.fullName} onChange={set('fullName')} error={errors.fullName} autoComplete="name" />
        <TextField label="Email" icon={MailIcon} value={user.email} disabled hint="Email dùng để đăng nhập và không thể thay đổi tại đây" />
        <TextField label="Số điện thoại" icon={PhoneIcon} value={form.phone} onChange={set('phone')} error={errors.phone} inputMode="tel" autoComplete="tel" />
        <TextField label="Đơn vị công tác" icon={BuildingIcon} value={form.organization} onChange={set('organization')} />
        <TextField label="Khu vực canh tác" icon={MapPinIcon} value={form.location} onChange={set('location')} placeholder="Ví dụ: Đà Lạt, Lâm Đồng" />
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">Vai trò</legend>
          <div className="flex flex-wrap gap-2">
            {userRoles.map((r) =>
            <Chip key={r} selected={form.role === r} onClick={() => setForm((prev) => ({ ...prev, role: r }))}>
                {r}
              </Chip>
            )}
          </div>
        </fieldset>
        <Button type="submit" size="lg" fullWidth loading={saving}>
          {saving ? 'Đang lưu…' : 'Lưu thay đổi'}
        </Button>
      </form>
    </BottomSheet>);

}