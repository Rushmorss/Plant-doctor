import React, { useState } from 'react';
import { ImageUpIcon } from 'lucide-react';
import { Button } from '../ui/Button';

interface UploadDropzoneProps {
  onFile: (file: File) => void;
  onBrowse: () => void;
}

export function UploadDropzone({ onFile, onBrowse }: UploadDropzoneProps) {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onFile(file);
      }}
      className={`flex flex-col items-center rounded-3xl border-2 border-dashed px-6 py-10 text-center transition-colors duration-150 ${
      dragging ? 'border-primary bg-primary-soft' : 'border-line bg-surface'}`
      }>
      
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <ImageUpIcon className="h-7 w-7" aria-hidden="true" />
      </span>
      <p className="mt-4 font-semibold text-ink">Kéo thả ảnh lá cây vào đây</p>
      <p className="mt-1 text-sm text-muted">JPG, JPEG, PNG, WEBP · tối đa 10 MB</p>
      <Button variant="soft" className="mt-5" onClick={onBrowse}>
        Chọn ảnh từ máy
      </Button>
    </div>);

}