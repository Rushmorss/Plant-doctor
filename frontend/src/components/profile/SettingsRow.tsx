import React from "react";
import { ChevronRightIcon, BoxIcon } from "lucide-react";
interface SettingsRowProps {
  icon: BoxIcon;
  label: string;
  description?: string;
  value?: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
  tone?: 'default' | 'danger';
}
export function SettingsRow({
  icon: Icon,
  label,
  description,
  value,
  onClick,
  trailing,
  tone = 'default'
}: SettingsRowProps) {
  const danger = tone === 'danger';
  const content = <>
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${danger ? 'bg-danger-soft text-danger-ink' : 'bg-primary-soft text-primary'}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block font-medium ${danger ? 'text-danger-ink' : 'text-ink'}`}>{label}</span>
        {description && <span className="mt-0.5 block text-sm text-muted">{description}</span>}
      </span>
      {value && <span className="max-w-[40%] shrink-0 truncate text-right text-sm text-muted">{value}</span>}
      {trailing && <span className="shrink-0">{trailing}</span>}
      {onClick && !trailing && <ChevronRightIcon className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />}
    </>;
  return <li>
      {onClick ? <button type="button" onClick={onClick} className="flex min-h-[64px] w-full min-w-0 items-center gap-3.5 rounded-2xl px-2 py-3 text-left transition-colors duration-150 hover:bg-canvas">
          {content}
        </button> : <div className="flex min-h-[64px] min-w-0 items-center gap-3.5 px-2 py-3">{content}</div>}
    </li>;
}