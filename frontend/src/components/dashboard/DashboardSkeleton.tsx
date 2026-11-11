import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export function DashboardSkeleton() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3" aria-busy="true" aria-label="Đang tải dữ liệu">
      <div className="min-w-0 rounded-3xl bg-surface p-5 shadow-soft md:p-6 lg:col-span-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-3 h-10 w-24" />
        <Skeleton className="mt-6 h-[200px] w-full" />
      </div>
      <div className="min-w-0 rounded-3xl bg-surface p-5 shadow-soft md:p-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mx-auto mt-6 h-36 w-36 rounded-full" />
        <Skeleton className="mt-6 h-3 w-full" />
        <Skeleton className="mt-3 h-3 w-4/5" />
      </div>
    </div>);

}