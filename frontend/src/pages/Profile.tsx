import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartColumnIcon, KeyRoundIcon, LogOutIcon, SettingsIcon, ShieldCheckIcon, UserIcon } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { SettingsGroup } from '../components/profile/SettingsGroup';
import { SettingsRow } from '../components/profile/SettingsRow';
import { EditProfileSheet } from '../components/profile/EditProfileSheet';
import { ChangePasswordSheet } from '../components/profile/ChangePasswordSheet';
import { LogoutSheet } from '../components/profile/LogoutSheet';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useAsync } from '../hooks/useAsync';
import { historyService } from '../services/historyService';

export function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const history = useAsync((signal) => historyService.list(signal), []);
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  if (!user) return null;

  const records = history.data ?? [];
  const stats = [
  { label: 'Lần quét', value: records.length },
  { label: 'Ca bệnh', value: records.filter((r) => r.status === 'disease').length },
  { label: 'Loại cây', value: new Set(records.map((r) => r.cropId)).size }];


  return (
    <main className="mx-auto w-full min-w-0 max-w-6xl px-4 pb-10 md:px-8">
      <PageHeader title="Hồ sơ" subtitle="Thông tin cá nhân và quản lý tài khoản" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-8">
        <div className="min-w-0 lg:sticky lg:top-8">
          <ProfileHeader user={user} stats={stats} onEdit={() => setEditOpen(true)} />
        </div>

        <div className="min-w-0 space-y-6">
          <SettingsGroup title="Quản lý tài khoản">
            <SettingsRow
              icon={UserIcon}
              label="Thông tin cá nhân"
              description="Họ tên, số điện thoại, khu vực, vai trò"
              onClick={() => setEditOpen(true)} />
            
            <SettingsRow icon={KeyRoundIcon} label="Đổi mật khẩu" onClick={() => setPasswordOpen(true)} />
            <SettingsRow
              icon={ShieldCheckIcon}
              label="Xác thực tài khoản"
              trailing={
              <span className="whitespace-nowrap rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
                  Đã xác thực
                </span>
              } />
            
          </SettingsGroup>

          <SettingsGroup title="Ứng dụng">
            <SettingsRow
              icon={ChartColumnIcon}
              label="Phân tích & thống kê"
              description="Xu hướng bệnh theo thời gian"
              onClick={() => navigate('/app/analytics')} />
            
            <SettingsRow
              icon={SettingsIcon}
              label="Cài đặt ứng dụng"
              description="Thông báo, chất lượng ảnh, dữ liệu"
              onClick={() => navigate('/app/settings')} />
            
          </SettingsGroup>

          <Button variant="dangerOutline" size="lg" fullWidth onClick={() => setLogoutOpen(true)}>
            <LogOutIcon className="h-5 w-5" aria-hidden="true" />
            Đăng xuất
          </Button>
        </div>
      </div>

      <EditProfileSheet open={editOpen} onClose={() => setEditOpen(false)} user={user} />
      <ChangePasswordSheet open={passwordOpen} onClose={() => setPasswordOpen(false)} userId={user.id} />
      <LogoutSheet open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </main>);

}