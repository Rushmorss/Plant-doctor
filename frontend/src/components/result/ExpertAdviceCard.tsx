import React, { useState } from 'react';
import { ChevronRightIcon, CopyIcon, MapPinIcon, Share2Icon, StethoscopeIcon } from 'lucide-react';
import { toast } from 'sonner';
import { BottomSheet } from '../ui/BottomSheet';
import { Button } from '../ui/Button';
import { copyText, shareText } from '../../utils/share';

interface ExpertAdviceCardProps {
  emphasized: boolean;
  reason: string;
  summaryText: string;
}

type OptionAction = 'copy' | 'share' | 'map';

const options: {icon: typeof CopyIcon;title: string;description: string;action: OptionAction;}[] = [
{
  icon: CopyIcon,
  title: 'Sao chép kết quả',
  description: 'Dán vào tin nhắn Zalo, SMS hoặc email gửi chuyên gia',
  action: 'copy'
},
{
  icon: Share2Icon,
  title: 'Chia sẻ qua ứng dụng khác',
  description: 'Mở bảng chia sẻ của điện thoại',
  action: 'share'
},
{
  icon: MapPinIcon,
  title: 'Tìm trạm khuyến nông gần bạn',
  description: 'Mở Google Maps trong tab mới',
  action: 'map'
}];


export function ExpertAdviceCard({ emphasized, reason, summaryText }: ExpertAdviceCardProps) {
  const [open, setOpen] = useState(false);

  const handleOption = async (action: OptionAction) => {
    setOpen(false);
    if (action === 'map') {
      window.open('https://www.google.com/maps/search/tr%E1%BA%A1m+khuy%E1%BA%BFn+n%C3%B4ng', '_blank', 'noopener');
      return;
    }
    const result = action === 'copy' ? await copyText(summaryText) : await shareText('Kết quả AI Plant Doctor', summaryText);
    if (result === 'copied') toast.success('Đã sao chép kết quả');
    if (result === 'failed') toast.error('Không thể chia sẻ trên trình duyệt này');
  };

  return (
    <>
      <section
        aria-labelledby="expert-title"
        className={`flex min-w-0 flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center md:p-6 ${
        emphasized ? 'bg-ink text-white' : 'bg-surface shadow-soft'}`
        }>
        
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
          emphasized ? 'bg-white/10 text-secondary' : 'bg-primary-soft text-primary'}`
          }>
          
          <StethoscopeIcon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="expert-title" className="font-semibold">
            {emphasized ? 'Nên tham khảo chuyên gia' : 'Cần thêm ý kiến?'}
          </h2>
          <p className={`mt-1 text-sm leading-relaxed ${emphasized ? 'text-white/75' : 'text-muted'}`}>{reason}</p>
        </div>
        <Button
          variant={emphasized ? 'primary' : 'soft'}
          className={`w-full sm:w-auto ${emphasized ? 'bg-secondary text-ink hover:bg-[#9fd6a1]' : ''}`}
          onClick={() => setOpen(true)}>
          
          Liên hệ chuyên gia
        </Button>
      </section>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Liên hệ chuyên gia" description="Gửi kết quả để được tư vấn">
        <ul className="divide-y divide-line">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <li key={option.title}>
                <button
                  type="button"
                  onClick={() => handleOption(option.action)}
                  className="flex w-full min-w-0 items-center gap-4 rounded-xl py-4 text-left transition-colors duration-150 hover:bg-canvas">
                  
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-ink">{option.title}</span>
                    <span className="block text-sm text-muted">{option.description}</span>
                  </span>
                  <ChevronRightIcon className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
                </button>
              </li>);

          })}
        </ul>
      </BottomSheet>
    </>);

}