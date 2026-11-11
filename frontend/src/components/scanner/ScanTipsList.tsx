import React from 'react';
import { CheckIcon } from 'lucide-react';
import { scanTips } from '../../data/scanner';

export function ScanTipsList() {
  return (
    <ul className="space-y-4">
      {scanTips.map((tip) =>
      <li key={tip.title} className="flex gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
            <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
          </span>
          <div>
            <p className="font-semibold text-ink">{tip.title}</p>
            <p className="mt-0.5 text-[15px] leading-relaxed text-muted">{tip.description}</p>
          </div>
        </li>
      )}
    </ul>);

}