import type {
  ConfidenceBucket,
  CropStat,
  DistributionItem,
  SeasonalAlertInfo,
  WeeklyPoint } from
'../types/stats';

export const weeklyScans: WeeklyPoint[] = [
{ label: '17/8', diseased: 3, healthy: 3, uncertain: 1 },
{ label: '24/8', diseased: 4, healthy: 2, uncertain: 1 },
{ label: '31/8', diseased: 4, healthy: 4, uncertain: 0 },
{ label: '7/9', diseased: 5, healthy: 3, uncertain: 1 },
{ label: '14/9', diseased: 5, healthy: 4, uncertain: 1 },
{ label: '21/9', diseased: 7, healthy: 3, uncertain: 2 },
{ label: '28/9', diseased: 6, healthy: 6, uncertain: 1 },
{ label: '5/10', diseased: 9, healthy: 5, uncertain: 2 },
{ label: '12/10', diseased: 11, healthy: 4, uncertain: 1 },
{ label: '19/10', diseased: 10, healthy: 7, uncertain: 2 },
{ label: '26/10', diseased: 13, healthy: 6, uncertain: 2 },
{ label: '2/11', diseased: 13, healthy: 6, uncertain: 2 }];


export const diseaseDistribution: DistributionItem[] = [
{ name: 'Mốc sương · Cà chua', count: 21 },
{ name: 'Đạo ôn · Lúa', count: 18 },
{ name: 'Gỉ sắt · Cà phê', count: 14 },
{ name: 'Đốm lá lớn · Ngô', count: 9 },
{ name: 'Khảm lá · Sắn', count: 7 },
{ name: 'Khác', count: 5 }];


export const cropBreakdown: CropStat[] = [
{ crop: 'Cà chua', scans: 42, diseased: 26 },
{ crop: 'Lúa', scans: 31, diseased: 20 },
{ crop: 'Cà phê', scans: 22, diseased: 14 },
{ crop: 'Ngô', scans: 15, diseased: 7 },
{ crop: 'Sắn', scans: 10, diseased: 4 },
{ crop: 'Chuối', scans: 8, diseased: 3 }];


export const confidenceBuckets: ConfidenceBucket[] = [
{ level: 'high', label: 'Cao', range: '≥ 85%', count: 86 },
{ level: 'medium', label: 'Trung bình', range: '65–84%', count: 29 },
{ level: 'low', label: 'Thấp', range: '< 65%', count: 13 }];


export const periodDeltas = {
  '4w': '+12% so với 4 tuần trước',
  '8w': '+18% so với 8 tuần trước',
  '12w': '+31% so với 12 tuần trước'
};

export const seasonalAlert: SeasonalAlertInfo = {
  region: 'Lâm Đồng',
  title: 'Nguy cơ mốc sương trên cà chua đang tăng',
  description:
  'Độ ẩm trên 90% và nhiệt độ 16–20°C kéo dài cả tuần. Hãy kiểm tra mặt dưới lá vào buổi sáng sớm.',
  diseaseId: 'tomato-late-blight'
};