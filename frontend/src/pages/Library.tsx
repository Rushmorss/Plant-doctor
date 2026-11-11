import React from 'react';
import { SearchXIcon } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Button } from '../components/ui/Button';
import { CropSelector } from '../components/library/CropSelector';
import { DiseaseCard } from '../components/library/DiseaseCard';
import { DiseaseDetailSheet } from '../components/library/DiseaseDetailSheet';
import { useLibrarySearch } from '../hooks/useLibrarySearch';
import type { SeverityFilter } from '../hooks/useLibrarySearch';
import { useAsync } from '../hooks/useAsync';
import { libraryService } from '../services/libraryService';
import type { Crop, Disease } from '../types/plant';

const severityOptions: {value: SeverityFilter;label: string;}[] = [
{ value: 'all', label: 'Mọi mức độ' },
{ value: 'high', label: 'Nguy hiểm' },
{ value: 'medium', label: 'Trung bình' },
{ value: 'low', label: 'Nhẹ' }];


const NO_DISEASES: Disease[] = [];
const NO_CROPS: Crop[] = [];

export function Library() {
  const data = useAsync(async (signal) => {
    const [crops, diseases] = await Promise.all([libraryService.listCrops(signal), libraryService.listDiseases(signal)]);
    return { crops, diseases };
  }, []);
  const lib = useLibrarySearch(data.data?.diseases ?? NO_DISEASES, data.data?.crops ?? NO_CROPS);

  return (
    <main className="mx-auto w-full min-w-0 max-w-6xl px-4 pb-10 md:px-8">
      <PageHeader title="Thư viện bệnh cây" subtitle="Tra cứu triệu chứng, nguyên nhân và cách phòng ngừa bệnh thường gặp" />

      {data.error ?
      <Card>
          <ErrorState message={data.error.message} onRetry={data.reload} />
        </Card> :

      <>
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
            <SearchInput
            value={lib.query}
            onChange={lib.setQuery}
            placeholder="Tìm cây trồng, tên bệnh, triệu chứng…"
            label="Tìm kiếm cây trồng và bệnh" />
          
            <Select
            label="Lọc theo mức độ"
            hideLabel
            value={lib.severity}
            options={severityOptions}
            onChange={lib.setSeverity}
            className="sm:w-48 [&_select]:h-12" />
          
          </div>

          <section aria-labelledby="crops-title" className="mt-6 min-w-0">
            <h2 id="crops-title" className="mb-2 text-sm font-semibold text-muted">
              Cây trồng
            </h2>
            {data.loading ?
          <div className="flex gap-3 overflow-hidden" aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) =>
            <Skeleton key={i} className="h-14 w-14 shrink-0 rounded-full" />
            )}
              </div> :

          <CropSelector
            crops={data.data?.crops ?? NO_CROPS}
            value={lib.cropId}
            onChange={lib.setCropId}
            countFor={lib.diseaseCountByCrop} />

          }
          </section>

          <section aria-labelledby="diseases-title" className="mt-8">
            <h2 id="diseases-title" className="text-lg font-bold text-ink">
              Bệnh thường gặp {!data.loading && <span className="font-medium text-muted">({lib.results.length})</span>}
            </h2>
            {data.loading ?
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3" aria-busy="true">
                {Array.from({ length: 6 }, (_, i) =>
            <li key={i} className="min-w-0 overflow-hidden rounded-3xl bg-surface shadow-soft">
                    <Skeleton className="aspect-[16/10] w-full rounded-none" />
                    <div className="space-y-2 p-5">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </li>
            )}
              </ul> :
          lib.results.length === 0 ?
          <Card className="mt-4">
                <EmptyState
              icon={SearchXIcon}
              title="Không tìm thấy bệnh phù hợp"
              description="Thử tìm bằng triệu chứng như “đốm nâu”, “vàng lá” hoặc bỏ bớt bộ lọc."
              action={
              <Button variant="soft" onClick={lib.reset}>
                      Xem tất cả bệnh
                    </Button>
              } />
            
              </Card> :

          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                {lib.results.map((disease) =>
            <li key={disease.id} className="min-w-0">
                    <DiseaseCard
                disease={disease}
                cropName={lib.cropName(disease.cropId)}
                onOpen={() => lib.openDisease(disease.id)} />
              
                  </li>
            )}
              </ul>
          }
          </section>
        </>
      }

      <DiseaseDetailSheet
        disease={lib.selectedDisease}
        cropName={lib.selectedDisease ? lib.cropName(lib.selectedDisease.cropId) : ''}
        onClose={lib.closeDisease} />
      
    </main>);

}