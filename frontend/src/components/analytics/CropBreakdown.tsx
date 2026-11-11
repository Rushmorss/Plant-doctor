import React from 'react';
import { Card } from '../ui/Card';
import type { CropStat } from '../../types/stats';

export function CropBreakdown({ crops, className = '' }: {crops: CropStat[];className?: string;}) {
  const max = Math.max(1, ...crops.map((c) => c.scans));

  return (
    <Card aria-labelledby="crop-title" className={className}>
      <h2 id="crop-title" className="font-semibold text-ink">
        Theo loại cây trồng
      </h2>
      <p className="mt-0.5 text-sm text-muted">Số lượt quét và số ca phát hiện bệnh</p>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-danger" aria-hidden="true" />
          Có bệnh
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-secondary" aria-hidden="true" />
          Không có bệnh / cần xác minh
        </span>
      </div>
      <ul className="mt-5 space-y-4">
        {crops.map((c) =>
        <li key={c.crop} className="min-w-0">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="truncate font-medium text-ink">{c.crop}</span>
              <span className="shrink-0 tabular-nums text-muted">
                <span className="font-semibold text-ink">{c.scans}</span> lượt · {c.diseased} có bệnh
              </span>
            </div>
            <div
            className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-line"
            style={{ width: `${c.scans / max * 100}%` }}
            aria-hidden="true">
            
              <div className="h-full bg-danger" style={{ width: `${c.scans ? c.diseased / c.scans * 100 : 0}%` }} />
              <div className="h-full flex-1 bg-secondary" />
            </div>
          </li>
        )}
      </ul>
    </Card>);

}