import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChartColumnIcon } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { OverviewPanel } from '../components/dashboard/OverviewPanel';
import { DiseaseBreakdown } from '../components/dashboard/DiseaseBreakdown';
import { DashboardSkeleton } from '../components/dashboard/DashboardSkeleton';
import { CropBreakdown } from '../components/analytics/CropBreakdown';
import { ConfidenceDistribution } from '../components/analytics/ConfidenceDistribution';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { buttonClasses } from '../components/ui/buttonStyles';
import { useAsync } from '../hooks/useAsync';
import { statsService } from '../services/statsService';
import type { AnalyticsRange } from '../types/stats';

const rangeOptions: {value: AnalyticsRange;label: string;}[] = [
{ value: '4w', label: '4 tuần qua' },
{ value: '8w', label: '8 tuần qua' },
{ value: '12w', label: '12 tuần qua' }];


export function Analytics() {
  const [range, setRange] = useState<AnalyticsRange>('8w');
  const stats = useAsync((signal) => statsService.getAnalytics(range, signal), [range]);
  const rangeLabel = rangeOptions.find((o) => o.value === range)?.label ?? '';

  return (
    <main className="mx-auto w-full min-w-0 max-w-6xl px-4 pb-10 md:px-8">
      <PageHeader
        title="Phân tích"
        subtitle="Xu hướng bệnh và chất lượng nhận diện trên vườn của bạn"
        back={{ to: '/app', label: 'Trang chủ' }}
        actions={
        <Select label="Khoảng thời gian" hideLabel value={range} options={rangeOptions} onChange={setRange} className="w-40" />
        } />
      

      {stats.loading ?
      <DashboardSkeleton /> :
      stats.error ?
      <Card>
          <ErrorState message={stats.error.message} onRetry={stats.reload} />
        </Card> :
      !stats.data ?
      <Card>
          <EmptyState
          icon={ChartColumnIcon}
          title="Chưa đủ dữ liệu để phân tích"
          description="Biểu đồ xu hướng sẽ xuất hiện sau khi bạn có kết quả nhận diện."
          action={
          <Link to="/app/scan" className={buttonClasses('primary', 'lg')}>
                Quét cây ngay
              </Link>
          } />
        
        </Card> :

      <div className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
            <OverviewPanel
            className="lg:col-span-2"
            title={`Ảnh đã phân tích · ${rangeLabel}`}
            summary={stats.data.summary}
            weekly={stats.data.weekly} />
          
            <ConfidenceDistribution buckets={stats.data.confidence} />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            <CropBreakdown crops={stats.data.crops} className="lg:col-span-2" />
            <DiseaseBreakdown items={stats.data.distribution} />
          </div>
        </div>
      }
    </main>);

}