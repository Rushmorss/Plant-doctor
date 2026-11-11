export type Severity = 'low' | 'medium' | 'high';

export interface Crop {
  id: string;
  name: string;
  image: string;
}

export interface Disease {
  id: string;
  cropId: string;
  name: string;
  scientificName: string;
  pathogenType: string;
  image: string;
  severity: Severity;
  summary: string;
  symptoms: string[];
  causes: string[];
  prevention: string[];
  care: string[];
}

export type ScanStatus = 'disease' | 'healthy' | 'uncertain';

/** 'mock' = kết quả mô phỏng (chưa có Backend AI), 'api' = kết quả từ máy chủ thật. */
export type ResultSource = 'mock' | 'api';

export interface Candidate {
  diseaseId: string | null;
  label: string;
  confidence: number;
}

export interface ScanRecord {
  id: string;
  cropId: string;
  cropName: string;
  status: ScanStatus;
  diseaseId: string | null;
  label: string;
  confidence: number;
  image: string;
  scannedAt: string;
  location: string;
  candidates: Candidate[];
  source: ResultSource;
}

export type SeedScanRecord = Omit<ScanRecord, 'source'>;

export type ScanOutcome = 'confident' | 'lowConfidence' | 'healthy' | 'unrecognized' | 'invalidImage';