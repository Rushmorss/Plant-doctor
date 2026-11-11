import { useMemo, useState } from 'react';
import { HISTORY_REFERENCE_DATE } from '../data/scanHistory';
import { getDayKey } from '../utils/date';
import { matchesQuery } from '../utils/text';
import type { ScanRecord, ScanStatus } from '../types/plant';

export type StatusFilter = 'all' | ScanStatus;
export type RangeFilter = 'all' | '7d' | '30d';

const DAY_MS = 24 * 60 * 60 * 1000;
const rangeDays: Record<Exclude<RangeFilter, 'all'>, number> = { '7d': 7, '30d': 30 };

export function useHistoryFilters(records: ScanRecord[]) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [cropId, setCropId] = useState('all');
  const [range, setRange] = useState<RangeFilter>('all');

  const filtered = useMemo(() => {
    const reference = Math.max(Date.now(), new Date(HISTORY_REFERENCE_DATE).getTime());
    return records.filter((r) => {
      if (status !== 'all' && r.status !== status) return false;
      if (cropId !== 'all' && r.cropId !== cropId) return false;
      if (range !== 'all' && reference - new Date(r.scannedAt).getTime() > rangeDays[range] * DAY_MS) return false;
      return matchesQuery(query, r.label, r.cropName, r.location);
    });
  }, [records, query, status, cropId, range]);

  const groups = useMemo(() => {
    const map = new Map<string, ScanRecord[]>();
    filtered.forEach((r) => {
      const key = getDayKey(r.scannedAt);
      map.set(key, [...(map.get(key) ?? []), r]);
    });
    return Array.from(map.entries()).map(([key, items]) => ({ key, items }));
  }, [filtered]);

  const statusCounts = useMemo(() => {
    const counts: Record<StatusFilter, number> = { all: records.length, disease: 0, healthy: 0, uncertain: 0 };
    records.forEach((r) => {
      counts[r.status] += 1;
    });
    return counts;
  }, [records]);

  const advancedCount = (cropId !== 'all' ? 1 : 0) + (range !== 'all' ? 1 : 0);

  const reset = () => {
    setQuery('');
    setStatus('all');
    setCropId('all');
    setRange('all');
  };

  return {
    query,
    setQuery,
    status,
    setStatus,
    cropId,
    setCropId,
    range,
    setRange,
    filtered,
    groups,
    statusCounts,
    advancedCount,
    reset
  };
}