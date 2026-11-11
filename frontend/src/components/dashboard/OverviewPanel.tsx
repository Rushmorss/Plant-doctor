import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TrendingUpIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { chartColors, tooltipStyle } from './chartTheme';
import type { StatusSummary, WeeklyPoint } from '../../types/stats';

interface OverviewPanelProps {
  title: string;
  summary: StatusSummary;
  weekly: WeeklyPoint[];
  action?: React.ReactNode;
  className?: string;
}

export function OverviewPanel({ title, summary, weekly, action, className = '' }: OverviewPanelProps) {
  const legend = [
  { key: 'diseased', label: 'Phát hiện bệnh', value: summary.diseased, color: chartColors.diseased },
  { key: 'healthy', label: 'Khỏe mạnh', value: summary.healthy, color: chartColors.healthy },
  { key: 'uncertain', label: 'Cần xác minh', value: summary.uncertain, color: chartColors.uncertain }];


  return (
    <Card aria-labelledby="overview-title" className={className}>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <h2 id="overview-title" className="min-w-0 text-sm font-medium text-muted">
          {title}
        </h2>
        {action}
      </div>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-4xl font-bold tabular-nums tracking-tight text-ink md:text-5xl">{summary.total}</span>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
          <TrendingUpIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
          {summary.deltaLabel}
        </span>
      </div>

      <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
        {legend.map((item) =>
        <div key={item.key} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} aria-hidden="true" />
            <dt className="text-sm text-muted">{item.label}</dt>
            <dd className="text-sm font-semibold tabular-nums text-ink">{item.value}</dd>
          </div>
        )}
      </dl>

      {/* w-full + min-w-0: ResponsiveContainer đo theo khung cha, không giữ độ rộng cũ khi màn hình thu nhỏ */}
      <div className="mt-5 h-[200px] w-full min-w-0 sm:h-[240px]" role="img" aria-label="Biểu đồ số ảnh phân tích theo tuần">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weekly} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={chartColors.grid} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={8}
              tick={{ fill: chartColors.axis, fontSize: 11 }} />
            
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} tick={{ fill: chartColors.axis, fontSize: 11 }} />
            <Tooltip cursor={{ fill: chartColors.cursor }} contentStyle={tooltipStyle} labelFormatter={(l) => `Tuần ${l}`} />
            <Bar dataKey="diseased" name="Phát hiện bệnh" stackId="scan" fill={chartColors.diseased} maxBarSize={22} />
            <Bar dataKey="healthy" name="Khỏe mạnh" stackId="scan" fill={chartColors.healthy} maxBarSize={22} />
            <Bar
              dataKey="uncertain"
              name="Cần xác minh"
              stackId="scan"
              fill={chartColors.uncertain}
              radius={[6, 6, 0, 0]}
              maxBarSize={22} />
            
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>);

}