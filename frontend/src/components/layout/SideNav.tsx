import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ScanLineIcon } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Avatar } from '../ui/Avatar';
import { navItems } from '../../data/navigation';
import { useAuth } from '../../contexts/AuthContext';

export function SideNav() {
  const { user } = useAuth();
  const links = navItems.filter((item) => !item.primary);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-20 flex-col border-r border-line bg-surface md:flex lg:w-64">
      <div className="flex h-20 shrink-0 items-center justify-center lg:justify-start lg:px-6">
        <Link to="/app" aria-label="AI Plant Doctor — Trang chủ">
          <Logo textClassName="hidden lg:inline" />
        </Link>
      </div>

      <div className="px-3 lg:px-4">
        <NavLink
          to="/app/scan"
          aria-label="Quét cây trồng"
          title="Quét cây trồng"
          className={({ isActive }) =>
          `flex h-12 items-center justify-center gap-2.5 rounded-xl font-semibold text-white transition-colors duration-150 ease-out lg:justify-start lg:px-4 ${
          isActive ? 'bg-primary-dark' : 'bg-primary hover:bg-primary-dark'}`

          }>
          
          <ScanLineIcon className="h-5 w-5" aria-hidden="true" />
          <span className="hidden text-sm lg:inline">Quét cây trồng</span>
        </NavLink>
      </div>

      <nav aria-label="Điều hướng chính" className="mt-6 flex-1 overflow-y-auto px-3 lg:px-4">
        <ul className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  title={item.label}
                  aria-label={item.label}
                  className={({ isActive }) =>
                  `flex h-11 items-center justify-center gap-3 rounded-xl text-sm font-medium transition-colors duration-150 lg:justify-start lg:px-4 ${
                  isActive ? 'bg-primary-soft text-primary' : 'text-ink/80 hover:bg-canvas hover:text-ink'}`

                  }>
                  
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="hidden lg:inline">{item.label}</span>
                </NavLink>
              </li>);

          })}
        </ul>
      </nav>

      {user &&
      <Link
        to="/app/profile"
        aria-label="Hồ sơ của bạn"
        className="m-3 flex items-center justify-center gap-3 rounded-2xl p-2 transition-colors duration-150 hover:bg-canvas lg:m-4 lg:justify-start">
        
          <Avatar src={user.avatar} name={user.fullName} />
          <span className="hidden min-w-0 lg:block">
            <span className="block truncate text-sm font-semibold text-ink">{user.fullName}</span>
            <span className="block truncate text-xs text-muted">{user.role}</span>
          </span>
        </Link>
      }
    </aside>);

}