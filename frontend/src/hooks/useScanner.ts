import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCamera } from './useCamera';
import { readSettings } from './useSettings';
import { analysisSteps } from '../data/scanner';
import { scanService } from '../services/scanService';
import { historyService } from '../services/historyService';
import { getErrorCode, getErrorMessage, isAbortError } from '../services/errors';
import { compressImage, MIN_IMAGE_SIDE, readImageDimensions, validateImageFile } from '../utils/image';

export type ScannerPhase = 'idle' | 'camera' | 'preview' | 'analyzing';

export interface ScanProblem {
  kind: 'invalid' | 'unrecognized' | 'network';
  message: string;
}

export interface SelectedImage {
  url: string;
  source: 'camera' | 'upload';
  isObjectUrl: boolean;
}

const STEP_INTERVAL = 700;

export function useScanner() {
  const navigate = useNavigate();
  const camera = useCamera();
  const [phase, setPhase] = useState<ScannerPhase>('idle');
  const [image, setImage] = useState<SelectedImage | null>(null);
  const [problem, setProblem] = useState<ScanProblem | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [cropHint, setCropHint] = useState('auto');
  const [validating, setValidating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const stepTimer = useRef<number | undefined>(undefined);
  const imageRef = useRef<SelectedImage | null>(null);

  const replaceImage = useCallback((next: SelectedImage | null) => {
    const prev = imageRef.current;
    if (prev?.isObjectUrl && prev.url !== next?.url) URL.revokeObjectURL(prev.url);
    imageRef.current = next;
    setImage(next);
  }, []);

  const stopSteps = () => window.clearInterval(stepTimer.current);

  useEffect(
    () => () => {
      abortRef.current?.abort();
      window.clearInterval(stepTimer.current);
      const current = imageRef.current;
      if (current?.isObjectUrl) URL.revokeObjectURL(current.url);
    },
    []
  );

  const openCamera = useCallback(async () => {
    setProblem(null);
    replaceImage(null);
    setPhase('camera');
    await camera.start();
  }, [camera, replaceImage]);

  const capture = useCallback(() => {
    const url = camera.capture();
    if (!url) {
      toast.error('Không chụp được ảnh. Vui lòng thử lại.');
      return;
    }
    camera.stop();
    replaceImage({ url, source: 'camera', isObjectUrl: false });
    setPhase('preview');
  }, [camera, replaceImage]);

  const selectFile = useCallback(
    async (file: File) => {
      setProblem(null);
      const validation = validateImageFile(file);
      if (!validation.ok) {
        setProblem({ kind: 'invalid', message: validation.reason });
        return;
      }
      setValidating(true);
      const url = URL.createObjectURL(file);
      try {
        const { width, height } = await readImageDimensions(url);
        if (Math.min(width, height) < MIN_IMAGE_SIDE) {
          URL.revokeObjectURL(url);
          setProblem({
            kind: 'invalid',
            message: `Ảnh có độ phân giải quá thấp (${width}×${height}px). Cần tối thiểu ${MIN_IMAGE_SIDE}px mỗi cạnh để AI nhận diện chính xác.`
          });
          return;
        }
      } catch {
        URL.revokeObjectURL(url);
        setProblem({ kind: 'invalid', message: 'Không đọc được tệp ảnh. Tệp có thể bị hỏng, hãy chọn ảnh khác.' });
        return;
      } finally {
        setValidating(false);
      }
      camera.stop();
      replaceImage({ url, source: 'upload', isObjectUrl: true });
      setPhase('preview');
    },
    [camera, replaceImage]
  );

  const clearImage = useCallback(() => {
    replaceImage(null);
    setStepIndex(0);
    setPhase('idle');
  }, [replaceImage]);

  const analyze = useCallback(async () => {
    const current = imageRef.current;
    if (!current) return;
    setProblem(null);
    setPhase('analyzing');
    setStepIndex(0);
    const controller = new AbortController();
    abortRef.current = controller;
    stepTimer.current = window.setInterval(
      () => setStepIndex((i) => Math.min(i + 1, analysisSteps.length - 1)),
      STEP_INTERVAL
    );

    try {
      const maxSide = readSettings().highQualityImages ? 1024 : 640;
      const prepared = await compressImage(current.url, maxSide);
      const record = await scanService.analyze({ image: prepared, cropHint }, controller.signal);
      stopSteps();
      setStepIndex(analysisSteps.length);
      const { persisted } = historyService.add(record);
      if (!persisted) toast.warning('Bộ nhớ thiết bị đầy — kết quả chỉ được giữ trong phiên này.');
      navigate(`/app/result/${record.id}`, { state: { fresh: true } });
    } catch (err) {
      stopSteps();
      if (isAbortError(err)) return;
      const code = getErrorCode(err);
      setProblem({
        kind: code === 'invalid_image' ? 'invalid' : code === 'unrecognized' ? 'unrecognized' : 'network',
        message: getErrorMessage(err)
      });
      setStepIndex(0);
      setPhase('preview');
    }
  }, [cropHint, navigate]);

  const cancelAnalysis = useCallback(() => {
    abortRef.current?.abort();
    stopSteps();
    setStepIndex(0);
    setPhase('preview');
    toast('Đã hủy phân tích');
  }, []);

  return {
    camera,
    phase,
    image,
    problem,
    dismissProblem: () => setProblem(null),
    stepIndex,
    cropHint,
    setCropHint,
    validating,
    openCamera,
    capture,
    selectFile,
    clearImage,
    analyze,
    cancelAnalysis
  };
}