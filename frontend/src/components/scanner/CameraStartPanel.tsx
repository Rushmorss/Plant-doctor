import React from 'react';
import { CameraIcon, CameraOffIcon, ImageIcon, SmartphoneIcon } from 'lucide-react';
import { Spinner } from '../ui/Spinner';
import type { CameraStatus } from '../../hooks/useCamera';

interface CameraStartPanelProps {
  status: CameraStatus;
  validating: boolean;
  onOpenCamera: () => void;
  onGallery: () => void;
  onNativeCamera: () => void;
}

const copy: Record<Exclude<CameraStatus, 'active' | 'requesting'>, {title: string;description: string;}> = {
  idle: {
    title: 'Chụp ảnh lá cây',
    description: 'Mở camera để chụp trực tiếp, hoặc chọn ảnh có sẵn (JPG, PNG, WEBP · tối đa 10 MB).'
  },
  denied: {
    title: 'Chưa có quyền dùng camera',
    description: 'Hãy cho phép truy cập camera trong cài đặt trình duyệt, hoặc chụp bằng ứng dụng camera của máy.'
  },
  unavailable: {
    title: 'Không tìm thấy camera khả dụng',
    description: 'Trình duyệt không hỗ trợ camera trực tiếp. Bạn vẫn có thể chụp bằng ứng dụng camera hoặc chọn ảnh.'
  },
  error: {
    title: 'Không mở được camera',
    description: 'Camera có thể đang được ứng dụng khác sử dụng. Hãy thử lại hoặc chọn ảnh từ thư viện.'
  }
};

const ghostButton =
'inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-white/15 px-4 font-semibold text-white transition-colors duration-150 hover:bg-white/25';
const primaryButton =
'inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-4 font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-primary-dark active:scale-[0.98]';

export function CameraStartPanel({ status, validating, onOpenCamera, onGallery, onNativeCamera }: CameraStartPanelProps) {
  if (status === 'requesting' || validating) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink px-6 text-center text-white">
        <Spinner className="h-8 w-8 text-secondary" label={validating ? 'Đang kiểm tra ảnh' : 'Đang mở camera'} />
        <p className="font-semibold">{validating ? 'Đang kiểm tra ảnh…' : 'Đang mở camera…'}</p>
        {!validating && <p className="max-w-xs text-sm text-white/70">Hãy chọn “Cho phép” khi trình duyệt hỏi quyền truy cập camera.</p>}
      </div>);

  }
  if (status === 'active') return null;

  const { title, description } = copy[status];
  const failed = status !== 'idle';

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-y-auto bg-ink px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-20 text-center text-white">
      <span className={`flex h-16 w-16 items-center justify-center rounded-2xl ${failed ? 'bg-danger/20 text-[#ff8a80]' : 'bg-white/10 text-secondary'}`}>
        {failed ? <CameraOffIcon className="h-8 w-8" aria-hidden="true" /> : <CameraIcon className="h-8 w-8" aria-hidden="true" />}
      </span>
      <h2 className="mt-5 text-xl font-bold">{title}</h2>
      <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-white/75">{description}</p>
      <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
        {status !== 'unavailable' &&
        <button type="button" onClick={onOpenCamera} className={primaryButton}>
            <CameraIcon className="h-5 w-5" aria-hidden="true" />
            {failed ? 'Thử mở lại camera' : 'Mở camera'}
          </button>
        }
        {failed &&
        <button type="button" onClick={onNativeCamera} className={status === 'unavailable' ? primaryButton : ghostButton}>
            <SmartphoneIcon className="h-5 w-5" aria-hidden="true" />
            Chụp bằng ứng dụng camera
          </button>
        }
        <button type="button" onClick={onGallery} className={ghostButton}>
          <ImageIcon className="h-5 w-5" aria-hidden="true" />
          Chọn ảnh từ thư viện
        </button>
      </div>
    </div>);

}