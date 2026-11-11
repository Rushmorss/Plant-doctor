import React from 'react';

export function Skeleton({ className = '' }: {className?: string;}) {
  return <div aria-hidden="true" className={`animate-pulse rounded-xl bg-line/70 ${className}`} />;
}