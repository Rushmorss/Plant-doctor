import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  back?: {to: string;label: string;};
}

export function PageHeader({ title, subtitle, actions, back }: PageHeaderProps) {
  return (
    <header className="pb-5 pt-[max(1.25rem,env(safe-area-inset-top))] md:pt-10">
      {back &&
      <Link
        to={back.to}
        className="-ml-2 mb-2 inline-flex h-10 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-muted transition-colors duration-150 hover:text-ink">
        
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          {back.label}
        </Link>
      }
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-[15px] text-muted">{subtitle}</p>}
        </div>
        {actions && <div className="flex min-w-0 items-center gap-2">{actions}</div>}
      </div>
    </header>);

}