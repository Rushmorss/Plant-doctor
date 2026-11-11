import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../ui/Card';
import { distributionColors, tooltipStyle } from './chartTheme';
import type { DistributionItem } from '../../types/stats';

interface DiseaseBreakdownProps {
  items: DistributionItem[];
  className?: string;
}

export function DiseaseBreakdown({ items, className = '' }: DiseaseBreakdownProps) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card aria-labelledby="breakdown-title" className={className}>
      <h2 id="breakdown-title" className="font-semibold text-ink">
        Các bệnh thường gặp
      </h2>
      <p className="mt-0.5 text-sm text-muted">Trong {total} ca phát hiện bệnh</p>

      <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:items-center lg:flex-col lg:items-stretch">
        <div className="relative h-[168px] w-[168px] shrink-0 self-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={items} dataKey="count" nameKey="name" innerRadius={56} outerRadius={80} paddingAngle={2} stroke="none">
                {items.map((item, index) =>
                <Cell key={item.name} fill={distributionColors[index % distributionColors.length]} />
                )}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold tabular-nums text-ink">{total}</span>
            <span className="text-xs text-muted">ca bệnh</span>
          </div>
        </div>

        <ul className="w-full min-w-0 flex-1 space-y-2.5">
          {items.map((item, index) =>
          <li key={item.name} className="flex min-w-0 items-center gap-3 text-sm">
              <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: distributionColors[index % distributionColors.length] }}
              aria-hidden="true" />
            
              <span className="min-w-0 flex-1 truncate text-ink">{item.name}</span>
              <span className="font-semibold tabular-nums text-ink">{item.count}</span>
              <span className="w-10 shrink-0 text-right tabular-nums text-muted">
                {total ? Math.round(item.count / total * 100) : 0}%
              </span>
            </li>
          )}
        </ul>
      </div>
    </Card>);

}