import React from 'react';
import { images } from '../../data/images';
import { modelFacts, visionPipeline } from '../../data/landingContent';

const detections = [
{ top: '22%', left: '30%', width: '24%', height: '20%', label: 'Vết bệnh · 0.94' },
{ top: '52%', left: '52%', width: '22%', height: '18%', label: 'Vết bệnh · 0.89' }];


export function TechnologySection() {
  return (
    <section id="cong-nghe" className="scroll-mt-20 bg-surface">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-5 py-16 md:px-8 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div className="relative order-2 min-w-0 lg:order-1">
          <div className="relative aspect-square overflow-hidden rounded-[28px] bg-ink">
            <img
              src={images.tomatoBlight}
              alt="Lá cà chua với các vùng vết bệnh được AI khoanh vùng"
              className="h-full w-full object-cover" />
            
            {detections.map((box) =>
            <div
              key={box.label}
              className="absolute rounded-lg border-2 border-secondary"
              style={{ top: box.top, left: box.left, width: box.width, height: box.height }}>
              
                <span className="absolute -top-7 left-0 whitespace-nowrap rounded-md bg-secondary px-2 py-0.5 text-xs font-semibold text-ink">
                  {box.label}
                </span>
              </div>
            )}
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl bg-ink/80 px-4 py-3 text-white backdrop-blur">
              <span className="text-sm">Cà chua · Bệnh mốc sương</span>
              <span className="font-bold text-secondary">94%</span>
            </div>
          </div>
        </div>

        <div className="order-1 min-w-0 lg:order-2">
          <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Thị giác máy tính, được huấn luyện cho đồng ruộng Việt Nam
          </h2>
          <p className="mt-4 leading-relaxed text-ink/75">
            Mô hình học sâu được huấn luyện trên ảnh chụp thực tế từ ruộng lúa đồng bằng, vườn cà phê Tây
            Nguyên đến nhà lưới Đà Lạt — trong đủ điều kiện ánh sáng và góc chụp.
          </p>

          <ol className="mt-8 border-l border-line">
            {visionPipeline.map((step, index) =>
            <li key={step.title} className="relative pb-6 pl-7 last:pb-0">
                <span
                className="absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full border border-secondary bg-surface text-xs font-semibold text-primary"
                aria-hidden="true">
                
                  {index + 1}
                </span>
                <h3 className="font-semibold text-ink">{step.title}</h3>
                <p className="mt-1 text-[15px] text-ink/70">{step.description}</p>
              </li>
            )}
          </ol>

          <dl className="mt-10 grid grid-cols-3 divide-x divide-line border-t border-line pt-6">
            {modelFacts.map((fact) =>
            <div key={fact.label} className="min-w-0 px-2 first:pl-0 sm:px-3">
                <dt className="sr-only">{fact.label}</dt>
                <dd className="text-lg font-bold text-ink min-[375px]:text-xl md:text-2xl">{fact.value}</dd>
                <dd className="mt-1 text-xs leading-snug text-muted md:text-sm">{fact.label}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </section>);

}