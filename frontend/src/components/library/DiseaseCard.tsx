import React from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { SeverityBadge } from '../ui/SeverityBadge';
import type { Disease } from '../../types/plant';

interface DiseaseCardProps {
  disease: Disease;
  cropName: string;
  onOpen: () => void;
}

export function DiseaseCard({ disease, cropName, onOpen }: DiseaseCardProps) {
  return (
    <article className="h-full">
      <button
        type="button"
        onClick={onOpen}
        className="group flex h-full w-full flex-col overflow-hidden rounded-3xl bg-surface text-left shadow-soft transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
        
        <div className="relative aspect-[16/10] overflow-hidden">
          <img src={disease.image} alt={`Hình minh họa ${disease.name}`} className="h-full w-full object-cover" />
          <span className="absolute left-3 top-3">
            <SeverityBadge severity={disease.severity} />
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <p className="text-sm font-medium text-primary">{cropName}</p>
          <h3 className="mt-1 text-lg font-bold leading-snug text-ink">{disease.name}</h3>
          <p className="mt-0.5 text-sm italic text-muted">{disease.scientificName}</p>
          <p className="mt-3 line-clamp-2 text-[15px] leading-relaxed text-ink/75">{disease.summary}</p>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-primary">
            Xem chi tiết
            <ArrowRightIcon
              className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
              aria-hidden="true" />
            
          </span>
        </div>
      </button>
    </article>);

}