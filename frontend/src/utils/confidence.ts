export type ConfidenceLevel = 'high' | 'medium' | 'low';

export const CONFIDENCE_THRESHOLDS = {
  high: 85,
  medium: 65
};

export function getConfidenceLevel(value: number): ConfidenceLevel {
  if (value >= CONFIDENCE_THRESHOLDS.high) return 'high';
  if (value >= CONFIDENCE_THRESHOLDS.medium) return 'medium';
  return 'low';
}

export function isConclusive(value: number): boolean {
  return value >= CONFIDENCE_THRESHOLDS.medium;
}