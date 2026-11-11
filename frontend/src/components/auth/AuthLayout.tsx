import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { images } from '../../data/images';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  back?: {to: string;label: string;};
}

export function AuthLayout({ title, subtitle, children, footer, back }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-canvas lg:grid lg:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden overflow-hidden lg:block">
        <img src={images.authField} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/40" aria-hidden="true" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" aria-label="Về trang chủ">
            <Logo tone="light" />
          </Link>
          <div className="max-w-md text-white">
            <p className="text-3xl font-semibold leading-snug">
              Phát hiện sớm một vết bệnh, giữ lại cả một mùa vụ.
            </p>
            <p className="mt-4 text-white/80">
              Đồng hành cùng nông dân, sinh viên và kỹ sư bảo vệ thực vật trên khắp Việt Nam.
            </p>
          </div>
        </div>
      </aside>

      <main className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between">
          <Link to="/" aria-label="Về trang chủ" className="lg:invisible">
            <Logo />
          </Link>
          {back &&
          <Link
            to={back.to}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-150 hover:text-ink">
            
              <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
              {back.label}
            </Link>
          }
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="text-[28px] font-bold tracking-tight text-ink sm:text-3xl">{title}</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 text-center text-sm text-muted">{footer}</div>}
        </div>
      </main>
    </div>);

}