import React, { useId } from 'react';
import { ChevronDownIcon } from 'lucide-react';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface SelectProps<T extends string> {
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  hideLabel?: boolean;
  className?: string;
}

/** Dropdown dùng thẻ select gốc: hoạt động tốt với bàn phím, trình đọc màn hình và bộ chọn của iOS/Android. */
export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  hideLabel = false,
  className = ''
}: SelectProps<T>) {
  const id = useId();
  return (
    <div className={`min-w-0 ${className}`}>
      <label htmlFor={id} className={hideLabel ? 'sr-only' : 'mb-1.5 block text-sm font-medium text-ink'}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="h-11 w-full appearance-none truncate rounded-xl border border-line bg-surface pl-4 pr-10 text-sm font-medium text-ink transition-[border-color,box-shadow] duration-150 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10">
          
          {options.map((option) =>
          <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          )}
        </select>
        <ChevronDownIcon
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true" />
        
      </div>
    </div>);

}