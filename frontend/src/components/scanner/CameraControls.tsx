import React from 'react';
import { ImageIcon, LightbulbIcon } from 'lucide-react';

interface CameraControlsProps {
  onCapture: () => void;
  onGallery: () => void;
  onTips: () => void;
}

export function CameraControls({ onCapture, onGallery, onTips }: CameraControlsProps) {
  return (
    <div className="flex items-center justify-around px-6 pb-8 pt-6">
      <button
        type="button"
        onClick={onGallery}
        className="flex w-16 flex-col items-center gap-1.5 text-white">
        
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 transition-colors duration-150 hover:bg-white/25">
          <ImageIcon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-xs font-medium">Thư viện</span>
      </button>

      <button
        type="button"
        onClick={onCapture}
        aria-label="Chụp ảnh cây trồng"
        className="flex h-[78px] w-[78px] items-center justify-center rounded-full border-4 border-white transition-transform duration-150 ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary">
        
        <span className="h-[62px] w-[62px] rounded-full bg-white" />
      </button>

      <button type="button" onClick={onTips} className="flex w-16 flex-col items-center gap-1.5 text-white">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 transition-colors duration-150 hover:bg-white/25">
          <LightbulbIcon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="whitespace-nowrap text-xs font-medium">Mẹo chụp</span>
      </button>
    </div>);

}