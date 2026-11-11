import { useAsync } from './useAsync';
import { historyService } from '../services/historyService';
import { libraryService } from '../services/libraryService';
import { ApiError } from '../services/errors';
import { getConfidenceLevel, isConclusive } from '../utils/confidence';
import type { ConfidenceLevel } from '../utils/confidence';
import type { Disease, ScanRecord } from '../types/plant';

export interface Diagnosis {
  record: ScanRecord;
  disease: Disease | null;
  level: ConfidenceLevel;
  conclusive: boolean;
  isHealthy: boolean;
  needsExpert: boolean;
}

export function buildDiagnosis(record: ScanRecord, disease: Disease | null): Diagnosis {
  const conclusive = record.status !== 'uncertain' && isConclusive(record.confidence);
  return {
    record,
    disease,
    level: getConfidenceLevel(record.confidence),
    conclusive,
    isHealthy: record.status === 'healthy',
    needsExpert: !conclusive || disease?.severity === 'high'
  };
}

export function useDiagnosis(id: string | undefined) {
  return useAsync(async (signal) => {
    if (!id) throw new ApiError('not_found', 'Đường dẫn kết quả không hợp lệ.');
    const record = await historyService.get(id, signal);
    const disease = record.diseaseId ? await libraryService.getDisease(record.diseaseId, signal) : null;
    return buildDiagnosis(record, disease);
  }, [id]);
}