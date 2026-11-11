import React from 'react';
import { LoaderCircleIcon } from 'lucide-react';

interface SpinnerProps {
  label?: string;
  className?: string;
}

export function Spinner({ label = 'Đang tải', className = 'h-5 w-5' }: SpinnerProps) {
  return (
    <span role="status" className="inline-flex items-center">
      <LoaderCircleIcon className={`animate-spin ${className}`} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>);

}