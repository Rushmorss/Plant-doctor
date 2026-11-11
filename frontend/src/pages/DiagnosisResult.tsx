import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { FileQuestionIcon, ScanLineIcon, Share2Icon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { useDiagnosis } from '../hooks/useDiagnosis';
import { ResultHero } from '../components/result/ResultHero';
import { DiagnosisSummary } from '../components/result/DiagnosisSummary';
import { DiagnosisDetailsTabs } from '../components/result/DiagnosisDetailsTabs';
import { ExpertAdviceCard } from '../components/result/ExpertAdviceCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { BottomSheet } from '../components/ui/BottomSheet';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { buttonClasses } from '../components/ui/buttonStyles';
import { historyService } from '../services/historyService';
import { getErrorMessage } from '../services/errors';
import { buildDiagnosisSummary } from '../utils/diagnosisText';
import { shareText } from '../utils/share';

export function DiagnosisResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fresh = Boolean((useLocation().state as {fresh?: boolean;} | null)?.fresh);
  const { data: diagnosis, loading, error, reload } = useDiagnosis(id);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const announced = useRef(false);

  useEffect(() => {
    if (fresh && diagnosis && !announced.current) {
      announced.current = true;
      toast.success('Phân tích hoàn tất — đã lưu vào lịch sử');
    }
  }, [fresh, diagnosis]);

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-6xl pb-10 md:px-8 md:pt-8" aria-busy="true">
        <div className="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
          <Skeleton className="aspect-[4/3] w-full rounded-none md:rounded-3xl lg:aspect-[4/5]" />
          <div className="mt-4 space-y-4 px-4 md:px-0 lg:mt-0">
            <div className="rounded-3xl bg-surface p-5 shadow-soft">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-4 h-7 w-3/4" />
              <Skeleton className="mt-6 h-3 w-full" />
            </div>
            <Skeleton className="h-48 w-full rounded-3xl" />
          </div>
        </div>
      </main>);

  }

  if (error || !diagnosis) {
    const notFound = error?.code === 'not_found';
    return (
      <main className="mx-auto w-full max-w-xl px-4 pt-10">
        <Card>
          {notFound ?
          <EmptyState
            icon={FileQuestionIcon}
            title="Không tìm thấy kết quả"
            description={error?.message ?? 'Kết quả này có thể đã bị xóa.'}
            action={
            <Link to="/app/history" className={buttonClasses('primary', 'lg')}>
                  Về lịch sử nhận diện
                </Link>
            } /> :


          <ErrorState message={error?.message ?? 'Không tải được kết quả.'} onRetry={reload} />
          }
        </Card>
      </main>);

  }

  const { record, disease, conclusive, isHealthy, needsExpert } = diagnosis;
  const summaryText = buildDiagnosisSummary(diagnosis);

  const expertReason = !conclusive ?
  'Độ tin cậy thấp. Chuyên gia bảo vệ thực vật có thể kiểm tra trực tiếp và đưa ra chẩn đoán chính xác.' :
  disease?.severity === 'high' ?
  'Đây là bệnh lây lan nhanh. Hãy xác nhận với chuyên gia trước khi dùng thuốc bảo vệ thực vật.' :
  'Kỹ sư bảo vệ thực vật có thể giúp bạn chọn biện pháp phù hợp với vườn của mình.';

  const handleShare = async () => {
    const result = await shareText('Kết quả AI Plant Doctor', summaryText);
    if (result === 'copied') toast.success('Đã sao chép kết quả');
    if (result === 'failed') toast.error('Không thể chia sẻ trên trình duyệt này');
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await historyService.remove(record.id);
      toast.success('Đã xóa kết quả khỏi lịch sử');
      navigate('/app/history', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
      setDeleting(false);
    }
  };

  return (
    <main className="mx-auto w-full min-w-0 max-w-6xl pb-10 md:px-8 md:pt-8">
      <div className="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
        <div className="min-w-0 lg:sticky lg:top-8 lg:self-start">
          <ResultHero image={record.image} cropName={record.cropName} location={record.location} />
        </div>

        <div className="relative -mt-6 min-w-0 space-y-4 px-4 md:mt-6 md:px-0 lg:mt-0">
          <DiagnosisSummary diagnosis={diagnosis} />
          <DiagnosisDetailsTabs disease={isHealthy ? null : disease} tentative={!conclusive} />
          {!isHealthy && <ExpertAdviceCard emphasized={needsExpert} reason={expertReason} summaryText={summaryText} />}

          <div className="space-y-2.5 pt-2">
            <Link to="/app/scan" className={buttonClasses('primary', 'lg', 'w-full')}>
              <ScanLineIcon className="h-5 w-5" aria-hidden="true" />
              Quét ảnh khác
            </Link>
            <div className="grid grid-cols-2 gap-2.5">
              <Button variant="outline" size="lg" onClick={handleShare}>
                <Share2Icon className="h-5 w-5" aria-hidden="true" />
                Chia sẻ
              </Button>
              <Button variant="dangerOutline" size="lg" onClick={() => setConfirmDelete(true)}>
                <Trash2Icon className="h-5 w-5" aria-hidden="true" />
                Xóa
              </Button>
            </div>
          </div>

          <p className="px-1 pt-2 text-xs leading-relaxed text-muted">
            Kết quả do AI tạo ra chỉ mang tính tham khảo, không thay thế chẩn đoán của chuyên gia. Khi sử dụng thuốc bảo
            vệ thực vật, hãy tuân thủ đúng hướng dẫn trên nhãn và thời gian cách ly.
          </p>
        </div>
      </div>

      <BottomSheet open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Xóa kết quả này?">
        <p className="text-[15px] leading-relaxed text-ink/80">
          Kết quả và ảnh đã phân tích sẽ bị xóa khỏi lịch sử. Thao tác này không thể hoàn tác.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="outline" size="lg" onClick={() => setConfirmDelete(false)}>
            Hủy
          </Button>
          <Button variant="danger" size="lg" loading={deleting} onClick={handleDelete}>
            Xóa
          </Button>
        </div>
      </BottomSheet>
    </main>);

}