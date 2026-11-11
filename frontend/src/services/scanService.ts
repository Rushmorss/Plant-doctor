import { crops } from '../data/crops';
import { diseases } from '../data/diseases';
import type { ScanOutcome, ScanRecord } from '../types/plant';
import { ApiError } from './errors';
import { historyService } from './historyService';
import { getMockScenario, mockDelay } from './mockScenario';

export interface AnalyzeImageRequest {
  /** Ảnh đã nén dạng data URL (JPEG). */
  image: string;
  /** Gợi ý loại cây do người dùng chọn, 'auto' nếu để AI tự nhận diện. */
  cropHint: string;
}

const ANALYSIS_LATENCY = 2800;

/**
 * Dịch vụ phân tích ảnh.
 * CHỜ BACKEND: chưa có mô hình AI thật. Kết quả trả về được đánh dấu source='mock'
 * và giao diện luôn hiển thị cảnh báo "kết quả mô phỏng" — không dùng làm chẩn đoán.
 */
export const scanService = {
  async analyze(request: AnalyzeImageRequest, signal?: AbortSignal): Promise<ScanRecord> {
    await mockDelay(ANALYSIS_LATENCY, signal);
    const { scanOutcome, apiFailure } = getMockScenario();

    if (apiFailure) {
      throw new ApiError('network', 'Không thể kết nối tới máy chủ AI. Kiểm tra kết nối mạng rồi thử lại.');
    }
    if (scanOutcome === 'invalidImage') {
      throw new ApiError(
        'invalid_image',
        'Ảnh bị mờ hoặc không nhìn rõ lá cây. Hãy chụp lại ở khoảng cách gần hơn, đủ sáng và giữ máy cố định.'
      );
    }
    if (scanOutcome === 'unrecognized') {
      throw new ApiError(
        'unrecognized',
        'AI chưa nhận ra loại cây trong ảnh. Cây có thể chưa có trong dữ liệu, hoặc ảnh chưa thể hiện rõ đặc điểm của lá.'
      );
    }
    return buildMockResult(request, scanOutcome);
  }
};

function buildMockResult(request: AnalyzeImageRequest, outcome: ScanOutcome): ScanRecord {
  const disease = diseases.find((d) => d.cropId === request.cropHint) ?? diseases[0];
  const crop = crops.find((c) => c.id === disease.cropId) ?? crops[0];
  const base = {
    id: historyService.createId(),
    cropId: crop.id,
    cropName: crop.name,
    image: request.image,
    scannedAt: new Date().toISOString(),
    location: 'Chưa xác định vị trí',
    source: 'mock' as const
  };

  if (outcome === 'healthy') {
    return {
      ...base,
      status: 'healthy',
      diseaseId: null,
      label: 'Không phát hiện bệnh',
      confidence: 95,
      candidates: [
      { diseaseId: null, label: 'Khỏe mạnh', confidence: 95 },
      { diseaseId: disease.id, label: disease.name, confidence: 3 },
      { diseaseId: null, label: 'Thiếu dinh dưỡng', confidence: 2 }]

    };
  }

  if (outcome === 'lowConfidence') {
    return {
      ...base,
      status: 'uncertain',
      diseaseId: disease.id,
      label: disease.name,
      confidence: 58,
      candidates: [
      { diseaseId: disease.id, label: disease.name, confidence: 58 },
      { diseaseId: null, label: 'Thiếu dinh dưỡng', confidence: 24 },
      { diseaseId: null, label: 'Cháy lá do nắng', confidence: 12 }]

    };
  }

  return {
    ...base,
    status: 'disease',
    diseaseId: disease.id,
    label: disease.name,
    confidence: 92,
    candidates: [
    { diseaseId: disease.id, label: disease.name, confidence: 92 },
    { diseaseId: null, label: 'Bệnh đốm lá khác', confidence: 5 },
    { diseaseId: null, label: 'Khỏe mạnh', confidence: 3 }]

  };
}