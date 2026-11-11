import React from 'react';
import { Logo } from '../ui/Logo';

export function LandingFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted">
            Kết quả AI chỉ mang tính tham khảo, không thay thế chẩn đoán của chuyên gia bảo vệ thực vật.
          </p>
        </div>
        <p className="text-sm text-muted">© 2026 AI Plant Doctor. Phát triển cùng nhà nông Việt Nam.</p>
      </div>
    </footer>);

}