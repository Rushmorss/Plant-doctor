import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, CloudRainIcon } from 'lucide-react';
import type { SeasonalAlertInfo } from '../../types/stats';

export function SeasonalAlert({ alert }: {alert: SeasonalAlertInfo;}) {
  return (
    <section aria-labelledby="alert-title" className="flex min-w-0 flex-col rounded-3xl bg-warning-soft p-5 md:p-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-warning-ink">
        <CloudRainIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span className="min-w-0">Cảnh báo thời tiết · {alert.region}</span>
      </div>
      <h2 id="alert-title" className="mt-3 text-lg font-bold leading-snug text-ink">
        {alert.title}
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-ink/75">{alert.description}</p>
      <Link
        to={`/app/library?disease=${alert.diseaseId}`}
        className="mt-auto inline-flex min-h-[40px] items-center gap-1.5 pt-4 text-sm font-semibold text-warning-ink hover:underline">
        
        Xem cách phòng bệnh
        <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
      </Link>
    </section>);

}