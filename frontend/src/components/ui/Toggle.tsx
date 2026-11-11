import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 ${
      checked ? 'bg-primary' : 'bg-line'}`
      }>
      
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
        checked ? 'translate-x-6' : 'translate-x-1'}`
        } />
      
    </button>);

}