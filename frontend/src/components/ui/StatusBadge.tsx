import React from 'react';
import type { ScanStatus } from '../../types/plant';

const statusMeta: Record<ScanStatus, {label: string;className: string;dot: string;}> = {
  disease: { label: 'Phát hiện bệnh', className: 'bg-danger-soft text-danger-ink', dot: 'bg-danger' },
  healthy: { label: 'Khỏe mạnh', className: 'bg-primary-soft text-primary', dot: 'bg-primary' },
  uncertain: { label: 'Cần xác minh', className: 'bg-warning-soft text-warning-ink', dot: 'bg-warning' }
};

export function StatusBadge({ status }: {status: ScanStatus;}) {
  const meta = statusMeta[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${meta.className}`}>
      
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} aria-hidden="true" />
      {meta.label}
    </span>);

}