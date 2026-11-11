import React, { useEffect, useState } from 'react';
import { BottomSheet } from '../ui/BottomSheet';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { crops } from '../../data/crops';
import type { RangeFilter } from '../../hooks/useHistoryFilters';

interface HistoryFilterSheetProps {
  open: boolean;
  onClose: () => void;
  cropId: string;
  range: RangeFilter;
  onApply: (cropId: string, range: RangeFilter) => void;
}

const ranges: {id: RangeFilter;label: string;}[] = [
{ id: 'all', label: 'Mọi thời gian' },
{ id: '7d', label: '7 ngày qua' },
{ id: '30d', label: '30 ngày qua' }];


export function HistoryFilterSheet({ open, onClose, cropId, range, onApply }: HistoryFilterSheetProps) {
  const [draftCrop, setDraftCrop] = useState(cropId);
  const [draftRange, setDraftRange] = useState<RangeFilter>(range);

  useEffect(() => {
    if (open) {
      setDraftCrop(cropId);
      setDraftRange(range);
    }
  }, [open, cropId, range]);

  return (
    <BottomSheet open={open} onClose={onClose} title="Bộ lọc lịch sử">
      <fieldset>
        <legend className="text-sm font-semibold text-ink">Loại cây trồng</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip selected={draftCrop === 'all'} onClick={() => setDraftCrop('all')}>
            Tất cả
          </Chip>
          {crops.map((crop) =>
          <Chip key={crop.id} selected={draftCrop === crop.id} onClick={() => setDraftCrop(crop.id)}>
              {crop.name}
            </Chip>
          )}
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-ink">Thời gian phân tích</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {ranges.map((r) =>
          <Chip key={r.id} selected={draftRange === r.id} onClick={() => setDraftRange(r.id)}>
              {r.label}
            </Chip>
          )}
        </div>
      </fieldset>
      <div className="mt-8 flex gap-3">
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={() => {
            setDraftCrop('all');
            setDraftRange('all');
          }}>
          
          Đặt lại
        </Button>
        <Button
          size="lg"
          className="flex-1"
          onClick={() => {
            onApply(draftCrop, draftRange);
            onClose();
          }}>
          
          Áp dụng
        </Button>
      </div>
    </BottomSheet>);

}