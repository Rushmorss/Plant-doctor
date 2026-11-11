import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScanSearchIcon, SearchXIcon, SlidersHorizontalIcon } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { Chip } from '../components/ui/Chip';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { buttonClasses } from '../components/ui/buttonStyles';
import { HistoryListItem } from '../components/history/HistoryListItem';
import { HistoryFilterSheet } from '../components/history/HistoryFilterSheet';
import { HistoryListSkeleton } from '../components/history/HistoryListSkeleton';
import { useHistoryFilters } from '../hooks/useHistoryFilters';
import type { StatusFilter } from '../hooks/useHistoryFilters';
import { useAsync } from '../hooks/useAsync';
import { historyService } from '../services/historyService';
import { formatScanDay } from '../utils/date';
import type { ScanRecord } from '../types/plant';

const statusOptions: {id: StatusFilter;label: string;}[] = [
{ id: 'all', label: 'Tất cả' },
{ id: 'disease', label: 'Có bệnh' },
{ id: 'healthy', label: 'Khỏe mạnh' },
{ id: 'uncertain', label: 'Cần xác minh' }];


const EMPTY: ScanRecord[] = [];

export function History() {
  const history = useAsync((signal) => historyService.list(signal), []);
  const records = history.data ?? EMPTY;
  const filters = useHistoryFilters(records);
  const [filterOpen, setFilterOpen] = useState(false);

  const subtitle = history.loading ?
  'Đang tải…' :
  records.length ?
  `${records.length} lần phân tích` :
  'Chưa có lần phân tích nào';

  return (
    <main className="mx-auto w-full min-w-0 max-w-4xl px-4 md:px-8">
      <PageHeader title="Lịch sử nhận diện" subtitle={subtitle} />

      {history.error ?
      <Card>
          <ErrorState message={history.error.message} onRetry={history.reload} />
        </Card> :
      !history.loading && records.length === 0 ?
      <Card>
          <EmptyState
          icon={ScanSearchIcon}
          title="Chưa có lịch sử nhận diện"
          description="Mỗi lần bạn quét lá cây, kết quả sẽ được lưu tại đây để bạn theo dõi diễn biến bệnh theo thời gian."
          action={
          <Link to="/app/scan" className={buttonClasses('primary', 'lg')}>
                Quét cây đầu tiên
              </Link>
          } />
        
        </Card> :

      <>
          <div className="flex min-w-0 gap-2.5">
            <SearchInput
            value={filters.query}
            onChange={filters.setQuery}
            placeholder="Tìm bệnh, cây trồng, địa điểm…"
            label="Tìm kiếm lịch sử" />
          
            <button
            type="button"
            onClick={() => setFilterOpen(true)}
            aria-label={`Mở bộ lọc${filters.advancedCount ? ` (${filters.advancedCount} đang áp dụng)` : ''}`}
            className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-ink transition-colors duration-150 hover:border-secondary">
            
              <SlidersHorizontalIcon className="h-5 w-5" />
              {filters.advancedCount > 0 &&
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-white">
                  {filters.advancedCount}
                </span>
            }
            </button>
          </div>

          <div className="no-scrollbar mt-4 flex min-w-0 gap-2 overflow-x-auto pb-1" role="group" aria-label="Lọc theo trạng thái">
            {statusOptions.map((option) =>
          <Chip key={option.id} selected={filters.status === option.id} onClick={() => filters.setStatus(option.id)}>
                {option.label}
                <span className="tabular-nums opacity-70">{filters.statusCounts[option.id]}</span>
              </Chip>
          )}
          </div>

          {history.loading ?
        <HistoryListSkeleton /> :
        filters.filtered.length === 0 ?
        <Card className="mt-6">
              <EmptyState
            icon={SearchXIcon}
            title="Không tìm thấy kết quả phù hợp"
            description="Thử từ khóa khác hoặc bỏ bớt bộ lọc để xem thêm lịch sử nhận diện."
            action={
            <Button variant="soft" onClick={filters.reset}>
                    Xóa tìm kiếm & bộ lọc
                  </Button>
            } />
          
            </Card> :

        <div className="mt-6 space-y-6 pb-10">
              {filters.groups.map((group) =>
          <section key={group.key} aria-label={formatScanDay(group.items[0].scannedAt)}>
                  <h2 className="px-1 text-sm font-semibold text-muted">{formatScanDay(group.items[0].scannedAt)}</h2>
                  <ul className="mt-2 divide-y divide-line/70 rounded-3xl bg-surface p-2 shadow-soft">
                    {group.items.map((record) =>
              <li key={record.id}>
                        <HistoryListItem record={record} timeOnly />
                      </li>
              )}
                  </ul>
                </section>
          )}
            </div>
        }

          <HistoryFilterSheet
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          cropId={filters.cropId}
          range={filters.range}
          onApply={(crop, range) => {
            filters.setCropId(crop);
            filters.setRange(range);
          }} />
        
        </>
      }
    </main>);

}