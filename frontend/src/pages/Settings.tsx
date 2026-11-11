import React, { useState } from 'react';
import { BellIcon, DatabaseIcon, GlobeIcon, ImageIcon, InfoIcon, RotateCcwIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../components/layout/PageHeader';
import { SettingsGroup } from '../components/profile/SettingsGroup';
import { SettingsRow } from '../components/profile/SettingsRow';
import { BottomSheet } from '../components/ui/BottomSheet';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Toggle } from '../components/ui/Toggle';
import { useSettings } from '../hooks/useSettings';
import type { AppSettings } from '../hooks/useSettings';
import { historyService } from '../services/historyService';
import { getErrorMessage } from '../services/errors';
import { isMockMode } from '../services/config';

const languageOptions: {value: AppSettings['language'];label: string;disabled?: boolean;}[] = [
{ value: 'vi', label: 'Tiếng Việt' },
{ value: 'en', label: 'English (sắp ra mắt)', disabled: true }];


export function Settings() {
  const { settings, update, reset } = useSettings();
  const [confirmClear, setConfirmClear] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleClear = async () => {
    setClearing(true);
    try {
      await historyService.clear();
      toast.success('Đã xóa toàn bộ lịch sử nhận diện');
      setConfirmClear(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setClearing(false);
    }
  };

  return (
    <main className="mx-auto w-full min-w-0 max-w-3xl px-4 pb-10 md:px-8">
      <PageHeader title="Cài đặt" subtitle="Tùy chỉnh ứng dụng theo cách bạn dùng" back={{ to: '/app/profile', label: 'Hồ sơ' }} />

      <div className="space-y-6">
        <SettingsGroup title="Thông báo & hiển thị">
          <SettingsRow
            icon={BellIcon}
            label="Cảnh báo dịch bệnh"
            description="Hiện cảnh báo thời tiết thuận lợi cho bệnh trên Trang chủ"
            trailing={
            <Toggle checked={settings.diseaseAlerts} onChange={(v) => update('diseaseAlerts', v)} label="Cảnh báo dịch bệnh" />
            } />
          
          <SettingsRow
            icon={ImageIcon}
            label="Lưu ảnh chất lượng cao"
            description="Ảnh nét hơn trong lịch sử nhưng tốn bộ nhớ hơn"
            trailing={
            <Toggle
              checked={settings.highQualityImages}
              onChange={(v) => update('highQualityImages', v)}
              label="Lưu ảnh chất lượng cao" />

            } />
          
          <li className="flex min-w-0 flex-col gap-3 px-2 py-3 sm:flex-row sm:items-center">
            <span className="flex min-w-0 flex-1 items-center gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <GlobeIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-medium text-ink">Ngôn ngữ</span>
            </span>
            <Select
              label="Ngôn ngữ"
              hideLabel
              value={settings.language}
              options={languageOptions}
              onChange={(v) => update('language', v)}
              className="sm:w-56" />
            
          </li>
        </SettingsGroup>

        <SettingsGroup title="Dữ liệu">
          <SettingsRow
            icon={DatabaseIcon}
            label="Nguồn dữ liệu"
            description={
            isMockMode ?
            'Chế độ demo — chưa kết nối máy chủ. Dữ liệu lưu trên thiết bị này.' :
            'Đã kết nối máy chủ AI Plant Doctor'
            } />
          
          <SettingsRow
            icon={Trash2Icon}
            tone="danger"
            label="Xóa lịch sử nhận diện"
            description="Xóa toàn bộ kết quả và ảnh đã phân tích"
            onClick={() => setConfirmClear(true)} />
          
          <SettingsRow
            icon={RotateCcwIcon}
            label="Khôi phục cài đặt mặc định"
            onClick={() => {
              reset();
              toast.success('Đã khôi phục cài đặt mặc định');
            }} />
          
        </SettingsGroup>

        <SettingsGroup title="Thông tin">
          <SettingsRow icon={InfoIcon} label="Phiên bản" value="2.5.0" />
        </SettingsGroup>
      </div>

      <BottomSheet open={confirmClear} onClose={() => setConfirmClear(false)} title="Xóa toàn bộ lịch sử?">
        <p className="text-[15px] leading-relaxed text-ink/80">
          Tất cả kết quả nhận diện và ảnh đã lưu sẽ bị xóa vĩnh viễn khỏi thiết bị. Thao tác này không thể hoàn tác.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="outline" size="lg" onClick={() => setConfirmClear(false)}>
            Hủy
          </Button>
          <Button variant="danger" size="lg" loading={clearing} onClick={handleClear}>
            Xóa tất cả
          </Button>
        </div>
      </BottomSheet>
    </main>);

}