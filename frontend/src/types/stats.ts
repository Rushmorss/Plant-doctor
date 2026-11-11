import type { ConfidenceLevel } from '../utils/confidence';

export interface WeeklyPoint {
  label: string;
  diseased: number;
  healthy: number;
  uncertain: number;
}

export interface StatusSummary {
  total: number;
  diseased: number;
  healthy: number;
  uncertain: number;
  deltaLabel: string;
}

export interface DistributionItem {
  name: string;
  count: number;
}

export interface CropStat {
  crop: string;
  scans: number;
  diseased: number;
}

export interface ConfidenceBucket {
  level: ConfidenceLevel;
  label: string;
  range: string;
  count: number;
}

export interface SeasonalAlertInfo {
  region: string;
  title: string;
  description: string;
  diseaseId: string;
}

export interface DashboardStats {
  summary: StatusSummary;
  weekly: WeeklyPoint[];
  distribution: DistributionItem[];
  alert: SeasonalAlertInfo;
}

export interface AnalyticsStats {
  summary: StatusSummary;
  weekly: WeeklyPoint[];
  distribution: DistributionItem[];
  crops: CropStat[];
  confidence: ConfidenceBucket[];
}

export type AnalyticsRange = '4w' | '8w' | '12w';