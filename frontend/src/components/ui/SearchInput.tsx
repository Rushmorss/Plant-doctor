import React from 'react';
import { SearchIcon, XIcon } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}

export function SearchInput({ value, onChange, placeholder, label }: SearchInputProps) {
  return (
    <div className="relative min-w-0 flex-1">
      <SearchIcon
        className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
        aria-hidden="true" />
      
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="h-12 w-full min-w-0 rounded-xl border border-line bg-surface pl-11 pr-12 text-[15px] text-ink placeholder:text-muted/80 transition-[border-color,box-shadow] duration-150 ease-out focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 [&::-webkit-search-cancel-button]:hidden" />
      
      {value &&
      <button
        type="button"
        onClick={() => onChange('')}
        aria-label="Xóa tìm kiếm"
        className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition-colors duration-150 hover:bg-canvas hover:text-ink">
        
          <XIcon className="h-4 w-4" />
        </button>
      }
    </div>);

}