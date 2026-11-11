import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export function HistoryListSkeleton({ rows = 5 }: {rows?: number;}) {
  return (
    <div className="mt-6 rounded-3xl bg-surface p-2 shadow-soft" aria-busy="true" aria-label="Đang tải lịch sử">
      {Array.from({ length: rows }, (_, i) =>
      <div key={i} className="flex items-center gap-3 p-3">
          <Skeleton className="h-16 w-16 shrink-0" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
        </div>
      )}
    </div>);

}