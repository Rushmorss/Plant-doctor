import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { matchesQuery } from '../utils/text';
import type { Crop, Disease, Severity } from '../types/plant';

export type SeverityFilter = 'all' | Severity;

export function useLibrarySearch(diseases: Disease[], crops: Crop[]) {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [cropId, setCropId] = useState('all');
  const [severity, setSeverity] = useState<SeverityFilter>('all');

  const cropName = useCallback((id: string) => crops.find((c) => c.id === id)?.name ?? '', [crops]);

  const results = useMemo(
    () =>
    diseases.filter(
      (d) =>
      (cropId === 'all' || d.cropId === cropId) && (
      severity === 'all' || d.severity === severity) &&
      matchesQuery(query, d.name, d.scientificName, cropName(d.cropId), ...d.symptoms)
    ),
    [diseases, query, cropId, severity, cropName]
  );

  const diseaseCountByCrop = useCallback((id: string) => diseases.filter((d) => d.cropId === id).length, [diseases]);

  const selectedId = params.get('disease');
  const selectedDisease = diseases.find((d) => d.id === selectedId) ?? null;

  const reset = () => {
    setQuery('');
    setCropId('all');
    setSeverity('all');
  };

  return {
    query,
    setQuery,
    cropId,
    setCropId,
    severity,
    setSeverity,
    results,
    cropName,
    diseaseCountByCrop,
    selectedDisease,
    openDisease: (id: string) => setParams({ disease: id }),
    closeDisease: () => setParams({}),
    reset
  };
}