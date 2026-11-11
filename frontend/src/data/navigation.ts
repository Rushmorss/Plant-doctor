import {
  BookOpenIcon,
  ChartColumnIcon,
  HistoryIcon,
  HomeIcon,
  ScanLineIcon,
  SettingsIcon,
  UserIcon } from
'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  /** Nút Quét nổi bật ở giữa Bottom Navigation */
  primary?: boolean;
  /** Chỉ hiển thị trên Sidebar (tablet/desktop); trên mobile truy cập qua Dashboard / Hồ sơ */
  desktopOnly?: boolean;
}

export const navItems: NavItem[] = [
{ to: '/app', label: 'Trang chủ', icon: HomeIcon, end: true },
{ to: '/app/history', label: 'Lịch sử', icon: HistoryIcon },
{ to: '/app/analytics', label: 'Phân tích', icon: ChartColumnIcon, desktopOnly: true },
{ to: '/app/scan', label: 'Quét', icon: ScanLineIcon, primary: true },
{ to: '/app/library', label: 'Thư viện', icon: BookOpenIcon },
{ to: '/app/profile', label: 'Hồ sơ', icon: UserIcon },
{ to: '/app/settings', label: 'Cài đặt', icon: SettingsIcon, desktopOnly: true }];