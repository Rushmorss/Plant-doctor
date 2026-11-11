import { twMerge } from 'tailwind-merge';

export type ButtonVariant = 'primary' | 'soft' | 'outline' | 'ghost' | 'danger' | 'dangerOutline';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
'inline-flex min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-[background-color,color,border-color,transform] duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  soft: 'bg-primary-soft text-primary hover:bg-[#d8ebd8]',
  outline: 'border border-line bg-surface text-ink hover:border-secondary hover:bg-canvas',
  ghost: 'text-ink hover:bg-primary-soft',
  danger: 'bg-danger text-white hover:bg-danger-ink',
  dangerOutline: 'border border-danger/30 bg-surface text-danger-ink hover:bg-danger-soft'
};

/** Chiều cao tối thiểu 40px (sm) – 48px (lg) để phù hợp thao tác chạm. */
const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-3.5 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-[15px]'
};

export function buttonClasses(
variant: ButtonVariant = 'primary',
size: ButtonSize = 'md',
extra = '')
: string {
  return twMerge(base, variants[variant], sizes[size], extra);
}