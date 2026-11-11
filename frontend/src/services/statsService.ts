import {
  confidenceBuckets,
  cropBreakdown,
  diseaseDistribution,
  periodDeltas,
  seasonalAlert,
  weeklyScans } from
'../data/dashboardStats';
import type { AnalyticsRange, AnalyticsStats, DashboardStats, StatusSummary, WeeklyPoint } from '../types/stats';
import { getMockScenario, mockRequest } from './mockScenario';

/** Thống kê. CHỜ BACKEND: số liệu tổng hợp đang lấy từ dữ liệu mẫu. */
const RANGE_WEEKS: Record<AnalyticsRange, number> = { '4w': 4, '8w': 8, '12w': 12 };

function summarize(weekly: WeeklyPoint[], deltaLabel: string): StatusSummary {
  const diseased = weekly.reduce((s, w) => s + w.diseased, 0);
  const healthy = weekly.reduce((s, w) => s + w.healthy, 0);
  const uncertain = weekly.reduce((s, w) => s + w.uncertain, 0);
  return { total: diseased + healthy + uncertain, diseased, healthy, uncertain, deltaLabel };
}

function scaleCounts<T extends {count: number;}>(items: T[], target: number): T[] {
  const base = items.reduce((s, i) => s + i.count, 0) || 1;
  let assigned = 0;
  return items.map((item, index) => {
    const count =
    index === items.length - 1 ? Math.max(0, target - assigned) : Math.round(item.count * target / base);
    assigned += count;
    return { ...item, count };
  });
}

const BASE = summarize(weeklyScans.slice(-8), '');

export const statsService = {
  getDashboard(signal?: AbortSignal): Promise<DashboardStats | null> {
    return mockRequest<DashboardStats | null>(() => {
      if (getMockScenario().emptyHistory) return null;
      const weekly = weeklyScans.slice(-8);
      return {
        summary: summarize(weekly, periodDeltas['8w']),
        weekly,
        distribution: diseaseDistribution,
        alert: seasonalAlert
      };
    }, 550, signal);
  },

  getAnalytics(range: AnalyticsRange, signal?: AbortSignal): Promise<AnalyticsStats | null> {
    return mockRequest<AnalyticsStats | null>(() => {
      if (getMockScenario().emptyHistory) return null;
      const weekly = weeklyScans.slice(-RANGE_WEEKS[range]);
      const summary = summarize(weekly, periodDeltas[range]);
      const scanRatio = summary.total / BASE.total;
      const diseaseRatio = summary.diseased / BASE.diseased;
      return {
        summary,
        weekly,
        distribution: scaleCounts(diseaseDistribution, summary.diseased),
        crops: cropBreakdown.map((c) => {
          const scans = Math.round(c.scans * scanRatio);
          return { ...c, scans, diseased: Math.min(scans, Math.round(c.diseased * diseaseRatio)) };
        }),
        confidence: scaleCounts(confidenceBuckets, summary.total)
      };
    }, 600, signal);
  }
};