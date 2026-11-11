import React from 'react';
import { motion } from 'framer-motion';
import { getConfidenceLevel } from '../../utils/confidence';
import type { ConfidenceLevel } from '../../utils/confidence';

interface ConfidenceMeterProps {
  value: number;
  size?: 'md' | 'lg';
  showLabel?: boolean;
}

const levelMeta: Record<ConfidenceLevel, {label: string;text: string;bar: string;}> = {
  high: { label: 'Độ tin cậy cao', text: 'text-primary', bar: 'bg-primary' },
  medium: {
    label: 'Độ tin cậy trung bình — nên đối chiếu thêm',
    text: 'text-warning-ink',
    bar: 'bg-warning'
  },
  low: {
    label: 'Độ tin cậy thấp — chưa đủ cơ sở kết luận',
    text: 'text-danger-ink',
    bar: 'bg-danger'
  }
};

export function ConfidenceMeter({ value, size = 'md', showLabel = true }: ConfidenceMeterProps) {
  const meta = levelMeta[getConfidenceLevel(value)];

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-muted">Độ tin cậy của AI</span>
        <span className={`font-bold tabular-nums ${size === 'lg' ? 'text-2xl' : 'text-base'} ${meta.text}`}>
          {value}%
        </span>
      </div>
      <div
        className={`mt-2 overflow-hidden rounded-full bg-line ${size === 'lg' ? 'h-2.5' : 'h-2'}`}
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Độ tin cậy của AI">
        
        <motion.div
          className={`h-full rounded-full ${meta.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }} />
        
      </div>
      {showLabel && <p className={`mt-2 text-sm font-medium ${meta.text}`}>{meta.label}</p>}
    </div>);

}