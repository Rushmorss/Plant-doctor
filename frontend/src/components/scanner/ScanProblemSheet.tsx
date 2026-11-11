import React from 'react';
import { Link } from 'react-router-dom';
import { ImageOffIcon, SearchXIcon, WifiOffIcon } from 'lucide-react';
import { BottomSheet } from '../ui/BottomSheet';
import { Button } from '../ui/Button';
import { buttonClasses } from '../ui/buttonStyles';
import type { ScanProblem } from '../../hooks/useScanner';

interface ScanProblemSheetProps {
  problem: ScanProblem | null;
  hasImage: boolean;
  onClose: () => void;
  onOpenCamera: () => void;
  onChooseOther: () => void;
  onRetry: () => void;
}

const meta = {
  invalid: { title: 'Hình ảnh không hợp lệ', icon: ImageOffIcon, tone: 'bg-danger-soft text-danger-ink' },
  unrecognized: { title: 'Không thể nhận diện cây trồng', icon: SearchXIcon, tone: 'bg-warning-soft text-warning-ink' },
  network: { title: 'Mất kết nối máy chủ AI', icon: WifiOffIcon, tone: 'bg-danger-soft text-danger-ink' }
};

export function ScanProblemSheet({ problem, hasImage, onClose, onOpenCamera, onChooseOther, onRetry }: ScanProblemSheetProps) {
  const info = problem ? meta[problem.kind] : meta.invalid;
  const Icon = info.icon;

  return (
    <BottomSheet open={problem !== null} onClose={onClose} title={info.title}>
      <div className="flex flex-col items-center pt-2 text-center">
        <span className={`flex h-16 w-16 items-center justify-center rounded-2xl ${info.tone}`}>
          <Icon className="h-8 w-8" aria-hidden="true" />
        </span>
        <p className="mt-4 text-[15px] leading-relaxed text-ink/80" role="alert">
          {problem?.message}
        </p>
        {problem?.kind === 'unrecognized' &&
        <p className="mt-3 rounded-xl bg-canvas px-4 py-3 text-sm text-muted">
            Chúng tôi không đưa ra chẩn đoán khi chưa nhận diện được cây, để tránh hướng dẫn sai.
          </p>
        }
        {problem?.kind === 'network' &&
        <p className="mt-3 rounded-xl bg-canvas px-4 py-3 text-sm text-muted">Ảnh của bạn vẫn được giữ lại để gửi lại.</p>
        }
      </div>
      <div className="mt-6 space-y-2.5">
        {problem?.kind === 'network' && hasImage ?
        <>
            <Button size="lg" fullWidth onClick={onRetry}>
              Thử gửi lại
            </Button>
            <Button size="lg" variant="outline" fullWidth onClick={onClose}>
              Để sau
            </Button>
          </> :

        <>
            <Button size="lg" fullWidth onClick={onOpenCamera}>
              Chụp ảnh mới
            </Button>
            <Button size="lg" variant="outline" fullWidth onClick={onChooseOther}>
              Chọn ảnh khác
            </Button>
            {problem?.kind === 'unrecognized' &&
          <Link to="/app/library" className={buttonClasses('ghost', 'lg', 'w-full')}>
                Tra cứu thư viện bệnh
              </Link>
          }
          </>
        }
      </div>
    </BottomSheet>);

}