import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, ScanSearchIcon } from 'lucide-react';
import { ScanCallout } from '../components/dashboard/ScanCallout';
import { OverviewPanel } from '../components/dashboard/OverviewPanel';
import { DiseaseBreakdown } from '../components/dashboard/DiseaseBreakdown';
import { RecentScans } from '../components/dashboard/RecentScans';
import { SeasonalAlert } from '../components/dashboard/SeasonalAlert';
import { DashboardSkeleton } from '../components/dashboard/DashboardSkeleton';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { buttonClasses } from '../components/ui/buttonStyles';
import { useAuth } from '../contexts/AuthContext';
import { useAsync } from '../hooks/useAsync';
import { useSettings } from '../hooks/useSettings';
import { statsService } from '../services/statsService';
import { historyService } from '../services/historyService';
import { formatToday } from '../utils/date';

export function Dashboard() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const stats = useAsync((signal) => statsService.getDashboard(signal), []);
  const recent = useAsync((signal) => historyService.list(signal), []);

  const loading = stats.loading || recent.loading;
  const error = stats.error ?? recent.error;
  const records = recent.data ?? [];
  const isEmpty = !stats.data && records.length === 0;
  const firstName = user?.fullName.trim().split(' ').pop() ?? '';

  const retry = () => {
    stats.reload();
    recent.reload();
  };

  return (
    <main className="mx-auto w-full min-w-0 max-w-6xl px-4 md:px-8">
      <header className="flex items-center justify-between gap-4 pb-5 pt-[max(1.25rem,env(safe-area-inset-top))] md:pt-10">
        <div className="min-w-0">
          <p className="text-sm text-muted">{formatToday()}</p>
          <h1 className="mt-0.5 text-[22px] font-bold leading-tight tracking-tight text-ink min-[375px]:text-2xl md:text-3xl">
            Chào {firstName}, vườn hôm nay thế nào?
          </h1>
        </div>
        {user &&
        <Link to="/app/profile" aria-label="Hồ sơ" className="shrink-0 md:hidden">
            <Avatar src={user.avatar} name={user.fullName} className="h-11 w-11" />
          </Link>
        }
      </header>

      <ScanCallout />

      {loading ?
      <DashboardSkeleton /> :
      error ?
      <Card className="mt-6">
          <ErrorState message={error.message} onRetry={retry} />
        </Card> :
      isEmpty ?
      <Card className="mt-6">
          <EmptyState
          icon={ScanSearchIcon}
          title="Chưa có dữ liệu phân tích"
          description="Sau lần quét đầu tiên, thống kê bệnh, biểu đồ và lịch sử nhận diện sẽ xuất hiện tại đây."
          action={
          <Link to="/app/scan" className={buttonClasses('primary', 'lg')}>
                Quét cây đầu tiên
              </Link>
          } />
        
        </Card> :

      <div className="pb-10">
          {stats.data &&
        <div className="mt-6 grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
              <OverviewPanel
            className="lg:col-span-2"
            title="Ảnh đã phân tích · 8 tuần qua"
            summary={stats.data.summary}
            weekly={stats.data.weekly}
            action={
            <Link
              to="/app/analytics"
              className="inline-flex h-8 items-center gap-1 text-sm font-semibold text-primary hover:underline">
              
                    Xem phân tích
                    <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                  </Link>
            } />
          
              <DiseaseBreakdown items={stats.data.distribution} />
            </div>
        }
          <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {records.length > 0 &&
          <RecentScans
            records={records.slice(0, 4)}
            className={stats.data && settings.diseaseAlerts ? 'lg:col-span-2' : 'md:col-span-2 lg:col-span-3'} />

          }
            {stats.data && settings.diseaseAlerts && <SeasonalAlert alert={stats.data.alert} />}
          </div>
        </div>
      }
    </main>);

}