import React from 'react';

interface ChipProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tone?: 'light' | 'dark';
}

export function Chip({ selected, onClick, children, tone = 'light' }: ChipProps) {
  const light = selected ?
  'border-primary bg-primary text-white' :
  'border-line bg-surface text-ink hover:border-secondary';
  const dark = selected ?
  'border-white bg-white text-ink' :
  'border-white/25 bg-white/10 text-white hover:bg-white/20';

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
      tone === 'light' ? light : dark}`
      }>
      
      {children}
    </button>);

}