import React from 'react';
import { LeafIcon } from 'lucide-react';

const corners = [
'left-0 top-0 border-l-4 border-t-4 rounded-tl-[32px]',
'right-0 top-0 border-r-4 border-t-4 rounded-tr-[32px]',
'left-0 bottom-0 border-l-4 border-b-4 rounded-bl-[32px]',
'right-0 bottom-0 border-r-4 border-b-4 rounded-br-[32px]'];


/** Khung tính theo % và giới hạn max-height để vừa cả màn hình thấp (iPhone SE) lẫn cao. */
export const VIEWFINDER_FRAME =
'absolute left-1/2 top-[40%] aspect-[3/4] w-[70%] max-w-[300px] max-h-[48%] -translate-x-1/2 -translate-y-1/2 rounded-[32px]';

export function ViewfinderGuide() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className={VIEWFINDER_FRAME} style={{ boxShadow: '0 0 0 9999px rgba(0,0,0,0.38)' }}>
        {corners.map((pos) =>
        <span key={pos} className={`absolute h-12 w-12 border-white ${pos}`} />
        )}
        <div className="absolute left-1/2 top-full mt-3 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-black/50 px-3.5 py-2 text-[13px] font-medium text-white backdrop-blur">
          <LeafIcon className="h-4 w-4 shrink-0 text-secondary" />
          Đặt lá bệnh vào giữa khung
        </div>
      </div>
    </div>);

}