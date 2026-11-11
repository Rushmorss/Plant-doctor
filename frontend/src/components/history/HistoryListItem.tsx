import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { formatScanDateTime, formatScanTime } from '../../utils/date';
import type { ScanRecord } from '../../types/plant';

interface HistoryListItemProps {
  record: ScanRecord;
  timeOnly?: boolean;
}

/** Badge trạng thái nằm dưới tiêu đề (không chiếm cột riêng) để tiêu đề không bị bóp nghẹt ở màn hình 320px. */
export function HistoryListItem({ record, timeOnly = false }: HistoryListItemProps) {
  const title = record.status === 'uncertain' ? `Có thể: ${record.label}` : record.label;
  const time = timeOnly ? formatScanTime(record.scannedAt) : formatScanDateTime(record.scannedAt);

  return (
    <Link
      to={`/app/result/${record.id}`}
      className="group flex min-w-0 items-center gap-3 rounded-2xl p-3 transition-colors duration-150 hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:gap-4">
      
      <img
        src={record.image}
        alt={`Ảnh ${record.cropName} đã phân tích`}
        className="h-16 w-16 shrink-0 rounded-xl object-cover" />
      
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-ink">{title}</p>
        <p className="mt-0.5 truncate text-sm text-muted">
          {record.cropName} · {time}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          <StatusBadge status={record.status} />
          <span className="text-xs font-medium tabular-nums text-muted">Tin cậy {record.confidence}%</span>
        </div>
      </div>
      <ChevronRightIcon
        className="h-5 w-5 shrink-0 text-muted transition-transform duration-150 group-hover:translate-x-0.5"
        aria-hidden="true" />
      
    </Link>);

}