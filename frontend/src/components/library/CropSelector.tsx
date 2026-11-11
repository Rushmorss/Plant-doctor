import React from 'react';
import { LayoutGridIcon } from 'lucide-react';
import type { Crop } from '../../types/plant';

interface CropSelectorProps {
  crops: Crop[];
  value: string;
  onChange: (id: string) => void;
  countFor: (id: string) => number;
}

export function CropSelector({ crops, value, onChange, countFor }: CropSelectorProps) {
  const itemClass = (selected: boolean) =>
  `flex w-[76px] shrink-0 flex-col items-center gap-2 rounded-2xl py-2 text-center transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
  selected ? 'text-primary' : 'text-ink hover:bg-surface'}`;

  const ringClass = (selected: boolean) =>
  `flex h-14 w-14 items-center justify-center overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-canvas transition-[box-shadow] duration-150 ${
  selected ? 'ring-primary' : 'ring-transparent'}`;


  return (
    <div className="no-scrollbar flex min-w-0 gap-1 overflow-x-auto md:flex-wrap" role="group" aria-label="Chọn cây trồng">
      <button type="button" aria-pressed={value === 'all'} onClick={() => onChange('all')} className={itemClass(value === 'all')}>
        <span className={`${ringClass(value === 'all')} bg-primary-soft text-primary`}>
          <LayoutGridIcon className="h-6 w-6" aria-hidden="true" />
        </span>
        <span className="text-sm font-medium">Tất cả</span>
      </button>
      {crops.map((crop) => {
        const selected = value === crop.id;
        return (
          <button
            key={crop.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(crop.id)}
            className={itemClass(selected)}>
            
            <span className={ringClass(selected)}>
              <img src={crop.image} alt="" className="h-full w-full object-cover" />
            </span>
            <span className="text-sm font-medium leading-tight">
              {crop.name}
              <span className="block text-xs font-normal text-muted">{countFor(crop.id)} bệnh</span>
            </span>
          </button>);

      })}
    </div>);

}