import React from 'react';
import { SproutIcon } from 'lucide-react';

interface LogoProps {
  tone?: 'dark' | 'light';
  textClassName?: string;
}

export function Logo({ tone = 'dark', textClassName = '' }: LogoProps) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
        <SproutIcon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span
        className={`whitespace-nowrap text-[17px] font-bold tracking-tight ${
        tone === 'light' ? 'text-white' : 'text-ink'} ${
        textClassName}`}>
        
        AI Plant Doctor
      </span>
    </span>);

}