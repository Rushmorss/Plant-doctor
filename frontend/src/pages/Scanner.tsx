import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, XIcon, ZapIcon, ZapOffIcon } from 'lucide-react';
import { useScanner } from '../hooks/useScanner';
import { ViewfinderGuide } from '../components/scanner/ViewfinderGuide';
import { AnalyzingOverlay } from '../components/scanner/AnalyzingOverlay';
import { AnalysisProgress } from '../components/scanner/AnalysisProgress';
import { CameraControls } from '../components/scanner/CameraControls';
import { CameraStartPanel } from '../components/scanner/CameraStartPanel';
import { PreviewControls } from '../components/scanner/PreviewControls';
import { ScanTipsList } from '../components/scanner/ScanTipsList';
import { UploadDropzone } from '../components/scanner/UploadDropzone';
import { ScanProblemSheet } from '../components/scanner/ScanProblemSheet';
import { BottomSheet } from '../components/ui/BottomSheet';
import { DemoNotice } from '../components/ui/DemoNotice';
import { isMockMode } from '../services/config';
import { IMAGE_ACCEPT_ATTR } from '../utils/image';

const phaseTitle = {
  idle: 'Quét cây trồng',
  camera: 'Căn lá vào khung',
  preview: 'Xem trước ảnh',
  analyzing: 'Đang phân tích'
};

export function Scanner() {
  const scanner = useScanner();
  const { phase, camera, image } = scanner;
  const galleryRef = useRef<HTMLInputElement>(null);
  const nativeCameraRef = useRef<HTMLInputElement>(null);
  const [tipsOpen, setTipsOpen] = useState(false);

  const cameraLive = phase === 'camera' && camera.status === 'active';
  const showStartPanel = phase === 'idle' || phase === 'camera' && camera.status !== 'active' || scanner.validating;
  const showImage = Boolean(image) && (phase === 'preview' || phase === 'analyzing');

  const openGallery = () => galleryRef.current?.click();
  const openNativeCamera = () => nativeCameraRef.current?.click();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void scanner.selectFile(file);
    e.target.value = '';
  };

  const reselect = () => {
    if (image?.source === 'camera') void scanner.openCamera();else
    openGallery();
  };

  return (
    <main className="min-h-[100dvh] w-full min-w-0 bg-ink md:bg-canvas md:px-8 md:py-8">
      <input ref={galleryRef} type="file" accept={IMAGE_ACCEPT_ATTR} className="sr-only" tabIndex={-1} aria-hidden="true" onChange={handleInput} />
      <input
        ref={nativeCameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={handleInput} />
      

      <div className="mx-auto w-full lg:grid lg:max-w-6xl lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start lg:gap-12">
        <section
          aria-label="Khung camera"
          className="relative mx-auto h-[100dvh] w-full overflow-hidden bg-ink md:h-[min(800px,calc(100dvh-4rem))] md:max-w-[420px] md:rounded-[32px] md:shadow-lift lg:max-w-none">
          
          <video
            ref={camera.videoRef}
            playsInline
            muted
            autoPlay
            aria-label="Hình ảnh trực tiếp từ camera"
            className={`absolute inset-0 h-full w-full object-cover ${cameraLive ? '' : 'hidden'}`} />
          
          {showImage && image &&
          <img src={image.url} alt="Ảnh cây trồng đã chọn" className="absolute inset-0 h-full w-full object-cover" />
          }
          {cameraLive && <ViewfinderGuide />}
          {phase === 'analyzing' && <AnalyzingOverlay />}
          {showStartPanel &&
          <CameraStartPanel
            status={phase === 'idle' ? 'idle' : camera.status}
            validating={scanner.validating}
            onOpenCamera={scanner.openCamera}
            onGallery={openGallery}
            onNativeCamera={openNativeCamera} />

          }

          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-2 p-4 pt-[max(1rem,env(safe-area-inset-top))]">
            <Link
              to="/app"
              aria-label="Đóng trình quét"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-colors duration-150 hover:bg-black/60">
              
              <XIcon className="h-5 w-5" />
            </Link>
            <span className="min-w-0 truncate rounded-full bg-black/45 px-3.5 py-1.5 text-sm font-semibold text-white backdrop-blur">
              {phaseTitle[phase]}
            </span>
            {cameraLive && camera.torchSupported ?
            <button
              type="button"
              onClick={camera.toggleTorch}
              aria-pressed={camera.torchOn}
              aria-label={camera.torchOn ? 'Tắt đèn flash' : 'Bật đèn flash'}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full backdrop-blur transition-colors duration-150 ${
              camera.torchOn ? 'bg-warning text-ink' : 'bg-black/45 text-white hover:bg-black/60'}`
              }>
              
                {camera.torchOn ? <ZapIcon className="h-5 w-5" /> : <ZapOffIcon className="h-5 w-5" />}
              </button> :

            <span className="h-11 w-11 shrink-0" aria-hidden="true" />
            }
          </div>

          {(cameraLive || phase === 'preview' || phase === 'analyzing') &&
          <div className="absolute inset-x-0 bottom-0 z-10 rounded-t-[28px] bg-black/60 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
              {cameraLive && <CameraControls onCapture={scanner.capture} onGallery={openGallery} onTips={() => setTipsOpen(true)} />}
              {phase === 'preview' &&
            <PreviewControls
              cropHint={scanner.cropHint}
              onCropHint={scanner.setCropHint}
              onDelete={scanner.clearImage}
              onReselect={reselect}
              reselectLabel={image?.source === 'camera' ? 'Chụp lại' : 'Chọn ảnh khác'}
              onAnalyze={scanner.analyze} />

            }
              {phase === 'analyzing' && <AnalysisProgress stepIndex={scanner.stepIndex} onCancel={scanner.cancelAnalysis} />}
            </div>
          }
        </section>

        <aside className="hidden min-w-0 pt-2 lg:block">
          <h1 className="text-3xl font-bold tracking-tight text-ink">Chẩn đoán bằng AI</h1>
          <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">
            Chụp bằng camera bên trái hoặc tải ảnh có sẵn. Kết quả kèm độ tin cậy và hướng dẫn chăm sóc.
          </p>
          {isMockMode &&
          <div className="mt-6">
              <DemoNotice>Chưa kết nối mô hình AI thật. Kết quả phân tích hiện là dữ liệu mô phỏng để kiểm thử giao diện.</DemoNotice>
            </div>
          }
          <div className="mt-6">
            <UploadDropzone onFile={(file) => void scanner.selectFile(file)} onBrowse={openGallery} />
          </div>
          <h2 className="mt-10 font-semibold text-ink">Mẹo để có kết quả chính xác</h2>
          <div className="mt-4">
            <ScanTipsList />
          </div>
          <p className="mt-8 flex items-start gap-2 text-sm text-muted">
            <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            Ảnh của bạn chỉ được dùng để phân tích và không chia sẻ với bên thứ ba.
          </p>
        </aside>
      </div>

      <BottomSheet open={tipsOpen} onClose={() => setTipsOpen(false)} title="Mẹo chụp ảnh chính xác">
        <ScanTipsList />
      </BottomSheet>

      <ScanProblemSheet
        problem={scanner.problem}
        hasImage={Boolean(image)}
        onClose={scanner.dismissProblem}
        onOpenCamera={() => {
          scanner.dismissProblem();
          void scanner.openCamera();
        }}
        onChooseOther={() => {
          scanner.dismissProblem();
          openGallery();
        }}
        onRetry={() => {
          scanner.dismissProblem();
          void scanner.analyze();
        }} />
      
    </main>);

}