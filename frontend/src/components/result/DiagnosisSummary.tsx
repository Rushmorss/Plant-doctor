import React from 'react';
import { Link } from 'react-router-dom';
import { CircleCheckIcon, InfoIcon, LeafIcon, RotateCcwIcon, TriangleAlertIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { ConfidenceMeter } from '../ui/ConfidenceMeter';
import { SeverityBadge } from '../ui/SeverityBadge';
import { DemoNotice } from '../ui/DemoNotice';
import { formatScanDateTime } from '../../utils/date';
import type { Diagnosis } from '../../hooks/useDiagnosis';

export function DiagnosisSummary({ diagnosis }: {diagnosis: Diagnosis;}) {
  const { record, disease, level, conclusive, isHealthy } = diagnosis;

  const title = isHealthy ?
  'Chưa phát hiện dấu hiệu bệnh' :
  conclusive ?
  `Khả năng cao: ${record.label}` :
  'Chưa thể kết luận chắc chắn';

  return (
    <Card aria-labelledby="diagnosis-title">
      {record.source === 'mock' &&
      <div className="mb-5">
          <DemoNotice>
            <strong>Kết quả mô phỏng.</strong> Chưa kết nối mô hình AI thật — không dùng kết quả này để quyết định xử
            lý cây trồng.
          </DemoNotice>
        </div>
      }

      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5 font-medium text-ink">
          <LeafIcon className="h-4 w-4 text-primary" aria-hidden="true" />
          {record.cropName}
        </span>
        <span aria-hidden="true">·</span>
        <time dateTime={record.scannedAt}>{formatScanDateTime(record.scannedAt)}</time>
      </p>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted">Dự đoán của AI</p>
          <h1 id="diagnosis-title" className="mt-0.5 break-words text-[22px] font-bold leading-snug tracking-tight text-ink md:text-[28px]">
            {title}
          </h1>
          {conclusive && disease &&
          <p className="mt-1 text-[15px] italic text-muted">
              {disease.scientificName} · {disease.pathogenType}
            </p>
          }
          {!conclusive &&
          <p className="mt-1 text-[15px] text-ink/75">
              Khả năng cao nhất: <span className="font-semibold">{record.label}</span>
            </p>
          }
          {isHealthy &&
          <p className="mt-1 flex items-center gap-1.5 text-[15px] text-primary">
              <CircleCheckIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
              Lá trong ảnh không có dấu hiệu bệnh rõ ràng
            </p>
          }
        </div>
        {conclusive && disease && <SeverityBadge severity={disease.severity} />}
      </div>

      <div className="mt-6">
        <ConfidenceMeter value={record.confidence} size="lg" />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted">
        Độ tin cậy thể hiện mức độ chắc chắn của mô hình với ảnh này, không phải xác nhận tình trạng thực tế của cây.
      </p>

      {conclusive && level === 'medium' &&
      <div className="mt-5 flex gap-3 rounded-2xl bg-warning-soft p-4 text-sm text-ink">
          <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-warning-ink" aria-hidden="true" />
          <p className="min-w-0">
            Độ tin cậy trung bình. Hãy đối chiếu các dấu hiệu bên dưới với tình trạng thực tế trên cây trước khi xử lý.
          </p>
        </div>
      }

      {!conclusive &&
      <div className="mt-5 rounded-2xl border border-warning/50 bg-warning-soft p-4">
          <div className="flex gap-3">
            <TriangleAlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-warning-ink" aria-hidden="true" />
            <div className="min-w-0">
              <p className="font-semibold text-ink">Đây chưa phải kết luận chẩn đoán</p>
              <p className="mt-1 text-sm leading-relaxed text-ink/80">
                Độ tin cậy dưới 65%, AI chưa đủ cơ sở để khẳng định. Đừng dùng thuốc dựa trên kết quả này — hãy chụp lại
                ảnh rõ hơn hoặc hỏi ý kiến chuyên gia.
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-ink">Các khả năng AI đang cân nhắc</p>
          <ul className="mt-2 space-y-2.5">
            {record.candidates.map((c) =>
          <li key={c.label}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="min-w-0 text-ink">{c.label}</span>
                  <span className="shrink-0 font-semibold tabular-nums text-ink">{c.confidence}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-warning" style={{ width: `${c.confidence}%` }} />
                </div>
              </li>
          )}
          </ul>
          <Link
          to="/app/scan"
          className="mt-3 inline-flex h-10 items-center gap-1.5 text-sm font-semibold text-warning-ink hover:underline">
          
            <RotateCcwIcon className="h-4 w-4" aria-hidden="true" />
            Chụp lại ảnh rõ hơn
          </Link>
        </div>
      }

      {disease && conclusive && <p className="mt-5 text-[15px] leading-relaxed text-ink/80">{disease.summary}</p>}
    </Card>);

}