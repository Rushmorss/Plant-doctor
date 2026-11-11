import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { HistoryListItem } from '../history/HistoryListItem';
import type { ScanRecord } from '../../types/plant';

interface RecentScansProps {
  records: ScanRecord[];
  className?: string;
}

export function RecentScans({ records, className = '' }: RecentScansProps) {
  return (
    <Card aria-labelledby="recent-title" padding="list" className={className}>
      <div className="flex items-center justify-between gap-3 px-3 pt-2">
        <h2 id="recent-title" className="font-semibold text-ink">
          Nhận diện gần đây
        </h2>
        <Link to="/app/history" className="inline-flex h-10 items-center text-sm font-semibold text-primary hover:underline">
          Xem tất cả
        </Link>
      </div>
      <ul className="divide-y divide-line/70">
        {records.map((record) =>
        <li key={record.id}>
            <HistoryListItem record={record} />
          </li>
        )}
      </ul>
    </Card>);

}