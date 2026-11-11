import React from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  className?: string;
}

export function Avatar({ src, name, className = 'h-10 w-10' }: AvatarProps) {
  if (src) return <img src={src} alt="" className={`${className} shrink-0 rounded-full object-cover`} />;
  const initials = name.
  split(' ').
  filter(Boolean).
  slice(-2).
  map((word) => word[0]).
  join('').
  toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={`${className} flex shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary`}>
      
      {initials}
    </span>);

}