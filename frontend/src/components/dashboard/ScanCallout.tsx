import React from 'react';
import { Link } from 'react-router-dom';
import { CameraIcon } from 'lucide-react';

export function ScanCallout() {
  return (
    <section className="flex min-w-0 flex-col gap-5 rounded-3xl bg-primary p-5 text-white sm:flex-row sm:items-center sm:justify-between md:p-7">
      <div className="min-w-0">
        <h2 className="text-xl font-bold md:text-2xl">Cây có dấu hiệu lạ?</h2>
        <p className="mt-1.5 max-w-md text-[15px] text-white/85">
          Chụp hoặc tải ảnh lá để AI phân tích, kèm hướng dẫn chăm sóc cụ thể.
        </p>
      </div>
      <Link
        to="/app/scan"
        className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-white px-6 font-semibold text-primary transition-[background-color,transform] duration-150 ease-out hover:bg-primary-soft active:scale-[0.98] sm:w-auto">
        
        <CameraIcon className="h-5 w-5" aria-hidden="true" />
        Quét cây ngay
      </Link>
    </section>);

}