import React from 'react';
import { CheckIcon, LoaderCircleIcon } from 'lucide-react';
import { analysisSteps } from '../../data/scanner';

interface AnalysisProgressProps {
  stepIndex: number;
  onCancel: () => void;
}

export function AnalysisProgress({ stepIndex, onCancel }: AnalysisProgressProps) {
  const progress = Math.min(100, Math.round(stepIndex / analysisSteps.length * 100));

  return (
    <div className="px-5 pb-6 pt-5 text-white" role="status" aria-live="polite">
      <div className="flex items-baseline justify-between">
        <p className="font-semibold">AI đang phân tích ảnh…</p>
        <span className="text-sm tabular-nums text-white/70">{progress}%</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-secondary transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }} />
        
      </div>
      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {analysisSteps.map((step, i) => {
          const done = i < stepIndex;
          const active = i === stepIndex;
          return (
            <li
              key={step}
              className={`flex items-center gap-2.5 text-sm ${done || active ? 'text-white' : 'text-white/45'}`}>
              
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                done ? 'bg-secondary text-ink' : 'border border-white/30'}`
                }>
                
                {done && <CheckIcon className="h-3 w-3" strokeWidth={3} aria-hidden="true" />}
                {active && <LoaderCircleIcon className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
              </span>
              {step}
            </li>);

        })}
      </ul>
      <button
        type="button"
        onClick={onCancel}
        className="mt-5 w-full rounded-xl py-2.5 text-sm font-semibold text-white/80 transition-colors duration-150 hover:bg-white/10 hover:text-white">
        
        Hủy phân tích
      </button>
    </div>);

}