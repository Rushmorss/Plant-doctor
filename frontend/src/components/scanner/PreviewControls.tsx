import React from 'react';
import { RotateCcwIcon, SparklesIcon, Trash2Icon } from 'lucide-react';
import { Chip } from '../ui/Chip';
import { cropHints } from '../../data/scanner';

interface PreviewControlsProps {
  cropHint: string;
  onCropHint: (id: string) => void;
  onDelete: () => void;
  onReselect: () => void;
  reselectLabel: string;
  onAnalyze: () => void;
}

const secondaryButton =
'inline-flex h-12 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-white/15 px-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-white/25';

export function PreviewControls({ cropHint, onCropHint, onDelete, onReselect, reselectLabel, onAnalyze }: PreviewControlsProps) {
  return (
    <div className="pb-6 pt-5">
      <p className="px-5 text-sm font-medium text-white/80">Loại cây (không bắt buộc)</p>
      <div className="no-scrollbar mt-2.5 flex min-w-0 gap-2 overflow-x-auto px-5" role="group" aria-label="Chọn loại cây">
        {cropHints.map((hint) =>
        <Chip key={hint.id} tone="dark" selected={cropHint === hint.id} onClick={() => onCropHint(hint.id)}>
            {hint.label}
          </Chip>
        )}
      </div>
      <div className="mt-5 space-y-2.5 px-5">
        <button
          type="button"
          onClick={onAnalyze}
          className="inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-primary-dark active:scale-[0.98]">
          
          <SparklesIcon className="h-5 w-5" aria-hidden="true" />
          Gửi ảnh để phân tích
        </button>
        <div className="grid grid-cols-2 gap-2.5">
          <button type="button" onClick={onDelete} className={secondaryButton}>
            <Trash2Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">Xóa ảnh</span>
          </button>
          <button type="button" onClick={onReselect} className={secondaryButton}>
            <RotateCcwIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{reselectLabel}</span>
          </button>
        </div>
      </div>
    </div>);

}