import React from 'react';
import { FlaskConicalIcon } from 'lucide-react';

interface DemoNoticeProps {
  children: React.ReactNode;
  tone?: 'light' | 'dark';
}

/** Đánh dấu rõ các chức năng đang chạy bằng dữ liệu mô phỏng, chờ kết nối Backend. */
export function DemoNotice({ children, tone = 'light' }: DemoNoticeProps) {
  return (
    <div
      role="note"
      className={`flex gap-2.5 rounded-2xl px-4 py-3 text-sm leading-relaxed ${
      tone === 'light' ? 'border border-warning/40 bg-warning-soft text-ink' : 'bg-white/10 text-white/85'}`
      }>
      
      <FlaskConicalIcon
        className={`mt-0.5 h-4 w-4 shrink-0 ${tone === 'light' ? 'text-warning-ink' : 'text-warning'}`}
        aria-hidden="true" />
      
      <p className="min-w-0">{children}</p>
    </div>);

}