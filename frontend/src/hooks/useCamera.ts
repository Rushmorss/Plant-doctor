import { useCallback, useEffect, useRef, useState } from 'react';

export type CameraStatus = 'idle' | 'requesting' | 'active' | 'denied' | 'unavailable' | 'error';

type TorchCapabilities = MediaTrackCapabilities & {torch?: boolean;};

/** Mở camera sau của điện thoại qua getUserMedia, chụp khung hình và bật/tắt đèn flash nếu thiết bị hỗ trợ. */
export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>('idle');
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  const isSupported = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setTorchOn(false);
    setTorchSupported(false);
    setStatus('idle');
  }, []);

  const start = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setStatus('unavailable');
      return false;
    }
    setStatus('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await video.play().catch(() => undefined);
      }
      const track = stream.getVideoTracks()[0];
      const capabilities = (track?.getCapabilities?.() ?? {}) as TorchCapabilities;
      setTorchSupported(Boolean(capabilities.torch));
      setStatus('active');
      return true;
    } catch (err) {
      const name = err instanceof DOMException ? err.name : '';
      if (name === 'NotAllowedError' || name === 'SecurityError') setStatus('denied');else
      if (name === 'NotFoundError' || name === 'OverconstrainedError') setStatus('unavailable');else
      setStatus('error');
      return false;
    }
  }, [isSupported]);

  const toggleTorch = useCallback(async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    try {
      await track.applyConstraints({ advanced: [{ torch: !torchOn } as unknown as MediaTrackConstraintSet] });
      setTorchOn((v) => !v);
    } catch {
      setTorchSupported(false);
    }
  }, [torchOn]);

  const capture = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return null;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.92);
  }, []);

  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);

  return { videoRef, status, isSupported, start, stop, capture, torchSupported, torchOn, toggleTorch };
}