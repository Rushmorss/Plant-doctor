import React from 'react';
import { LoaderCircleIcon } from 'lucide-react';
import { buttonClasses } from './buttonStyles';
import type { ButtonSize, ButtonVariant } from './buttonStyles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={buttonClasses(variant, size, `${fullWidth ? 'w-full' : ''} ${className}`)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}>
      
      {loading && <LoaderCircleIcon className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>);

}