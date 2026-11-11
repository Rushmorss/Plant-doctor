import React from "react";
import { BoxIcon } from "lucide-react";
interface EmptyStateProps {
  icon: BoxIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  tone?: 'neutral' | 'warning' | 'danger';
  role?: 'alert' | 'status';
}
const toneClass = {
  neutral: 'bg-primary-soft text-primary',
  warning: 'bg-warning-soft text-warning-ink',
  danger: 'bg-danger-soft text-danger-ink'
};
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  tone = 'neutral',
  role
}: EmptyStateProps) {
  return <div role={role} className="flex flex-col items-center px-5 py-12 text-center sm:px-6">
      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${toneClass[tone]}`}>
        <Icon className="h-8 w-8" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-lg font-bold text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-muted">{description}</p>
      {action && <div className="mt-6 flex w-full flex-col items-center gap-2 sm:w-auto">{action}</div>}
    </div>;
}