import React from 'react';
import { Link } from 'react-router-dom';
import { ScanLineIcon } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8 lg:pb-24">
      <div className="flex flex-col items-start gap-6 rounded-[28px] bg-primary px-6 py-10 text-white md:flex-row md:items-center md:justify-between md:px-12 md:py-14">
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Bảo vệ mùa vụ từ hôm nay</h2>
          <p className="mt-2 max-w-lg text-white/85">
            Miễn phí cho nông dân và sinh viên. Phát hiện sớm giúp giảm đáng kể chi phí thuốc và thiệt hại.
          </p>
        </div>
        <Link
          to="/register"
          className="inline-flex h-12 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-white px-6 font-semibold text-primary transition-[background-color,transform] duration-150 ease-out hover:bg-primary-soft active:scale-[0.98]">
          
          <ScanLineIcon className="h-5 w-5" aria-hidden="true" />
          Quét cây đầu tiên
        </Link>
      </div>
    </section>);

}