import React from 'react';
import type { Severity } from '../../types/plant';

const severityMeta: Record<Severity, {label: string;className: string;}> = {
  low: { label: 'Mức độ nhẹ', className: 'bg-primary-soft text-primary' },
  medium: { label: 'Mức độ trung bình', className: 'bg-warning-soft text-warning-ink' },
  high: { label: 'Nguy hiểm', className: 'bg-danger-soft text-danger-ink' }
};

export function SeverityBadge({ severity }: {severity: Severity;}) {
  const meta = severityMeta[severity];
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${meta.className}`}>
      {meta.label}
    </span>);

}