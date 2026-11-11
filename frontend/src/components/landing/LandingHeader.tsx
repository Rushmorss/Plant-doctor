import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { buttonClasses } from '../ui/buttonStyles';
import { useAuth } from '../../contexts/AuthContext';

const links = [
{ href: '#cach-hoat-dong', label: 'Cách hoạt động' },
{ href: '#cong-nghe', label: 'Công nghệ' },
{ href: '#tinh-nang', label: 'Tính năng' }];


export function LandingHeader() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/90 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-5 md:h-[72px] md:px-8">
        <Link to="/" aria-label="AI Plant Doctor" className="min-w-0">
          <Logo textClassName="text-[15px] min-[360px]:text-[17px]" />
        </Link>
        <nav aria-label="Liên kết trang" className="hidden items-center gap-8 md:flex">
          {links.map((link) =>
          <a
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-ink/75 transition-colors duration-150 hover:text-primary">
            
              {link.label}
            </a>
          )}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          {user ?
          <Link to="/app" className={buttonClasses('primary', 'sm')}>
              Vào ứng dụng
            </Link> :

          <>
              <Link to="/login" className={buttonClasses('ghost', 'sm', 'hidden sm:inline-flex')}>
                Đăng nhập
              </Link>
              <Link to="/register" className={buttonClasses('primary', 'sm')}>
                Bắt đầu
              </Link>
            </>
          }
        </div>
      </div>
    </header>);

}