import React from 'react';
import { BadgeCheckIcon, MapPinIcon, PencilIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import type { UserProfile } from '../../types/user';

interface ProfileHeaderProps {
  user: UserProfile;
  stats: {label: string;value: number;}[];
  onEdit: () => void;
}

export function ProfileHeader({ user, stats, onEdit }: ProfileHeaderProps) {
  return (
    <Card aria-label="Thông tin người dùng">
      <div className="flex items-start gap-4">
        <Avatar src={user.avatar} name={user.fullName} className="h-16 w-16 text-lg md:h-20 md:w-20" />
        <div className="min-w-0 flex-1">
          <h2 className="flex min-w-0 items-center gap-1.5 text-xl font-bold text-ink">
            <span className="truncate">{user.fullName}</span>
            <BadgeCheckIcon className="h-5 w-5 shrink-0 text-primary" aria-label="Đã xác thực" />
          </h2>
          <p className="mt-0.5 truncate text-[15px] text-ink/80">{user.role}</p>
          <p className="mt-0.5 truncate text-sm text-muted">{user.email}</p>
          {user.location &&
          <p className="mt-1 flex min-w-0 items-center gap-1 text-sm text-muted">
              <MapPinIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{user.location}</span>
            </p>
          }
        </div>
        <button
          type="button"
          onClick={onEdit}
          aria-label="Chỉnh sửa thông tin"
          className="-mr-2 -mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-canvas hover:text-ink">
          
          <PencilIcon className="h-5 w-5" />
        </button>
      </div>
      <dl className="mt-6 grid grid-cols-3 divide-x divide-line border-t border-line pt-5">
        {stats.map((s) =>
        <div key={s.label} className="flex min-w-0 flex-col-reverse items-center px-1 text-center">
            <dt className="mt-0.5 truncate text-sm text-muted">{s.label}</dt>
            <dd className="text-xl font-bold tabular-nums text-ink">{s.value}</dd>
          </div>
        )}
      </dl>
      <p className="mt-5 text-center text-xs text-muted">
        Thành viên từ {user.memberSince}
        {user.organization ? ` · ${user.organization}` : ''}
      </p>
    </Card>);

}