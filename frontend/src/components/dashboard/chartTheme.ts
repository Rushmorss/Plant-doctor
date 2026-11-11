import type { CSSProperties } from 'react';

export const chartColors = {
  diseased: '#E53935',
  healthy: '#81C784',
  uncertain: '#F9A825',
  grid: '#E2EBE1',
  axis: '#78909C',
  cursor: '#F5F9F4'
};

export const distributionColors = ['#2E7D32', '#81C784', '#26352A', '#A5C9A7', '#78909C', '#D5E3D3'];

export const tooltipStyle: CSSProperties = {
  borderRadius: 12,
  border: '1px solid #E2EBE1',
  boxShadow: '0 4px 16px rgba(38,53,42,0.08)',
  fontSize: 13,
  fontFamily: 'Be Vietnam Pro, sans-serif',
  color: '#26352A'
};