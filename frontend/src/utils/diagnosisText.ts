import type { Diagnosis } from '../hooks/useDiagnosis';
import { formatScanDateTime } from './date';

/** Văn bản tóm tắt để sao chép / chia sẻ cho chuyên gia. */
export function buildDiagnosisSummary({ record, disease, conclusive, isHealthy }: Diagnosis): string {
  const verdict = isHealthy ?
  'Chưa phát hiện dấu hiệu bệnh' :
  conclusive ?
  `Khả năng cao: ${record.label}` :
  `Chưa kết luận (khả năng cao nhất: ${record.label})`;
  const lines = [
  'Kết quả AI Plant Doctor',
  `Cây trồng: ${record.cropName}`,
  `Dự đoán: ${verdict}`,
  `Độ tin cậy AI: ${record.confidence}%`,
  `Thời gian: ${formatScanDateTime(record.scannedAt)}`];

  if (disease && !isHealthy) lines.push(`Dấu hiệu tham khảo: ${disease.symptoms.slice(0, 2).join('; ')}`);
  if (record.source === 'mock') lines.push('(Kết quả mô phỏng — chưa kết nối mô hình AI thật)');
  lines.push('Kết quả AI chỉ mang tính tham khảo, cần chuyên gia xác nhận.');
  return lines.join('\n');
}