import React from 'react';
import { Link } from 'react-router-dom';
import { ScanLineIcon } from 'lucide-react';
import { BottomSheet } from '../ui/BottomSheet';
import { SeverityBadge } from '../ui/SeverityBadge';
import { buttonClasses } from '../ui/buttonStyles';
import type { Disease } from '../../types/plant';

interface DiseaseDetailSheetProps {
  disease: Disease | null;
  cropName: string;
  onClose: () => void;
}

function DetailList({ title, items }: {title: string;items: string[];}) {
  return (
    <section className="border-t border-line pt-5">
      <h3 className="font-semibold text-ink">{title}</h3>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) =>
        <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-ink/85">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" aria-hidden="true" />
            {item}
          </li>
        )}
      </ul>
    </section>);

}

export function DiseaseDetailSheet({ disease, cropName, onClose }: DiseaseDetailSheetProps) {
  return (
    <BottomSheet
      open={disease !== null}
      onClose={onClose}
      title={disease?.name ?? ''}
      description={disease ? `${cropName} · ${disease.scientificName}` : undefined}
      size="lg">
      
      {disease &&
      <div className="space-y-5">
          <div className="aspect-[16/9] overflow-hidden rounded-2xl">
            <img src={disease.image} alt={`Hình minh họa ${disease.name}`} className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-wrap gap-2">
            <SeverityBadge severity={disease.severity} />
            <span className="inline-flex rounded-full bg-canvas px-2.5 py-1 text-xs font-semibold text-ink">
              Tác nhân: {disease.pathogenType}
            </span>
          </div>
          <p className="text-[15px] leading-relaxed text-ink/85">{disease.summary}</p>
          <DetailList title="Triệu chứng" items={disease.symptoms} />
          <DetailList title="Nguyên nhân" items={disease.causes} />
          <DetailList title="Biện pháp phòng ngừa" items={disease.prevention} />
          <DetailList title="Khi phát hiện bệnh" items={disease.care} />
          <Link to="/app/scan" className={buttonClasses('primary', 'lg', 'w-full')}>
            <ScanLineIcon className="h-5 w-5" aria-hidden="true" />
            Quét để kiểm tra cây của bạn
          </Link>
        </div>
      }
    </BottomSheet>);

}