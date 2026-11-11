import React from 'react';
import { InfoIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import type { ConfidenceBucket } from '../../types/stats';
import type { ConfidenceLevel } from '../../utils/confidence';

const barClass: Record<ConfidenceLevel, string> = {
  high: 'bg-primary',
  medium: 'bg-warning',
  low: 'bg-danger'
};

export function ConfidenceDistribution({ buckets, className = '' }: {buckets: ConfidenceBucket[];className?: string;}) {
  const total = buckets.reduce((s, b) => s + b.count, 0) || 1;

  return (
    <Card aria-labelledby="confidence-title" className={`flex flex-col ${className}`}>
      <h2 id="confidence-title" className="font-semibold text-ink">
        Độ tin cậy của AI
      </h2>
      <p className="mt-0.5 text-sm text-muted">Phân bố kết quả theo mức tin cậy</p>
      <ul className="mt-5 space-y-4">
        {buckets.map((b) => {
          const pct = Math.round(b.count / total * 100);
          return (
            <li key={b.level}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="text-ink">
                  <span className="font-medium">{b.label}</span> <span className="text-muted">({b.range})</span>
                </span>
                <span className="shrink-0 tabular-nums">
                  <span className="font-semibold text-ink">{b.count}</span> <span className="text-muted">· {pct}%</span>
                </span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
                <div className={`h-full rounded-full ${barClass[b.level]}`} style={{ width: `${pct}%` }} />
              </div>
            </li>);

        })}
      </ul>
      <p className="mt-auto flex gap-2 pt-5 text-sm leading-relaxed text-muted">
        <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Kết quả dưới 65% không được đưa ra kết luận và luôn kèm khuyến nghị tham khảo chuyên gia.
      </p>
    </Card>);

}